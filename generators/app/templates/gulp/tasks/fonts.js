var config      = require('../gulpConfig.js');
var gulp        = require('gulp');
// var browserSync = require('browser-sync');

gulp.task('fonts', ['clean:fonts'], function() {
  return gulp.src(config.src.fonts + '/**/*.*')
     .pipe(gulp.dest(config.dest.fonts));
     // .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts:watch', function() {
    gulp.watch(config.src.fonts + '/**/*.*', ['fonts']);
});