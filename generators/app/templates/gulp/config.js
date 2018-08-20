'use strict';

const chalk = require('chalk');
const srcPath = 'src';
const destPath = 'dist';

let config = {
  environment: 'development',
  src: {
    root: srcPath,
    sass: srcPath + '/scss',
    js: srcPath + '/js',
    images: srcPath + '/images',
    fonts: srcPath + '/fonts',
    video: srcPath + '/video',
    ajaxIncludes: srcPath + '/inc'
  },
  dest: {
    root: destPath,
    css: destPath + '/css',
    js: destPath + '/js',
    images: destPath + '/images',
    fonts: destPath + '/fonts',
    video: destPath + '/video',
    ajaxIncludes: destPath + '/inc'
  },
  development: function() {
    return this.environment === 'development';
  },
  production: function() {
    return this.environment === 'production';
  },
  setEnvironment: function(environment) {
    this.environment = environment;
    process.env.NODE_ENV = environment;
  },
  showEnvironment: function() {
    if (this.development()) {
      console.log(chalk.red('------------------------------------------'));
      console.log(chalk.yellow('Environment: ') + chalk.yellow.bgRed.bold(' ' + this.environment + ' '));
      console.log(chalk.red('------------------------------------------'));
    } else {
      console.log(chalk.green('------------------------------------------'));
      console.log(chalk.green('Environment: ') + chalk.white.bgGreen.bold(' ' + this.environment + ' '));
      console.log(chalk.green('------------------------------------------'));
    }
  }
};

module.exports = config;
