const fs = require('fs');
const chalk = require('chalk');
const chai = require('chai');
const glob = require('glob');
const helpers = require('yeoman-test');
const yeomanAssert = require('yeoman-assert');
const { join } = require('path');
const { promisify } = require('util');
const { getFilesArray, setProcessToDestination } = require(`${process.cwd()}/generators/app/utils`);
const { chaiExecAsync } = require('chai-exec');
const { PROMPTS_VALUES, PATHS, OTHER_FILES, SCRIPTS } = require(`${process.cwd()}/generators/app/globals`);

const ONLY_FILES_TEST = process.env.FILES_ONLY;
const assert = chai.assert;

const staticExpectedFiles = [];
const staticUnexpectedFiles = [...OTHER_FILES.linters.general, ...OTHER_FILES.linters.css, ...OTHER_FILES.linters.js];
const prompts = {
  projectType: PROMPTS_VALUES.projectType.markup,
  framework: PROMPTS_VALUES.framework.none,
  linters: false,
};

const markupNoFramesNoLint = () => {
  chai.use(chaiExecAsync);
  
  describe(chalk.blue(`Project with prompts: ${chalk.yellow(JSON.stringify(prompts))}`), async () => {
    before(async () => {
      return helpers
        .run(PATHS.appFolder)
        .inDir(PATHS.tempFolder)
        .withPrompts(prompts);
    });

    describe('Generating files:', () => {
      it(chalk.green('Create expected files'), async () => {
        setProcessToDestination();

        const expectedFiles = [...await getFilesArray(PATHS.baseFolder)].concat(staticExpectedFiles);
        const unexpectedFiles = [].concat(staticUnexpectedFiles);

        await yeomanAssert.file(expectedFiles);
        yeomanAssert.noFile(unexpectedFiles);
      });
    });

    if (!ONLY_FILES_TEST) {
      describe('Installing dependencies:', () => {
        it(chalk.green('Install all dependencies'), async () => {
          const cli = await chaiExecAsync(SCRIPTS.install);
          assert.exitCode(cli, 0);
        });
      });

      describe('Running build process:', () => {
        it(chalk.green('Build process is correct:'), async () => {
          const cli = await chaiExecAsync(SCRIPTS.build);
          assert.exitCode(cli, 0);
        });
      });

      describe('Building correct files:', () => {
        it(chalk.green('Generate all files based on project config'), async () => {
          setProcessToDestination();

          const newCfg = JSON.parse(fs.readFileSync(join(PATHS.tempMarkupFolder, 'config.json')));
          const stylesFile = join(newCfg.dest, newCfg.styles.dest, `${newCfg.styles.bundle}.css`);
          const jsFile = join(newCfg.dest, newCfg.scripts.dest, `${newCfg.scripts.bundle}.${newCfg.scripts.extension}`);
          const HTMLFiles = join(newCfg.dest, newCfg.templates.dest, `*.${newCfg.templates.extension}`);

          const expectedCompilation = [stylesFile, jsFile];

          glob(HTMLFiles, {}, (err, files) => {
            expectedCompilation.push(...files);
            yeomanAssert.file(expectedCompilation);
          })
        });
      });
    }
  });
}

module.exports = markupNoFramesNoLint;


