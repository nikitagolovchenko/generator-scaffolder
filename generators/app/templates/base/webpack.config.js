const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chokidar = require('chokidar');
const WebpackNotifierPlugin = require('webpack-notifier');
const ErrorsPlugin = require('friendly-errors-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Critters = require('critters-webpack-plugin');
const config = require('./config.json');

const SRC = config.src;
const DEST = config.dest;
const PROD = 'production';
const ENV = process.env.NODE_ENV;
const HOST = process.env.HOST || config.server.host;
const PORT = parseInt(process.env.PORT, 10) || config.server.port;
const URL = `http://${HOST}:${PORT}`;
const isProduction = ENV === PROD;
const PUBLIC_PATH = '';

const getAssetPath = (type, assetPath) => {
  if (type === SRC) {
    return path.join(__dirname, config.src, assetPath);
  }
  return path.join(__dirname, config.dest, assetPath);
};

const getAssetName = (dest, name, ext, shouldBoost = true) => {
  return dest === PUBLIC_PATH ? `${name}.${ext}` : path.join(dest, `${name}.${ext}`)
}

const getAssetOutput = asset => {
  return asset.dest ? asset.dest : asset.src;
}

const generateStaticAssets = () => {
  let assetsArray = [];

  for (const asset in config.static) {
    const assetObject = config.static[asset];
    const srcPath = getAssetPath(SRC, assetObject.src);
    const destPath = getAssetPath(DEST, assetObject.dest ? assetObject.dest : assetObject.src);

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
    open: config.server.open,
    proxy: {
      target: URL,
      ws: true,
    },
  },
  DevServer: {
    contentBase: path.join(__dirname, config.dest),
    hot: true,
    compress: true,
    watchContentBase: true,
    port: PORT,
    liveReload: false,
    overlay: true,
    noInfo: true,
    open: false,
    clientLogLevel: 'silent',
    after: (app, server, compiler) => {
      const files = [getAssetPath(SRC, config.templates.src), getAssetPath(SRC, config.scripts.src)];

      chokidar.watch(files).on('change', () => {
        server.sockWrite(server.sockets, 'content-changed');
      });
    },
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
    context: getAssetPath(SRC, config.styles.src),
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
  const templateFiles = fs.readdirSync(getAssetPath(SRC, config.templates.src));
  const files = templateFiles.filter(elm => elm.match(new RegExp(`.*\.(${config.templates.extension})`, 'ig')));

  return files.map(item => {
    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];

    const minify = () => {
      if (config.minimize) {
        return {
          collapseWhitespace: true,
          html5: true,
          removeRedundantAttributes: false,
        }
      }

      return config.minimize;
    }

    // Create new HTMLWebpackPlugin with options
    return new HTMLWebpackPlugin({
      template: getAssetPath(SRC, `${config.templates.src}/${name}.${extension}`),
      filename: getAssetPath(DEST, `${config.templates.dest}/${name}.${extension}`),
      // inlineSource: 'runtime.+\\.js',
      // awaiting for ^4.0 version to be stable
      // chunks: name === 'index' ? [config.scripts.bundle, config.styles.bundle] : [name],
      minify: minify(),
      hash: config.cache_boost,
      optimize: {
        prefetch: true,
      },
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    });
  });
};

const htmlPlugins = generateHtmlPlugins().concat([
  new HTMLWebpackInlineSourcePlugin(),
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer',
  }),
]);

if (isProduction && config.critical_css) {
  htmlPlugins.push(
    new Critters({
      inlineFonts: true,
      pruneSource: config.entries ? true : false,
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
    }),
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
  if (config.linters && config.linters.css) {
    defaultPlugins.push(new StyleLintPlugin(pluginsConfiguration.StyleLint));
  }

  // add bundle analyze only if config.debug === true;
  if (isProduction && config.debug) {
    defaultPlugins.push(new BundleAnalyzerPlugin());
  }

  return defaultPlugins.concat(htmlPlugins);
};

const getTemplatesLoader = templateType => {
  const HTML = /\.html$/;

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
              reloadAll: true,
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
              sourceMap: true,
              config: {
                ctx: {
                  cssnano: config.minimize ? true : false,
                },
              },
            },
          },
          {
            loader: "group-css-media-queries-loader",
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
              limit: 4096,
              publicPath: path.relative(getAssetOutput(config.styles), getAssetOutput(config.fonts)),
              outputPath: getAssetOutput(config.fonts),
              name: '[name].[ext]',
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
              limit: 4096,
              publicPath: path.relative(getAssetOutput(config.styles), getAssetOutput(config.static.images)),
              outputPath: getAssetOutput(config.static.images),
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  };

  modules.rules.push(getTemplatesLoader(config.templates.extension));

  if (!isProduction && config.linters) {
    modules.rules.push({
      test: /\.jsx?$/,
      loader: 'prettier-loader',
      exclude: /node_modules/,
      options: {
        parser: 'babel',
      },
    });

    if (config.linters.js) {
      modules.rules.push({
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'eslintrc.js'
        },
      })
    }
  }

  return modules;
};

const getOptimization = () => {
  const cacheGroupName = 'vendors';
  if (!isProduction) return {};

  return {
    namedModules: config.cache_boost,
    namedChunks: config.cache_boost,
    moduleIds: config.cache_boost ? 'named' : false,
    chunkIds: config.cache_boost ? 'named' : false,
    runtimeChunk: config.cache_boost ? 'single' : false,
    splitChunks: config.cache_boost ? {
      cacheGroups: {
        [cacheGroupName]: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
        },
      },
    } : {},
    minimizer: [
      new TerserPlugin({
        chunkFilter: (chunk) => {
          const name = chunk.name;
          // Always include uglification for the `vendor` chunk
          if (name && name.startsWith(cacheGroupName)) {
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
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  };
};

const getEntry = entryName => {
  // Need this since useBuildins: usage in babel didn't add polyfill for Promise.all() when webpack is bundling
  const iterator = ['core-js/modules/es.array.iterator', 'regenerator-runtime/runtime'];

  // default JS entry {app.js} - used for all pages, if no specific entry is provided
  const entry = iterator.concat([
    getAssetPath(SRC, `${config.scripts.src}/${config.scripts.bundle}.${config.scripts.extension}`),
  ]);

  // default CSS entry {main.scss} - used for all pages, if no specific entry is provided
  const styleAsset = getAssetPath(SRC, `${config.styles.src}/${config.styles.bundle}.${config.styles.extension}`);

  let entries = {
    [config.scripts.bundle]: entry,
    [config.styles.bundle]: styleAsset,
  };

  /*
    additional entries, specified in config.json file as [entries]. Awaiting for HTMLWebpackPlugin ^4.0
    Usage in config:

    "entries": {
      "about": {
        "js": "about",
        "css": "main"
      }
    }
  */

  if (config.entries) {
    for (const entryKey in config.entries) {
      const additionalEntry = config.entries[entryKey];
      const JSFileName = additionalEntry.js ? additionalEntry.js : entryKey;
      const CSSFileName = additionalEntry.css ? additionalEntry.css : entryKey;

      if (JSFileName) {
        const JSFile = getAssetPath(SRC, `${config.scripts.src}/${JSFileName}.${config.scripts.extension}`);

        if (fs.existsSync(JSFile)) {
          if (!entries[entryKey]) entries[entryKey] = [];

          entries[entryKey].push(...iterator.concat(JSFile));
        }

      }

      if (CSSFileName) {
        const CSSFile = CSSFileName && getAssetPath(SRC, `${config.styles.src}/${CSSFileName}.${config.styles.extension}`);

        if (fs.existsSync(CSSFile)) {
          if (!entries[entryKey]) entries[entryKey] = [];

          entries[entryKey].push(CSSFile);
        }

      }
    }
  }
  return entries;
};

const webpackConfig = {
  mode: ENV,
  entry: getEntry(),
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  stats: isProduction,
  output: {
    publicPath: PUBLIC_PATH,
    path: path.resolve(config.dest),
    filename: getAssetName(config.scripts.dest, '[name]', config.scripts.extension),
    crossOriginLoading: 'anonymous',
  },
  plugins: getPlugins(),
  resolve: {
    extensions: [`.${config.scripts.extension}`],
    alias: {
      JS: getAssetPath(SRC, config.scripts.src),
      Utils: getAssetPath(SRC, `${config.scripts.src}/utils`),
      Vendors: getAssetPath(SRC, `${config.scripts.src}/vendors`),
      Plugins: getAssetPath(SRC, `${config.scripts.src}/plugins`),
      Components: getAssetPath(SRC, `${config.scripts.src}/components`),
      Animations: getAssetPath(SRC, `${config.scripts.src}/animations`),
    },
  },
  optimization: getOptimization(),
  module: getModules(),
  devServer: pluginsConfiguration.DevServer,
};

module.exports = webpackConfig;
