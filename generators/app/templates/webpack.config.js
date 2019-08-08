// eslint-disable-next-line
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ErrorsPlugin = require('friendly-errors-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TimeFixPlugin = require('time-fix-plugin');
const notifier = require('node-notifier');
const webpack = require('webpack');
const path = require('path');
const config = require('./gulp/config');

const ASSET_PATH = 'js/';

const pluginsConfiguration = {
  ProvidePlugin: {
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  },
  SourceMapDevToolPlugin: {
    test: [/\.js$/],
    filename: 'app.js.map',
    exclude: path.resolve(__dirname, 'node_modules'),
    append: '//# sourceMappingURL=[url]',
    moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
    fallbackModuleFilenameTemplate: '[resource-path]',
  },
  ErrorsPlugin: {
    onErrors: (severity, errors) => {
      if (severity !== 'error') {
        return;
      }
      const error = errors[0];
      notifier.notify({
        title: 'Webpack error',
        message: `${severity}:${error.name}`,
        subtitle: error.file || '',
      });
    },
    clearConsole: false,
  },
};

const getPlugins = () => {
  const defaultPlugins = [
    new TimeFixPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.ProvidePlugin(pluginsConfiguration.ProvidePlugin),
    new ErrorsPlugin(pluginsConfiguration.ErrorsPlugin),
  ];

  if (config.production()) {
    const prodPlugins = [new BundleAnalyzerPlugin()]

    prodPlugins.map(item => defaultPlugins.push(item))

    return defaultPlugins;
  }

  const devPlugins = [
    new HardSourceWebpackPlugin(),
    new webpack.SourceMapDevToolPlugin(pluginsConfiguration.SourceMapDevToolPlugin)
  ]

  devPlugins.map(item => defaultPlugins.push(item))

  return defaultPlugins;
};

const getTerserConfig = () => {
  if (config.production()) {
    return {
      sourceMap: true,
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
    };
  }

  return {
    cache: true,
    parallel: true,
    sourceMap: true,
  };
};

let webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    app: [`./${config.src.js}/app.js`],
  },
  output: {
    path: path.resolve(__dirname, config.dest.js),
    filename: '[name].js',
    publicPath: ASSET_PATH,
  },
  plugins: getPlugins(),
  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      jquery: path.resolve('node_modules', 'jquery'),
    },
  },
  optimization: {
    minimizer: [new TerserPlugin(getTerserConfig())],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'prettier-loader',
        exclude: /node_modules/,
        options: {
          parser: 'flow',
        },
      },
    ],
  },
};

module.exports = webpackConfig;
