const chalk = require('chalk');

const srcPath = 'src';
const destPath = 'dist';
const prod = 'production';
const dev = 'development';

const config = {
  environment: 'development',
  src: {
    root: srcPath,
    sass: `${srcPath}/scss`,
    js: `${srcPath}/js`,
    images: `${srcPath}/images`,
    fonts: `${srcPath}/fonts`,
    video: `${srcPath}/video`,
    ajaxIncludes: `${srcPath}/inc`
  },
  dest: {
    root: destPath,
    css: `${destPath}/css`,
    js: `${destPath}/js`,
    images: `${destPath}/images`,
    fonts: `${destPath}/fonts`,
    video: `${destPath}/video`,
    ajaxIncludes: `${destPath}/inc`
  },
  setEnvironment: environment => {
    this.environment = environment;
    process.env.NODE_ENV = environment;
    return this.environment;
  },
  development: () => this.environment === dev,
  production: () => this.environment === prod,
  showEnvironment: () => {
    if (process.env.NODE_ENV === dev) {
      /* eslint-disable no-console */
      console.log(chalk.red('------------------------------------------'));
      console.log(chalk.yellow('Environment: ') + chalk.white.bgRed.bold(process.env.NODE_ENV));
      console.log(chalk.red('------------------------------------------'));
    }

    if (process.env.NODE_ENV === prod) {
      console.log(chalk.green('------------------------------------------'));
      console.log(chalk.green('Environment: ') + chalk.white.bgGreen.bold(process.env.NODE_ENV));
      console.log(chalk.green('------------------------------------------'));
    }
  }
};

module.exports = config;
