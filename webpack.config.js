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
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

// optimization
const Critters = require('critters-webpack-plugin');
const config = require('./config.json');

const ENV = process.env.NODE_ENV;
const PORT = parseInt(process.env.PORT, 10) || config.server.port;
const HOST = process.env.HOST || config.server.host;
const URL = `http://${HOST}:${PORT}`;
const isProduction = ENV === config.env.prod;

const getAssetPath = (type, assetPath) => {
  if (type === 'src') {
    return path.join(__dirname, config.src, assetPath);
  }
  return path.join(__dirname, config.dest, assetPath);
};

const getAssetName = (path, name, ext) => {
  if (isProduction && config.cache) {
    return `${path}/${name}.[contenthash].${ext}`;
  }

  return `${path}/${name}.${ext}`
}

const generateStaticAssets = () => {
  let assetsArray = [];

  for (const asset in config.static) {
    const assetObject = config.static[asset];
    const srcPath = getAssetPath('src', assetObject.src);
    const destPath = getAssetPath('dest', assetObject.dest);

    const assetFolderExist = fs.existsSync(srcPath);

    if (assetFolderExist) {
      assetsArray.push({
        from: srcPath,
        to: destPath,
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
  DevServer: {
    contentBase: path.join(__dirname, config.src),
    hot: true,
    compress: true,
    watchContentBase: true,
    port: PORT,
    liveReload: false,
    overlay: true,
    noInfo: true,
    quiet: false,
    open: false,
    clientLogLevel: 'silent',
    // after: (app, server, compiler) => {
    //   getAssetPath('src', config.templates.src)
    //   chokidar.watch([path.resolve(__dirname, `${config.templates.src}/${config.templates.glob}`)]).on('change', () => {
    //     server.sockWrite(server.sockets, 'content-changed');
    //   });
    // },
  },
  MiniCssExtract: {
    filename: getAssetName(config.styles.dest, '[name]', 'css'),
  },
  ProvidePlugin: {
    $: 'jquery',
    jQuery: 'jquery',
  },
  StyleLint: {
    configFile: 'stylelint.config.js',
    context: getAssetPath('src', config.styles.src),
    syntax: config.styles.extension,
  },
  ErrorsPlugin: {
    clearConsole: true,
  },
  CopyPlugin: generateStaticAssets(),

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
  const templateFiles = fs.readdirSync(getAssetPath('src', config.templates.src));
  const files = templateFiles.filter(elm => elm.match(new RegExp(`.*\.(${config.templates.extension})`, 'ig')));

  return files.map(item => {
    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];

    // Create new HTMLWebpackPlugin with options
    return new HTMLWebpackPlugin({
      title: config.title || 'Project title',
      // template: path.resolve(__dirname, `${config.templates.src}/${name}.${extension}`),
      template: getAssetPath('src', `${config.templates.src}/${name}.${extension}`),
      // filename: path.resolve(__dirname, `${config.dest}/${name}.${extension}`),
      filename: getAssetPath('dest', `${config.templates.dest}/${name}.${extension}`),
      inlineSource: 'runtime.+\\.js',
      chunks: config.entries ? [name] : false,
      minify: false,
      inject: true,
      hash: isProduction && config.cache,
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
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
  new HtmlWebpackInlineSourcePlugin(),
]);

if (isProduction && config.critical_css) {
  htmlPlugins.push(
    new Critters({
      inlineFonts: true,
      pruneSource: true,
      noscriptFallback: true,
      preload: 'swap',
    })
  );
}

const getPlugins = () => {
  let devPlugins = [
    new BrowserSyncPlugin(pluginsConfiguration.BrowserSync, {
      // prevent BrowserSync from reloading the page
      // and let Webpack Dev Server take care of this
      reload: false
    })
  ];

  let prodPlugins = [new ImageminPlugin(pluginsConfiguration.ImageMin)];

  let defaultPlugins = [
    new webpack.ProvidePlugin(pluginsConfiguration.ProvidePlugin),
    new ErrorsPlugin(pluginsConfiguration.ErrorsPlugin),
    new CopyWebpackPlugin(pluginsConfiguration.CopyPlugin),
    new FixStyleOnlyEntriesPlugin(),
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

const getTemplatesLoader = templateType => {
  const HTML = /\html$/;

  // if (templateType.match(HTML)) {
  //   return {
  //     test: HTML,
  //     use: 'raw-loader',
  //   };
  // }

  return {
    test: HTML,
    use: 'raw-loader',
  };
};

const getModules = () => {
  const modules = {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader', 'webpack-module-hot-accept'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProduction,
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              config: {
                ctx: {
                  cssnano: config.minimize ? true : false,
                },
              },
            },
          },
          {
            loader: "group-css-media-queries-loader",
            // options: {
            //   sourceMap: true,
            // }
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
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: config.static.fonts.name,
              name: getAssetName(config.static.fonts.dest, '[name]', '[ext]'),
              publicPath: (url, resourcePath, context) => {
                const relativePath = path.relative(url, context);

                return path.join(relativePath, url);
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: config.static.images.name,
              name: getAssetName(config.static.images.dest, '[name]', '[ext]'),
              publicPath: (url, resourcePath, context) => {
                const relativePath = path.relative(url, context);

                return path.join(relativePath, url);
              },
            },
          },
        ],
      },
    ],
  };

  // templates loaders
  modules.rules.push(getTemplatesLoader(config.templates.extension));

  if (!isProduction && config.linters) {
    modules.rules.push({
      enforce: 'pre',
      test: /\.jsx?$/,
      loader: 'prettier-loader',
      exclude: /node_modules/,
      options: {
        parser: 'babel',
      },
    });
  }

  return modules;
};

const getOptimization = () => {
  if (isProduction) {
    return {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      splitChunks: {
        minSize: 30000,
        maxSize: 244000,
        cacheGroups: {
          vendors: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          chunkFilter: (chunk) => {
            const name = chunk.name;
            // Always include uglification for the `vendor` chunk
            if (name && name.startsWith('vendors')) {
              return true;
            }

            // but based on setting in config for main bundle
            return config.minimize;
          },
          terserOptions: {
            cache: true,
            parallel: true,
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
    };
  }

  return {};
};

const getEntry = entryName => {
  // Need this since useBuildins: usage in babel didn't add polyfill for Promise.all() when webpack is bundling
  const iterator = ['core-js/modules/es.array.iterator'];

  // default entry [index.js, main.scss] - used for all pages, if no specific entry is provided
  const entry = iterator.concat([
    getAssetPath('src', `${config.scripts.src}/${config.scripts.bundle}.${config.scripts.extension}`),
    getAssetPath('src', `${config.styles.src}/${config.styles.bundle}.${config.styles.extension}`)
  ]);

  // const cssEntry = getAssetPath('src', `${config.styles.src}/${config.styles.bundle}.${config.styles.extension}`);

  let entries = {
    [config.scripts.bundle]: entry,
    // [config.styles.bundle]: cssEntry,
  };

  // additional entries, specified in config.json file as [entries]
  if (config.entries) {
    for (const key in config.entries) {
      entries[key] = iterator.concat(config.entries[key]);
    }
  }

  console.log(entries);

  return entries;
};

const webpackConfig = {
  mode: ENV,
  entry: getEntry(),
  // devtool: isProduction ? false : 'source-map',
  output: {
    path: path.resolve(config.dest),
    filename: getAssetName(config.scripts.dest, '[name]', 'js'),
  },
  plugins: getPlugins(),
  resolve: {
    alias: {
      '@': getAssetPath('src', config.scripts.src),
      Utils: getAssetPath('src', `${config.scripts.src}/utils`),
      Vendors: getAssetPath('src', `${config.scripts.src}/vendors`),
      Animations: getAssetPath('src', `${config.scripts.src}/Animations`),
    },
  },
  optimization: getOptimization(),
  module: getModules(),
  devServer: pluginsConfiguration.DevServer,
};

module.exports = webpackConfig;
