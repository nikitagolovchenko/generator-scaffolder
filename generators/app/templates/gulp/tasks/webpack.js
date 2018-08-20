const webpackConfig = require('../../webpack.config');
const browserSync = require('./browserSync');
const config = require('../config');
const gulp = require('gulp');
const webpack = require('webpack');

gulp.task('webpack', () => {
  webpackConfig.mode = process.env.NODE_ENV;
  browserSync.reload();
  webpack(webpackConfig, (err, stats) => {
    // If error do something here such as gutil error
  });
});
