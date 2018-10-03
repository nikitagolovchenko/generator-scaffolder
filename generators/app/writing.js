const path = require('path');
const mkDir = require('mkdirp');

const destFolder = 'markup';

module.exports = () => {
  mkDir(path.join(`${destFolder}/src/fonts`));
  mkDir(path.join(`${destFolder}/src/images`));

  this.fs.copy(this.templatePath('.gitignore'), `${destFolder}/.gitignore'`);
  this.fs.copy(this.templatePath('.editorconfig'), `${destFolder}/.editorconfig'`);
  this.fs.copy(this.templatePath('.babelrc'), `${destFolder}/.babelrc'`);
  this.fs.copy(this.templatePath('.eslintrc'), `${destFolder}/.eslintrc'`);
  this.fs.copy(this.templatePath('.prettierrc'), `${destFolder}/.prettierrc'`);
  this.fs.copy(this.templatePath('.travis.yml'), `${destFolder}/.travis.yml'`);
  // this.fs.copy(this.templatePath('.yo-rc.json'), `${destFolder}/.yo-rc.json'`);
  // this.fs.copy(this.templatePath('README.md'), `${destFolder}/README.md'`);
  this.fs.copy(this.templatePath('package.json'), `${destFolder}/package.json'`);

  // Gulp files
  this.fs.copy(this.templatePath('gulpfile.js'), `${destFolder}/gulpfile.js'`);
  this.fs.copy(this.templatePath('gulp/config.js'), `${destFolder}/gulp/config.js'`);

  // webpack config
  this.fs.copy(this.templatePath('webpack.config.js'), `${destFolder}/webpack.config.js'`);

  // Gulp tasks
  this.fs.copy(this.templatePath('gulp/tasks/util/watchDeletedFiles.js'), `${destFolder}/gulp/tasks/util/watchDeletedFiles.js`);
  this.fs.copy(this.templatePath('gulp/tasks/util/message--deleted.js'), `${destFolder}/gulp/tasks/util/message--deleted.js`);
  this.fs.copy(this.templatePath('gulp/tasks/util/message--error.js'), `${destFolder}/gulp/tasks/util/message--error.js`);
  this.fs.copy(this.templatePath('gulp/tasks/ajaxIncludes.js'), `${destFolder}/gulp/tasks/ajaxIncludes.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/browserSync.js'), `${destFolder}/gulp/tasks/browserSync.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/build.js'), `${destFolder}/gulp/tasks/build.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/clean.js'), `${destFolder}/gulp/tasks/clean.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/clear.js'), `${destFolder}/gulp/tasks/clear.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/copy.js'), `${destFolder}/gulp/tasks/copy.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/default.js'), `${destFolder}/gulp/tasks/default.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/fonts.js'), `${destFolder}/gulp/tasks/fonts.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/html.js'), `${destFolder}/gulp/tasks/html.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/imagemin.js'), `${destFolder}/gulp/tasks/imagemin.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/sass.js'), `${destFolder}/gulp/tasks/sass.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/video.js'), `${destFolder}/gulp/tasks/video.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/watch.js'), `${destFolder}/gulp/tasks/watch.js'`);
  this.fs.copy(this.templatePath('gulp/tasks/webpack.js'), `${destFolder}/gulp/tasks/webpack.js'`);

  switch (this.props.project_type) {
    case 'markup':
      this.fs.copy(this.templatePath('src/markup_only'), `${destFolder}/src'`);
      this.fs.copy(this.templatePath('src/images'), `${destFolder}/src/images'`);
      this.fs.copy(this.templatePath('src/js'), `${destFolder}/src/js'`);
      this.fs.copy(this.templatePath('src/js/vendors/vendorTest.js'), `${destFolder}/src/js/vendors/vendorTest.js'`);
      break;
    case 'markup_cms':
      break;
    case 'markup_banner':
      break;
    default:
      break;
  }
};

// Module.exports = files;
