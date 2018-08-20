'use strict';

const config = require('../config');
const gulp = require('gulp');
const chalk = require('chalk');
const del = require('del');

gulp.task('clear', cb => {
  return del(config.dest.root).then(paths => {
    console.log(chalk.bgCyan.bold(' Deleted: '), chalk.magenta.bold(paths.join(' ')));
  });
});
