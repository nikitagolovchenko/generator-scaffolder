const {existsSync} = require('fs');
const {address} = require('ip');
const {resolve, join, posix, relative, dirname, basename, parse, format} = require('path');
const readdir = require('@jsdevtools/readdir-enhanced');
const webpack = require('webpack');
const chokidar = require('chokidar');
const WebpackNotifierPlugin = require('webpack-notifier');
const ErrorsPlugin = require('friendly-errors-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('./config.json');

const SRC = config.src;
const DEST = config.dest;
const PROD = 'production';
const ENV = process.env.NODE_ENV;
const HOST = config.server.host || 'localhost';
const isProduction = ENV === PROD;
const routesPage = config.templates.routes || '__routes';
const sitePages = config.templates.pages ? config.templates.pages : config.templates.src;
const PUBLIC_PATH = '';

const getAssetPath = (type, assetPath) => {
  if (type === SRC) {
    return posix.join(__dirname, config.src, assetPath);
  }
  return posix.join(__dirname, config.dest, assetPath);
};

const getAssetName = (dest, name, ext) => {
  return posix.join(dest, `${name}.${ext}`);
};

const getAllPagesExceptRoutes = () => {
  let templateFiles = readdir.sync(getAssetPath(SRC, sitePages), {
    deep: true,
    filter: function (stats) {
      return stats.isFile() && stats.path.indexOf('_') === -1;
    },
  });

  return templateFiles;
};

const postServerMessage = (port, host = HOST) => {
  const URL = `http://${host}:${port}`;
  const IP = `http://${address()}:${port}`;
  const routesPageURL = `${URL}/${routesPage}.html`;
  const RED = '\033[0;31m';
  const GREEN = '\033[0;32m';
  const PURPLE = '\033[0;35m';

  return console.log(`
    ${RED}---------------------------------------
    🎉 ${GREEN}Server is running at port ${port}:

    ${PURPLE}
    📄 Routes are available at: ${routesPageURL}

    💻 Internal: ${URL}
    🌎 External: ${IP}
    ${RED}---------------------------------------
  `);
};

const generateStaticAssets = () => {
  let assetsArray = [];

  for (const asset in config.static) {
    const assetObject = config.static[asset];
    const srcPath = getAssetPath(SRC, assetObject.src);
    const destPath = getAssetPath(DEST, assetObject.dest ? assetObject.dest : assetObject.src);

    const assetFolderExist = existsSync(srcPath);

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
  DevServer: {
    contentBase: posix.relative(__dirname, config.dest),
    hot: true,
    host: '0.0.0.0',
    compress: true,
    watchContentBase: true,
    disableHostCheck: true,
    historyApiFallback: true,
    liveReload: false,
    overlay: true,
    useLocalIp: true,
    noInfo: true,
    open: config.server.open,
    clientLogLevel: 'silent',
    before(app, {options}) {
      const PORT = config.server.port || options.port;

      options.port = PORT;
      options.public = `localhost:${PORT}`;
    },
    after(app, server, compiler) {
      const files = [getAssetPath(SRC, config.templates.src), getAssetPath(SRC, config.scripts.src)];
      const {port} = server.options;

      chokidar.watch(files).on('change', () => {
        server.sockWrite(server.sockets, 'content-changed');
      });

      compiler.hooks.done.tap('show-server-settings', (stats) => {
        if (stats.hasErrors()) return;
        postServerMessage(port);
      });
    },
  },
  MiniCssExtract: {
    filename: getAssetName(config.styles.dest, config.styles.bundle, 'css'),
    chunkFilename: getAssetName(config.styles.dest, '[name]', 'css'),
  },
  DefinePlugin: {
    'process.env': {
      NODE_ENV: JSON.stringify(ENV),
      ROUTES_PAGE: JSON.stringify(routesPage),
      ROUTES: JSON.stringify(getAllPagesExceptRoutes()),
    },
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
  CopyPlugin: {
    patterns: generateStaticAssets(),
  },
  ImageMin: {
    cacheFolder: resolve(__dirname, 'node_modules/.cache'),
    pngquant: {
      quality: '70-80',
    },
  },
};

// creating new instance of plugin for each of the pages that we have
const generateHtmlPlugins = () => {
  const templateFiles = getAllPagesExceptRoutes();

  return templateFiles.map((item) => {
    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const template = getAssetPath(SRC, `${join(sitePages, name)}.${config.templates.extension}`);
    const filename = getAssetPath(DEST, `${join(config.templates.dest, name)}.html`);
    const chunks = config.entries ? (name === 'index' ? [config.scripts.bundle, config.styles.bundle] : [name]) : false;

    const minify = () => {
      if (config.minimize) {
        return {
          collapseWhitespace: true,
          html5: true,
          removeRedundantAttributes: false,
        };
      }

      return config.minimize;
    };

    // Create new HTMLWebpackPlugin with options
    return new HTMLWebpackPlugin({
      title: basename(dirname(__dirname)),
      template,
      filename,
      chunks,
      excludeChunks: [routesPage],
      minify: isProduction ? minify() : false,
      hash: isProduction ? config.cache_boost : false,
      scriptLoading: 'defer',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
      optimize: {
        prefetch: true,
      },
    });
  });
};

const htmlPlugins = () => {
  let plugins = generateHtmlPlugins();

  if (!isProduction) {
    plugins.push(
      new HTMLWebpackPlugin({
        title: basename(dirname(__dirname)),
        template: getAssetPath(SRC, `${sitePages}/${routesPage}.html`),
        filename: getAssetPath(DEST, `${config.templates.dest}/${routesPage}.html`),
        chunks: [routesPage],
        minify: false,
        scriptLoading: 'defer',
        meta: {
          viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
      })
    );
  }

  plugins.concat([
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
  ]);

  return plugins;
};

if (isProduction && config.critical_css) {
  console.log('Critical CSS feature is comming soon...');
  // htmlPlugins.push(
  //   new Critters({
  //     inlineFonts: true,
  //     pruneSource: config.entries ? true : false,
  //     noscriptFallback: true,
  //     preload: 'swap',
  //   })
  // );
}

const getPlugins = () => {
  let devPlugins = [new webpack.DefinePlugin(pluginsConfiguration.DefinePlugin)];
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
    devPlugins.map((item) => defaultPlugins.push(item));
  }

  if (isProduction) {
    prodPlugins.map((item) => defaultPlugins.push(item));
  }

  // enable linters only if config.linters === true
  if (config.linters && config.linters.css) {
    defaultPlugins.push(new StyleLintPlugin(pluginsConfiguration.StyleLint));
  }

  // add bundle analyze only if config.debug === true;
  if (isProduction && config.debug) {
    defaultPlugins.push(new BundleAnalyzerPlugin());
  }

  return defaultPlugins.concat(htmlPlugins());
};

const getTemplatesLoader = (templateType) => {
  const PUG = new RegExp('pug');
  const TWIG = new RegExp('twig');

  if (PUG.test(templateType)) {
    return {
      test: PUG,
      use: ['raw-loader', `pug-html-loader?basedir=${join(config.src, config.templates.src)}`],
    };
  }

  if (TWIG.test(templateType)) {
    return {
      test: TWIG,
      use: [
        'raw-loader',
        {
          loader: 'twig-html-loader',
          options: {
            data: (context) => {
              const data = resolve(__dirname, 'data.json');
              // going throught all twig files, including only _{helpers}
              const helpers = readdir.sync(getAssetPath(SRC, sitePages), {
                deep: true,
                filter: (stats) => stats.isFile() && stats.path.indexOf('_') !== -1,
              });

              helpers.forEach((file) => {
                // pushing helper file to context and force plugin to rebuild templates on helpers changes
                // fixing issue, when path inside helpers was changed, but compiler didn't noticed about those changes to the path
                context.addDependency(join(config.src, config.templates.src, file));
              });

              context.addDependency(data); // Force webpack to watch file
              return context.fs.readJsonSync(data, {throws: false}) || {};
            },
            namespaces: {
              layout: resolve(__dirname, 'src/views/_layout'),
              components: resolve(__dirname, 'src/views/_components'),
              includes: resolve(__dirname, 'src/views/_includes'),
            },
          },
        },
      ],
    };
  }

  return {};
};

const getScriptsLoader = (templateType) => {
  const TS = new RegExp('ts');

  if (TS.test(templateType)) {
    return {
      // /node_modules\/(?!(module_to_include)\/).*/
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loaders: ['awesome-typescript-loader', 'webpack-module-hot-accept'],
    };
  }

  return {
    test: /\.m?js$/,
    exclude: /node_modules/,
    loaders: ['babel-loader', 'webpack-module-hot-accept'],
  };
};

const getStaticAssetOutput = ({context, resourcePath, assets}) => {
  const basePath = posix.relative(context, resourcePath);
  const from = posix.join(config.src, assets.src);
  const to = assets.dest || assets.src;
  const assetPath = basePath.replace(from, to);

  return assetPath;
};

const getModules = () => {
  const modules = {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProduction,
              url: false,
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
            loader: 'group-css-media-queries-loader',
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
        test: /\.(woff(2)?|eot|ttf|otf|png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              emitFile: false,
              publicPath: function (url) {
                const parsedPath = parse(url);
                const isFonts = url.includes(config.static.fonts.src);
                const isImages = url.includes(config.static.images.src);
                const fontsOutput = config.static.fonts.dest ? config.static.fonts.dest : config.static.fonts.src;
                const imagesOutput = config.static.images.dest ? config.static.images.dest : config.static.images.src;

                if (isFonts) {
                  parsedPath.dir = posix.relative(config.styles.dest, fontsOutput);
                  return posix.format(parsedPath);
                } else if (isImages) {
                  parsedPath.dir = posix.relative(config.styles.dest, imagesOutput);
                  return posix.format(parsedPath);
                } else {
                  return url;
                }
              },
            },
          },
        ],
      },
    ],
  };

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
          configFile: 'eslintrc.js',
        },
      });
    }
  }

  modules.rules.unshift(getScriptsLoader(config.scripts.extension), getTemplatesLoader(config.templates.extension));

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
    splitChunks: config.cache_boost
      ? {
          cacheGroups: {
            [cacheGroupName]: {
              chunks: 'all',
              test: /node_modules/,
            },
          },
        }
      : {},
    minimizer: [
      new TerserPlugin({
        exclude: !config.minimize ? join(config.scripts.src, config.scripts.bundle) : undefined,
        extractComments: false,
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

const getEntries = () => {
  // Need this since useBuildins: usage in babel didn't add polyfill for Promise.all() when webpack is bundling
  const iterator = ['core-js/modules/es.array.iterator', 'regenerator-runtime/runtime'];
  const routesPageEntry = posix.resolve(join(config.src, config.scripts.src, 'utils', `${routesPage}.js`));

  // default JS entry {app.js} - used for all pages, if no specific entry is provided
  const entryJsFile = join(config.scripts.src, `${config.scripts.bundle}.${config.scripts.extension}`);
  const entry = iterator.concat([getAssetPath(SRC, entryJsFile)]);

  // default CSS entry {main.scss} - used for all pages, if no specific entry is provided
  const entryCSSFile = join(config.styles.src, `${config.styles.bundle}.${config.styles.extension}`);
  const styleAsset = getAssetPath(SRC, entryCSSFile);

  let entries = {
    [config.scripts.bundle]: [...entry, styleAsset],
    // [routesPage]: routesPageEntry,
  };

  if (!isProduction) {
    entries = {
      ...entries,
      ...{
        [routesPage]: routesPageEntry,
      },
    };
  }

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

        if (existsSync(JSFile)) {
          if (!entries[entryKey]) entries[entryKey] = [];

          entries[entryKey].push(...iterator.concat(JSFile));
        }
      }

      if (CSSFileName) {
        const CSSFile = CSSFileName && getAssetPath(SRC, `${config.styles.src}/${CSSFileName}.${config.styles.extension}`);

        if (existsSync(CSSFile)) {
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
  entry: getEntries(),
  devtool: isProduction ? false : 'inline-source-map',
  stats: isProduction,
  output: {
    publicPath: PUBLIC_PATH,
    path: posix.resolve(config.dest),
    filename: getAssetName(config.scripts.dest, '[name]', 'js'),
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
