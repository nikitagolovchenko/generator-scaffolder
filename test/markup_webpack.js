const path = require('path');
const chalk = require('chalk');
const chai = require("chai");
const helpers = require('yeoman-test');
const yeomanAssert = require('yeoman-assert');
const { chaiExecAsync } = require("chai-exec");
const VALUES = require('../generators/app/globals');
const {PROMPTS_VALUES, config} = require('../generators/app/globals');

const assert = chai.assert;
const tempFolder = path.join(__dirname, 'tmp');
chai.use(chaiExecAsync);

chaiExecAsync.defaults = {
  options: {
    cwd: path.join(__dirname, 'tmp/markup')
  }
};

const prompts = {
  projectType: PROMPTS_VALUES.projectType.markup,
  framework: PROMPTS_VALUES.framework.none,
  linters: PROMPTS_VALUES.linters.remove,
}

const expectedFiles = [
  'webpack.config.js',
  'config.json',
  'package.json',
  'babel.config.js',
  '.gitignore',
  '.editorconfig',
  'postcss.config.js',
  'README.md',
  path.join(config.src, config.scripts.src, `${config.scripts.bundle}.${config.scripts.extension}`),
  path.join(config.src, config.styles.src, `${config.styles.bundle}.${config.styles.extension}`),
]

const unexpectedFiles = [
  'eslintrc.js',
]

const expectedCompilation = [
  path.join(config.dest, config.styles.dest, `${config.styles.bundle}.css`),
  path.join(config.dest, config.scripts.dest, `${config.scripts.bundle}.${config.scripts.extension}`),
]

const setProcessToDestination = (dest = 'tmp/markup') => process.chdir(path.resolve(__dirname, dest));

describe(chalk.blue(`Project with prompts: ${JSON.stringify(prompts)}`), async () => {
  before(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inDir(tempFolder)
      .withPrompts(prompts)
  });

  describe('Create files:', () => {
    it(chalk.green('Created expected files'), async () => {
      setProcessToDestination();
      await yeomanAssert.file(expectedFiles);
      await yeomanAssert.noFile(unexpectedFiles);
    });
  })

  describe('Install dependencies:', () => {
    it(chalk.green('Install all dependencies'), async () => {
      const cli = await chaiExecAsync('yarn');
      assert.exitCode(cli, 0);
    })
  });

  describe('Run build process:', () => {
    it(chalk.green('Run project in production mode:'), async () => {
      const cli = await chaiExecAsync('yarn build');
      assert.exitCode(cli, 0);
    });
  });

  describe('Build correct files:', () => {
    setProcessToDestination();
    it(chalk.green('Generate all files based on config'), async () => {
      await yeomanAssert.file(expectedCompilation);
    });
  })
});
