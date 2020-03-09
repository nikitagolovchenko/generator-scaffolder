const fs = require('fs');
const chalk = require('chalk');
const chai = require('chai');
const glob = require('glob');
const helpers = require('yeoman-test');
const yeomanAssert = require('yeoman-assert');
const { join } = require('path');
const { getFilesArray, setProcessToDestination } = require(`${process.env.PWD}/generators/app/utils`);
const { chaiExecAsync } = require('chai-exec');
const { PROMPTS_VALUES, PATHS, OTHER_FILES, SCRIPTS, PACKAGES } = require(`${process.env.PWD}/generators/app/globals`);

const ONLY_FILES_TEST = process.env.FILES_ONLY;
const assert = chai.assert;

const expectedFilesContent = {
  js: [
    /import 'what-input';/,
    /import 'foundation-sites';/,
  ],
  styles: [
    /@import 'vendors\/zurb';/,
    /@import 'vendors-extensions\/zurb';/,
    /@import 'vendors\/zurb-utilities';/,
  ],
  json: [PACKAGES.frameworks.zurb],
}

const staticExpectedFiles = [];
const staticUnexpectedFiles = [...OTHER_FILES.linters.general, ...OTHER_FILES.linters.css, ...OTHER_FILES.linters.js];
const prompts = {
  projectType: PROMPTS_VALUES.projectType.markup,
  framework: PROMPTS_VALUES.framework.zurb,
  linters: false,
};

chai.use(chaiExecAsync);

describe(chalk.blue(`Project with prompts: ${chalk.yellow(JSON.stringify(prompts))}`), async () => {
  before(() => {
    return helpers
      .run(PATHS.appFolder)
      .inDir(PATHS.tempFolder)
      .withPrompts(prompts);
  });

  const newCfg = JSON.parse(fs.readFileSync(join(PATHS.tempMarkupFolder, 'config.json')));
  const newPkgfilePath = join(PATHS.tempMarkupFolder, 'package.json');
  const jsFile = join(PATHS.tempMarkupFolder, newCfg.src, newCfg.scripts.src, `${newCfg.scripts.bundle}.${newCfg.scripts.extension}`);
  const stylesFile = join(PATHS.tempMarkupFolder, newCfg.src, newCfg.styles.src, `${newCfg.styles.bundle}.${newCfg.styles.extension}`);

  describe('Generating files:', () => {
    it(chalk.green('Create expected files'), async () => {
      setProcessToDestination();

      const unexpectedFiles = [].concat(staticUnexpectedFiles);
      const expectedFiles = [...await getFilesArray(PATHS.baseFolder)]
        .concat([...await getFilesArray(join(PATHS.templatesFolder, PROMPTS_VALUES.framework.zurb))])
        .concat(staticExpectedFiles);

      await yeomanAssert.file(expectedFiles);
      await yeomanAssert.noFile(unexpectedFiles);
    });
  });

  describe('Checking dependencies:', () => {
    setProcessToDestination();

    it(chalk.green('Library imported into JS:'), () => {
      expectedFilesContent.js.map(content => yeomanAssert.fileContent(jsFile, content));
    });

    it(chalk.green('Library imported into Styles:'), () => {
      expectedFilesContent.styles.map(content => yeomanAssert.fileContent(stylesFile, content));
    });

    it(chalk.green('Modules added to package.json:'), () => {
      expectedFilesContent.json.map(content => yeomanAssert.jsonFileContent(newPkgfilePath, content));
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

