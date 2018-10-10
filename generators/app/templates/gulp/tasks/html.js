const gulp = require('gulp');
const config = require('../config');

gulp.task('html', ['clean:rootfiles'], () => {
  gulp.src(`${config.src.root}/*.html`).pipe(gulp.dest(config.dest.root));
});

gulp.task('html:watch', () => {
  gulp.watch(`${config.src.root}/*.html`, ['html']);
});
