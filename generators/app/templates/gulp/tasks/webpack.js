const gulp = require('gulp');
const webpack = require('webpack');
const config = require('../config');
const path = require('path');
const fs = require('fs')
const webpackConfig = require('../../webpack.config');
const valueToRemove = '/utils/publicPath.js'

gulp.task('webpack', ['eslint'], () => {
  let publicPathFile = path.join(config.baseDir, `${config.src.js}${valueToRemove}`);
  let defaultEntry = webpackConfig.entry.app;

  webpackConfig.entry.app = defaultEntry.filter(entry => entry !== `.${valueToRemove}`);
  if (fs.existsSync(publicPathFile)) {
    webpackConfig.entry.app.unshift(`.${valueToRemove}`);
  }

  webpackConfig.mode = config.getEnvironment();
  webpack(webpackConfig, () => {});
});

gulp.task('webpack:watch', () => {
  gulp.watch(`${config.src.js}/**/*.js`, ['webpack']);
});
