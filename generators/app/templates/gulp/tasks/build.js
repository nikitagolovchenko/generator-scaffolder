const gulp = require('gulp');
const runSequence = require('run-sequence');
const config = require('../config');

const build = cb => runSequence('clear', 'copy', 'imagemin', 'webpack', 'sass', 'serve', cb);

gulp.task('build', cb => {
  config.setCssOutput('expanded');
  config.showEnvironment();
  build(cb);
});

gulp.task('dist', cb => {
  config.setCssOutput('expanded');
  config.showEnvironment();
  build(cb);
});
