'use strict';

const config = require('../config');
const deleteUnused = require('./util/watchDeletedFiles');
const gulp = require('gulp');
const del = require('del');
const chalk = require('chalk');

gulp.task('clean:rootfiles', () => {
  return del(config.dest.root + '/*.{html}').then(paths => {
    console.log(chalk.bgCyan.bold(' Deleted: '), chalk.magenta.bold(paths.join(' ')));
  });
});

gulp.task('clean:fonts', () => {
  deleteUnused(config.src.fonts + '/**/*', config.dest.fonts + '/**/*');
});

gulp.task('clean:images', () => {
  deleteUnused(config.src.images + '/**/*', config.dest.images + '/**/*');
});

gulp.task('clean:video', () => {
  deleteUnused(config.src.video + '/**/*', config.dest.video + '/**/*');
});

gulp.task('clean:ajaxIncludes', () => {
  deleteUnused(config.src.ajaxIncludes + '/**/*', config.dest.ajaxIncludes + '/**/*');
});

gulp.task('clean', ['clean:images', 'clean:rootfiles', 'clean:fonts', 'clean:video', 'clean:ajaxIncludes']);

gulp.task('clean:watch', () => {
  gulp.watch(config.src.images + '/*', ['clean']);
});
