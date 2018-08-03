var config = require('../gulpConfig');
var gulp = require('gulp');  
var del = require('del');

gulp.task('clear', function (cb) {  
  return del(config.dest.root).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});