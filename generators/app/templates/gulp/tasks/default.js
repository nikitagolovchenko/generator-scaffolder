var gulp        = require('gulp');
var runSequence = require('run-sequence');
var config      = require('../gulpConfig');

gulp.task('default', function(cb) {
    runSequence(
        'build',
        'watch',
        'browserSync',
        cb
    );
});
