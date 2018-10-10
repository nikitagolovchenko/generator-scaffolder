const gulp = require('gulp');
const config = require('../config');

gulp.task('js', () => {
  gulp.src(`${config.src.js}/**/*.js`).pipe(gulp.dest(config.dest.js));
});

gulp.task('js:watch', () => {
  gulp.watch(`${config.src.js}/**/*`, ['js']);
});
