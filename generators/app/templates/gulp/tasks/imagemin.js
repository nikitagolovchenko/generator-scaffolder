let config = require('../gulpConfig');
let gulp = require('gulp');
let imagemin = require('gulp-imagemin');
let changed = require('gulp-changed');
let plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
// let copy = require('copy');
// let imageminJpegRecompress = require('imagemin-jpeg-recompress');
// let imageminPngQuant  = require ('imagemin-pngquant');

gulp.task('imagemin', ['clean:images'], function() {
    gulp.src(config.src.images + '/**/*.*')
        .pipe(changed(config.dest.images))
        .pipe(plumber({
          handleError: function (err) {
              console.log(err);
              this.emit('end');
            }
        }))
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}]
        }, {
          verbose: true
        }))
        .pipe(gulp.dest(config.dest.images))
});

gulp.task('imagemin:watch', function() {
  gulp.watch(config.src.images + '/**/*', ['imagemin']);
});
