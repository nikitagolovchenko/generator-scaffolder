const gulp = require('gulp');
const runSequence = require('run-sequence');
const config = require('../config');

const build = cb => runSequence('clear', 'copy', 'webpack', 'imagemin', 'sass', cb);

gulp.task('build', cb => {
  config.setEnvironment('development');
  config.showEnvironment();
  build(cb);
});

gulp.task('dist', cb => {
  config.setEnvironment('production');
  config.showEnvironment();
  build(cb);
});
