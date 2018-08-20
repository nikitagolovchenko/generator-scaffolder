'use strict';

let config = require('./gulp/gulpConfig');
let errorsPlugin = require('friendly-errors-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let TimeFixPlugin = require('time-fix-plugin');
let notifier = require('node-notifier');
let webpack = require('webpack');
let gulpif = require('gulp-if');
let path = require('path');

let pluginsConfiguration = {
  ProvidePlugin: {
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  },
  SourceMapDevToolPlugin: {
    test: [/\.js$/],
    filename: 'app.js.map',
    exclude: path.resolve(__dirname, 'node_modules'),
    append: '//# sourceMappingURL=[url]',
    moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
    fallbackModuleFilenameTemplate: '[resource-path]'
  },
  errorsPlugin: {
    onErrors: (severity, errors) => {
      if (severity !== 'error') {
        return;
      }
      const error = errors[0];
      notifier.notify({
        title: 'Webpack error',
        message: severity + ': ' + error.name,
        subtitle: error.file || ''
      });
    },
    clearConsole: false
  }
};

let webpackConfig = {
  mode: 'development',
  context: path.join(__dirname, config.src.js),
  entry: {
    app: ['babel-polyfill', './app.js']
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
  plugins: config.production()
    ? [
        new TimeFixPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ProvidePlugin(pluginsConfiguration.ProvidePlugin),
        new errorsPlugin(pluginsConfiguration.errorsPlugin)
      ]
    : [
        new TimeFixPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ProvidePlugin(pluginsConfiguration.ProvidePlugin),
        new webpack.SourceMapDevToolPlugin(pluginsConfiguration.SourceMapDevToolPlugin),
        new errorsPlugin(pluginsConfiguration.errorsPlugin)
      ],
  resolve: {
    extensions: ['.js'],
    alias: {
      jcf: path.resolve('node_modules', 'jcf/js/jcf.js'),
      'jcf.checkbox': path.resolve('node_modules', 'jcf/js/jcf.checkbox.js'),
      'jcf.file': path.resolve('node_modules', 'jcf/js/jcf.file.js'),
      'jcf.number': path.resolve('node_modules', 'jcf/js/jcf.number.js'),
      'jcf.radio': path.resolve('node_modules', 'jcf/js/jcf.radio.js'),
      'jcf.range': path.resolve('node_modules', 'jcf/js/jcf.range.js'),
      'jcf.scrollable': path.resolve('node_modules', 'jcf/js/jcf.scrollable.js'),
      'jcf.select': path.resolve('node_modules', 'jcf/js/jcf.select.js'),
      jquery: path.resolve('node_modules', 'jquery'),
      TweenMax: path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
      TweenLite: path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
      TimelineMax: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
      ScrollMagic: path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
      TimelineLite: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
      'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
      'debug.addIndicators': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js')
    }
  },
  optimization: gulpif(
    config.production(),
    {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: false,
          uglifyOptions: {
            compress: {
              inline: false,
              warnings: false,
              drop_console: true,
              unsafe: true
            }
          }
        })
      ]
    },
    {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        })
      ]
    }
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'prettier-loader',
        exclude: /node_modules/,
        options: {
          parser: 'flow'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};

module.exports = webpackConfig;
