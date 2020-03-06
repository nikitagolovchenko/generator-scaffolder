const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const chai = require("chai");
const helpers = require('yeoman-test');
const yeomanAssert = require('yeoman-assert');
const {getFilesArray} = require('../generators/app/utils');
const { chaiExecAsync } = require("chai-exec");
const {PROMPTS_VALUES, CONFIG, PATHS} = require('../generators/app/globals');

const assert = chai.assert;

chai.use(chaiExecAsync);

chaiExecAsync.defaults = {
  options: {
    cwd: PATHS.tempMarkupFolder
  }
};

const prompts = {
  projectType: PROMPTS_VALUES.projectType.markup,
  framework: PROMPTS_VALUES.framework.none,
  linters: PROMPTS_VALUES.linters.remove,
}

const unexpectedFiles = [
  'eslintrc.js',
]

const expectedCompilation = [
  path.join(CONFIG.dest, CONFIG.styles.dest, `${CONFIG.styles.bundle}.css`),
  path.join(CONFIG.dest, CONFIG.scripts.dest, `${CONFIG.scripts.bundle}.${CONFIG.scripts.extension}`),
]


const setProcessToDestination = (dest = PATHS.tempMarkupFolder) => process.chdir(path.resolve(__dirname, dest));



describe(chalk.blue(`Project with prompts: ${JSON.stringify(prompts)}`), async () => {
  before(async () => {
    return helpers
      .run(PATHS.appFolder)
      .inDir(PATHS.tempFolder)
      .withPrompts(prompts)
  });

  describe('Generating files:', () => {
    it(chalk.green('Create expected files'), async () => {
      const expectedFiles = await getFilesArray(PATHS.baseFolder);

      setProcessToDestination();
      await yeomanAssert.file(expectedFiles);
      await yeomanAssert.noFile(unexpectedFiles);
    });
  })

  // describe('Installing dependencies:', () => {
  //   it(chalk.green('Install all dependencies'), async () => {
  //     const cli = await chaiExecAsync('yarn');
  //     assert.exitCode(cli, 0);
  //   })
  // });

  // describe('Running build process:', () => {
  //   it(chalk.green('Build process is correct:'), async () => {
  //     const cli = await chaiExecAsync('yarn build');
  //     assert.exitCode(cli, 0);
  //   });
  // });

  // describe('Building correct files:', () => {
  //   setProcessToDestination();
  //   it(chalk.green('Generate all files based on project config'), async () => {
  //     await yeomanAssert.file(expectedCompilation);
  //   });
  // })
});
