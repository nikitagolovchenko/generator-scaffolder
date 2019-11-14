const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackNotifierPlugin = require('webpack-notifier');
const webpack = require('webpack');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const ErrorsPlugin = require('friendly-errors-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const InlineSourcePlugin = require('html-webpack-inline-source-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

// optimization
const Critters = require('critters-webpack-plugin');
const config = require('./config.json');

const ENV = process.env.NODE_ENV;
const isProduction = ENV === config.env.prod;
const PORT = parseInt(process.env.PORT, 10) || config.server.port;
const HOST = process.env.HOST || config.server.host;
const URL = `http://${HOST}:${PORT}`;

const generateStaticAssets = () => {
  let assetsArray = [];

  for (const asset in config.static) {
    const assetObject = config.static[asset];
    const assetFolderExist = fs.existsSync(path.resolve(__dirname, assetObject.src));

    if (assetFolderExist) {
      assetsArray.push({
        from: path.resolve(__dirname, assetObject.src),
        to: path.resolve(__dirname, assetObject.dest),
      });
    }
  }

  return assetsArray;
};

const pluginsConfiguration = {
  BrowserSync: {
    ghost: false,
    open: false,
    online: true,
    proxy: URL,
  },
  MiniCssExtract: {
    filename: !isProduction ? `css/[name].css` : `css/[name].[contenthash].css`,
  },
  ProvidePlugin: {
    $: 'jquery',
    jQuery: 'jquery',
  },
  StyleLint: {
    configFile: 'stylelint.config.js',
    context: path.resolve(__dirname, config.styles.src),
    syntax: config.styles.extension,
  },
  ErrorsPlugin: {
    clearConsole: true,
  },
  CopyPlugin: generateStaticAssets(),
  DevServer: {
    contentBase: path.join(__dirname, config.src),
    hot: true,
    port: PORT,
    watchContentBase: true,
    liveReload: false,
    overlay: true,
    quiet: true,
    open: false,
    clientLogLevel: 'silent',
    after: (app, server, compiler) => {
      chokidar.watch([path.resolve(__dirname, `${config.templates.src}/${config.templates.glob}`)]).on('change', () => {
        server.sockWrite(server.sockets, 'content-changed');
      });
    },
  },
  ImageMin: {
    cacheFolder: path.resolve(__dirname, 'node_modules/.cache'),
    pngquant: {
      quality: '70-80',
    },
    plugins: [
      imageminMozjpeg({
        quality: 70,
        progressive: true,
      }),
    ],
  },
};

// creating new instance of plugin for each of the pages that we have
const generateHtmlPlugins = () => {
  // Read files in template directory and looking only for html files
  const templateFiles = fs.readdirSync(path.resolve(__dirname, config.templates.src));
  const files = templateFiles.filter(elm => elm.match(new RegExp(`.*\.(${config.templates.extension})`, 'ig')));

  return files.map(item => {
    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];

    // Create new HTMLWebpackPlugin with options
    return new HTMLWebpackPlugin({
      title: config.title || 'Project title',
      template: path.resolve(__dirname, `${config.templates.src}/${name}.${extension}`),
      filename: path.resolve(__dirname, `${config.dest}/${name}.${extension}`),
      chunks: [name],
      optimize: {
        prefetch: true,
      },
    });
  });
};

const htmlPlugins = generateHtmlPlugins().concat([
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer',
  }),
]);

// if (isProduction && config.critical_css) {
//   htmlPlugins.push(
//       new Critters({
//         inlineFonts: true,
//         pruneSource: true,
//         noscriptFallback: true,
//         preload: 'swap',
//       }),
//   );
// }


const getPlugins = () => {
  let devPlugins = [new BrowserSyncPlugin(pluginsConfiguration.BrowserSync)];

  let prodPlugins = [new ImageminPlugin(pluginsConfiguration.ImageMin)];

  let defaultPlugins = [
    new webpack.ProvidePlugin(pluginsConfiguration.ProvidePlugin),
    new ErrorsPlugin(pluginsConfiguration.ErrorsPlugin),
    new CopyWebpackPlugin(pluginsConfiguration.CopyPlugin),
    new MiniCssExtractPlugin(pluginsConfiguration.MiniCssExtract),
    new WebpackNotifierPlugin({
      excludeWarnings: true,
    }),
  ];

  if (!isProduction) {
    devPlugins.map(item => defaultPlugins.push(item));
  }

  if (isProduction) {
    prodPlugins.map(item => defaultPlugins.push(item));
  }

  // enable linters only if config.linters === true
  if (config.linters) {
    defaultPlugins.push(new StyleLintPlugin(pluginsConfiguration.StyleLint));
  }

  // add bundle analyze only if config.debug === true;
  if (isProduction && config.debug) {
    defaultPlugins.push(new BundleAnalyzerPlugin());
  }

  return defaultPlugins.concat(htmlPlugins);
};

const getModules = () => {
  return {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader', 'webpack-module-hot-accept'],
      },
      !isProduction
        ? {
            enforce: 'pre',
            test: /\.jsx?$/,
            loader: 'prettier-loader',
            exclude: /node_modules/,
            options: {
              parser: 'babel',
            },
          }
        : {},
      {
        test: /\.(sa|sc|c)ss$/,
        include: path.resolve(__dirname, config.styles.src),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProduction,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              config: {
                ctx: {
                  'postcss-preset-env': {},
                  cssnano: {},
                },
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '../fonts/',
              name: isProduction ? '[name].[contenthash].[ext]' : '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '../images/',
              name: isProduction ? '[name].[contenthash].[ext]' : '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'raw-loader',
      },
    ],
  };
};

const getOptimization = () => {
  if (isProduction) {
    return {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              inline: false,
              warnings: false,
              drop_console: true,
              unsafe: true,
            },
            output: {
              comments: false,
            },
          },
        }),
      ],
      splitChunks: {
        minSize: 30000,
        maxSize: 244000,
        cacheGroups: {
          vendors: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
        },
      },
    };
  }

  return {};
};

const getEntry = entryName => {
  // Need this since useBuildins: usage in babel didn't add polyfill for Promise.all() when webpack is bundling
  const iterator = ['core-js/modules/es.array.iterator'];

  // default entry [index.js, main.scss] - used for all pages, if no specific entry is provided
  const indexEntry = iterator.concat([
    `${config.scripts.src}/${config.scripts.bundle}.${config.scripts.extension}`,
    `${config.styles.src}/${config.styles.bundle}.${config.styles.extension}`,
    `${config.templates.src}/${config.templates.bundle}.${config.templates.extension}`,
  ]);

  // additional entries, specified in config.json file as [entries]
  let entries = {
    [config.scripts.bundle]: indexEntry,
  };

  if (config.entries) {
    for (const key in config.entries) {
      entries[key] = iterator.concat(config.entries[key]);
    }
  }

  console.log(entries);

  return entries;
};

let webpackConfig = {
  mode: ENV,
  entry: getEntry(),
  devtool: isProduction ? 'eval' : 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, config.dest),
    filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
    crossOriginLoading: 'anonymous',
  },
  plugins: getPlugins(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/js'),
      Utils: path.resolve(__dirname, 'src/js/utils'),
      Vendors: path.resolve(__dirname, 'src/js/vendors'),
      Animations: path.resolve(__dirname, 'src/js/Animations'),
    },
  },
  optimization: getOptimization(),
  module: getModules(),
  devServer: pluginsConfiguration.DevServer,
};

module.exports = webpackConfig;
