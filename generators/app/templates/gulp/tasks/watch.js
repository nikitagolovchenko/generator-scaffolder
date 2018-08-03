var gulp   = require('gulp');
var config = require('../gulpConfig.js');

gulp.task('watch', 
    ['copy:watch',
     'imagemin:watch',
     'fonts:watch',
    // <% if (templates === 'swig') { %>
    // 'swig:watch',<% } %><% if (templates === 'jade') { %>
    // 'jade:watch',<% } %><% if (templates === 'nunjucks') { %>
    // 'nunjucks:watch',<% } %><% if (sprites.indexOf('iconfont') !== -1) { %>
    // 'iconfont:watch',<% } %><% if (sprites.indexOf('svg') !== -1) { %>
    // 'sprite:svg:watch',<% } %><% if (sprites.indexOf('png') !== -1) { %>
    // 'sprite:png:watch',<% } %><% if (svgo) { %>
    // 'svgo:watch',<% } %><% if (bundler === 'browserify') { %>
    // 'browserify:watch',<% } %>
    // 'list-pages:watch',<% if (bundler === 'webpack') { %>
    // 'webpack:watch',<% } %><% if (bundler === 'manually') { %>
    // 'sss:watch'<% } %>
    'html:watch',
    'sass:watch'
]);
