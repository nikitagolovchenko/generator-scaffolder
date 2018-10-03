const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const config = require('../config');

gulp.task('imagemin', ['clean:images'], () => {
  gulp
    .src(`${config.src.images}/**/*.*`)
    .pipe(changed(config.dest.images))
    .pipe(
      plumber({
        handleError: err => {
          // eslint-disable-next-line no-console
          console.log(err);
          this.emit('end');
        }
      })
    )
    .pipe(
      imagemin(
        {
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }]
        },
        {
          verbose: true
        }
      )
    )
    .pipe(gulp.dest(config.dest.images));
});

gulp.task('imagemin:watch', () => {
  gulp.watch(`${config.src.images}/**/*`, ['imagemin']);
});
