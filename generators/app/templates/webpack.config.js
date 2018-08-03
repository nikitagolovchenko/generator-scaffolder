var config = require('./gulp/gulpConfig');
var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var prettier = require('eslint-formatter-pretty');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var notifier = require('node-notifier');
var chalk = require('chalk');
var gulpif = require('gulp-if');
var webpack = require('webpack');

var pluginsConfiguration = {
  'ProvidePlugin': {
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  },
  'SourceMapDevToolPlugin': {
    test: [/\.js$/],
    filename: "app.[hash].js.map",
    exclude: path.resolve(__dirname, "node_modules"),
    append: "//# sourceMappingURL=[url]",
    moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
    fallbackModuleFilenameTemplate: '[resource-path]'
  },
  'LoaderOptionsPlugin': {
    options: {
      eslint: {
        formatter: require('eslint-formatter-pretty')
      }
    }
  },
  'FriendlyErrorsWebpackPlugin': {
    compilationSuccessInfo: {
      messages: ['You application is running here http://localhost:3000'],
      notes: ['Some additionnal notes to be displayed unpon successful compilation']
    },
    onErrors: (severity, errors) => {
      if (severity !== 'error') {
        return;
      }
      const error = errors[0];
      notifier.notify({
        title: "Webpack error",
        message: severity + ': ' + error.name,
        subtitle: error.file || ''
      });
    }
  }
};

var webpackConfig = {
  mode: 'development',
  context: path.join(__dirname, config.src.js),
  entry: {
    app: './app.js'
  },
  output: {
    path: path.resolve(__dirname, config.dest.js),
    filename: '[name].js'
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  plugins: config.production() ? [
    // new BundleAnalyzerPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new FriendlyErrorsWebpackPlugin(pluginsConfiguration.FriendlyErrorsWebpackPlugin),
    new webpack.ProvidePlugin(pluginsConfiguration.ProvidePlugin),
    new webpack.LoaderOptionsPlugin(pluginsConfiguration.LoaderOptionsPlugin)
  ] : [
    // new BundleAnalyzerPlugin(),
    new FriendlyErrorsWebpackPlugin(pluginsConfiguration.FriendlyErrorsWebpackPlugin),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.ProvidePlugin(pluginsConfiguration.ProvidePlugin),
    new webpack.LoaderOptionsPlugin(pluginsConfiguration.LoaderOptionsPlugin),
    new webpack.SourceMapDevToolPlugin(pluginsConfiguration.SourceMapDevToolPlugin)
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
        "jquery": path.resolve(path.join(__dirname, "node_modules", "jquery"))
    }
  },
  optimization: gulpif(config.production(), {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,
        uglifyOptions: {
          compress: {
            inline: false,
            warnings: false,
            drop_console: true,
            unsafe: true
          },
        },
      }),
    ],
  }, {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  }),
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          fix: true,
          cache: true,
          formatter: prettier
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            'babel-preset-es2015',
          ].map(require.resolve)
        }
      },
    ]
  }
};


module.exports = webpackConfig;
