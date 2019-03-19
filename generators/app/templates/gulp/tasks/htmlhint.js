const gulp = require('gulp');
const htmlhint = require('gulp-htmlhint');
const config = require('../config');

gulp.task('htmlhint', () => {
  gulp
    .src([`${config.src.root}/*.html`, `!${config.src.root}/wp-test.html`])
    .pipe(htmlhint('htmlhint.config.js'))
    .pipe(htmlhint.reporter());
});
