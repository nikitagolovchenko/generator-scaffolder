'use strict';

const config = require('../config');
const gulp = require('gulp');

gulp.task('html', ['clean:rootfiles'], () => {
  return gulp.src(config.src.root + '/*.html').pipe(gulp.dest(config.dest.root));
});

gulp.task('html:watch', () => {
  gulp.watch(config.src.root + '/*.html', ['html']);
});
