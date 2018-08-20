'use strict';

var config = require('../config');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './' + config.dest.root,
      index: 'index.html',
      directory: true
    },
    files: [config.dest.root + '/*.html', config.dest.css + '/*.css', config.dest.js + '/*.js', config.dest.img + '/**/*'],
    logFileChanges: true,
    // Port: 8080,
    logLevel: 'info',
    ghost: false,
    // Online: true,
    // open: "local",

    // if need to take a look from outside
    tunnel: false

    // Append '.xip.io' to the hostname. (eg: http://192.168.0.4.xip.io:3002). useful for services such as Typekit as it allows you to configure domains such as *.xip.io in your kit settings
    // xip: true
  });
});

module.exports = browserSync;
