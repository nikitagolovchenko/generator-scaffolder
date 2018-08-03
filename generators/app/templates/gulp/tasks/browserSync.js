var config = require('../gulpConfig');
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./" + config.dest.root,
            index: "index.html",
            directory: true
        },
        files: [
            config.dest.root + '/*.html',
            config.dest.css + '/*.css',
            config.dest.js + '/*.js',
            config.dest.img + '/**/*'
        ],
        logFileChanges: true
    });
});

module.exports = browserSync;