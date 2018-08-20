'use strict';

const config = require('../config');
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('default', cb => {
  runSequence('build', 'watch', 'browserSync', cb);
});
