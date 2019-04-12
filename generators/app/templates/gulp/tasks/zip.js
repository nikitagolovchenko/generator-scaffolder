const gulp = require('gulp');
const zip = require('gulp-zip');
const path = require('path');
const config = require('../config.js');

gulp.task('zip', () => {
  gulp
    .src([
      `${config.baseDir}*/**/**/*`,
      `!node_modules`,
      `!node_modules/**`,
    ])
    .pipe(zip(`${path.basename(path.dirname(config.baseDir))}.zip`))
    .pipe(gulp.dest(`../${config.baseDir}`));
});
