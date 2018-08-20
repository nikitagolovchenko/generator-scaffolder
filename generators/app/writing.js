'use strict';

// Var config = require('templates/gulp/gulpConfig.js');
var path = require('path');
var mkDir = require('mkdirp');
var destFolder = 'markup';

module.exports = function() {
  var props = this.props;
  // var desination = this.destinationPath();

  mkDir(path.join(destFolder + '/src/fonts'));
  mkDir(path.join(destFolder + '/src/images'));

  this.fs.copy(this.templatePath('.gitignore'), destFolder + '/.gitignore');
  this.fs.copy(this.templatePath('.editorconfig'), destFolder + '/.editorconfig');
  this.fs.copy(this.templatePath('eslintrc'), '.eslintrc');
  // This.fs.copy(this.templatePath('htmlhintrc'), '.htmlhintrc');
  // this.fs.copy(this.templatePath('sass-lint.yml'), '.sass-lint.yml');
  // this.fs.copy(this.templatePath('stylelintrc'), '.stylelintrc');
  // this.fs.copy(this.templatePath('README.md'),'README.md');
  this.fs.copy(this.templatePath('package.json'), destFolder + '/package.json');

  // Gulp files
  this.fs.copy(this.templatePath('gulpfile.js'), destFolder + '/gulpfile.js');
  this.fs.copy(this.templatePath('gulp/gulpConfig.js'), destFolder + '/gulp/gulpConfig.js');

  // Gulp tasks
  this.fs.copy(this.templatePath('gulp/tasks/default.js'), destFolder + '/gulp/tasks/default.js');
  this.fs.copy(this.templatePath('gulp/tasks/build.js'), destFolder + '/gulp/tasks/build.js');
  this.fs.copy(this.templatePath('gulp/tasks/html.js'), destFolder + '/gulp/tasks/html.js');

  this.fs.copy(this.templatePath('gulp/tasks/watch.js'), destFolder + '/gulp/tasks/watch.js');

  this.fs.copy(this.templatePath('gulp/tasks/sass.js'), destFolder + '/gulp/tasks/sass.js');
  this.fs.copy(this.templatePath('gulp/tasks/browserSync.js'), destFolder + '/gulp/tasks/browserSync.js');
  this.fs.copy(this.templatePath('gulp/tasks/copy.js'), destFolder + '/gulp/tasks/copy.js');

  // Js

  // this.fs.copy(this.templatePath('gulp/tasks/js.js'), destFolder + '/gulp/tasks/js.js');

  this.fs.copy(this.templatePath('gulp/tasks/webpack.js'), destFolder + '/gulp/tasks/webpack.js');
  this.fs.copy(this.templatePath('webpack.config.js'), destFolder + '/webpack.config.js');
  this.fs.copy(this.templatePath('.babelrc'), destFolder + '/.babelrc');

  switch (props.project_type) {
    case 'markup':
      this.fs.copy(this.templatePath('src/markup_only'), destFolder + '/src');
      this.fs.copy(this.templatePath('src/images'), destFolder + '/src/images');
      this.fs.copy(this.templatePath('src/js'), destFolder + '/src/js');
      this.fs.copy(this.templatePath('src/js/vendors/vendorTest.js'), destFolder + '/src/js/vendors/vendorTest.js');
      break;
    case 'markup_cms':
      break;
    case 'markup_banner':
      break;
  }
};

// Module.exports = files;
