const chalk = require('chalk');
const environments = require("gulp-environments");
const srcPath = "src";
const destPath = "dist";

let config = {
  environment: "development",
  src: {
    root: srcPath,
    sass: srcPath + "/scss",
    js: srcPath + "/js",
    images: srcPath + "/images",
    fonts: srcPath + "/fonts"
  },
  dest: {
    root: destPath,
    css: destPath + "/css",
    js: destPath + "/js",
    images: destPath + "/images",
    fonts: destPath + "/fonts"
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
      console.log(chalk.yellow('Environment: ') + chalk.yellow.bgRed.bold(' ' + this.environment + ' '));
    } else {
      console.log(chalk.yellow('Environment: ') + chalk.yellow.bgGreen.bold(' ' + this.environment + ' '));
      console.log(this.production());
    }
  }
};

console.log('---------------------');
config.setEnvironment(config.production() ? 'production' : 'development');
console.log(config.environment);
console.log('---------------------');

module.exports = config;