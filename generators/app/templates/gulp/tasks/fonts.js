'use strict';

const config = require('../config');
const gulp = require('gulp');

gulp.task('fonts', ['clean:fonts'], () => {
  return gulp.src(config.src.fonts + '/**/*.*').pipe(gulp.dest(config.dest.fonts));
});

gulp.task('fonts:watch', () => {
  gulp.watch(config.src.fonts + '/**/*.*', ['fonts']);
});
