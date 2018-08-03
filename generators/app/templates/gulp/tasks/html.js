var config      = require('../gulpConfig.js');
var gulp        = require('gulp');
// var browserSync = require('browser-sync');

gulp.task('html', ['clean:rootfiles'], function() {
  return gulp.src(config.src.root + '/*.html')
     .pipe(gulp.dest(config.dest.root));
     // .pipe(browserSync.reload({stream: true}));
});

gulp.task('html:watch', function() {
    gulp.watch(config.src.root + '/*.html', ['html']);
});