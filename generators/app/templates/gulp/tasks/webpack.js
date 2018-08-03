var gulp          = require('gulp');
var webpack       = require('webpack');
var chalk = require('chalk');
var gutil          = require('gulp-util');
var notify        = require('gulp-notify');
var browserSync   = require('./browserSync');
var config        = require('../gulpConfig');
var webpackConfig = require('../../webpack.config');

// function errorHandler(err, stats, callback) {
    
//     if (typeof callback === 'function') callback();
// }

gulp.task('webpack', function() {
    // console.log(chalk.red.blue(webpackConfig.mode));
    // console.log(chalk.red.bold(process.env.NODE_ENV));
    webpackConfig.mode = process.env.NODE_ENV;
    console.log(chalk.bold.red(webpackConfig.mode));

    // console.log(chalk.red.green(webpackConfig.mode));
    webpack(webpackConfig, function(err, stats) {
      // if error do something here such as gutil error
      browserSync.reload();
    });
});
