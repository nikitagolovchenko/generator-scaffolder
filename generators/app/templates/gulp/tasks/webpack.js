const gulp = require('gulp');
const webpack = require('webpack');
const config = require('../config');
const path = require('path');
const fs = require('fs')
const webpackConfig = require('../../webpack.config');

gulp.task('webpack', ['eslint'], () => {

  webpackConfig.mode = config.getEnvironment();
  webpack(webpackConfig, () => {});
});

gulp.task('webpack:watch', () => {
  gulp.watch(`${config.src.js}/**/*.js`, ['webpack']);
});
