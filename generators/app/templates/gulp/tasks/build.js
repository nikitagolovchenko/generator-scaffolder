var gulp        = require('gulp');
var runSequence = require('run-sequence');
var config      = require('../gulpConfig');

function build(cb) {
    runSequence(
        'clear',
        // 'iconfont',<% } %><% if (sprites.indexOf('svg') !== -1) { %>
        // 'sprite:svg',<% } %><% if (sprites.indexOf('png') !== -1) { %>
        // 'sprite:png',<% } %><% if (svgo) { %>
        // 'sss',<% } %><% if (templates === 'swig') { %>
        // 'swig',<% } %><% if (templates === 'jade') { %>
        // 'jade',<% } %><% if (templates === 'nunjucks') { %>
        // 'nunjucks',<% } %><% if (bundler === 'browserify') { %>
        // 'browserify',<% } %><% if (bundler === 'webpack') { %>
        // 'webpack',<% } %><% if (bundler === 'manually') { %>
        'copy',
        'imagemin',
        'sass',
        'webpack',
        cb
    );
}

gulp.task('build', function(cb) {
    config.setEnvironment('development');
    config.showEnvironment()
    build(cb);
});

gulp.task('dist', function(cb) {
    config.setEnvironment('production');
    config.showEnvironment();
    build(cb);
});

