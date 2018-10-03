const gulp = require('gulp');
const webpack = require('webpack');
const browserSync = require('./browserSync');
const webpackConfig = require('../../webpack.config');

gulp.task('webpack', () => {
  webpackConfig.mode = process.env.NODE_ENV;
  browserSync.reload();
  webpack(webpackConfig, () => {
    // if error do something here such as gutil error, function receiving (err, stats)
  });
});
