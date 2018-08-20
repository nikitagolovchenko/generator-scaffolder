const config = require('../config');
const gulp = require('gulp');

gulp.task('ajaxIncludes', ['clean:ajaxIncludes'], () => {
  return gulp.src(config.src.ajaxIncludes + '/**/*.*').pipe(gulp.dest(config.dest.ajaxIncludes));
});

gulp.task('ajaxIncludes:watch', () => {
  gulp.watch(config.src.ajaxIncludes + '/*.*', ['ajaxIncludes']);
});
