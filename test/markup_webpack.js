const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const chai = require('chai');
const helpers = require('yeoman-test');
const yeomanAssert = require('yeoman-assert');
const {getFilesArray, setProcessToDestination} = require('../generators/app/utils');
const {chaiExecAsync} = require('chai-exec');
const {PROMPTS_VALUES, PATHS, OTHER_FILES} = require('../generators/app/globals');

const assert = chai.assert;

chai.use(chaiExecAsync);

const prompts = {
  projectType: PROMPTS_VALUES.projectType.markup,
  framework: PROMPTS_VALUES.framework.none,
  linters: false,
};

describe(chalk.blue(`Project with prompts: ${JSON.stringify(prompts)}`), async () => {
  before(async () => {
    return helpers
      .run(PATHS.appFolder)
      .inDir(PATHS.tempFolder)
      .withPrompts(prompts);
  });

  describe('Generating files:', () => {
    it(chalk.green('Create expected files'), async () => {
      setProcessToDestination();

      const expectedFiles = await getFilesArray(PATHS.baseFolder);
      const unexpectedFiles = [...OTHER_FILES.linters.general, ...OTHER_FILES.linters.css, ...OTHER_FILES.linters.js];

      await yeomanAssert.file(expectedFiles);
      await yeomanAssert.noFile(unexpectedFiles);
    });
  });

  describe('Installing dependencies:', () => {
    it(chalk.green('Install all dependencies'), async () => {
      const cli = await chaiExecAsync('yarn');
      assert.exitCode(cli, 0);
    });
  });

  describe('Running build process:', () => {
    it(chalk.green('Build process is correct:'), async () => {
      const cli = await chaiExecAsync('yarn build');
      assert.exitCode(cli, 0);
    });
  });

  describe('Building correct files:', () => {
    it(chalk.green('Generate all files based on project config'), async () => {
      setProcessToDestination();

      const newCfg = JSON.parse(fs.readFileSync(path.join(PATHS.tempMarkupFolder, 'config.json')));
      const expectedCompilation = [
        path.join(newCfg.dest, newCfg.styles.dest, `${newCfg.styles.bundle}.css`),
        path.join(newCfg.dest, newCfg.scripts.dest, `${newCfg.scripts.bundle}.${newCfg.scripts.extension}`),
      ];

      await yeomanAssert.file(expectedCompilation);
    });
  });
});
