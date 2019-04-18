const path = require('path');
const chalk = require('chalk');
const del = require('del');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const VALUES = require('../generators/app/globals');
const { PROMPTS_VALUES } = require('../generators/app/globals');

const expectedFiles = [`${VALUES.SRC_SCSS}/vendors/_normalize.scss`].concat(
  VALUES.generalExpectedFiles,
  VALUES.webpackFiles
);

const nonExpectedFiles = [].concat(
  VALUES.nonWebpackFiles,
  VALUES.cmsSpecificFiles,
  VALUES.cmsSpecificFiles_WP
);

const expectedContent = [
  [`${VALUES.SRC_SCSS}/main.scss`, 'vendors/normalize'],
].concat(VALUES.generalExpectedContent);

const nonExpectedContent = [].concat(VALUES.cmsSpecificContent_WP);

describe(chalk.blue('Static markup + webpack'), () => {
  const AppFolderPath = path.join(VALUES.INIT_CWD, 'generators/app');

  beforeEach(() => {
    return helpers
      .run(AppFolderPath)
      .cd(VALUES.TEST_FOLDER)
      .withPrompts({
        project_type: PROMPTS_VALUES.project_type.markup,
        frontend_framework: PROMPTS_VALUES.frontend_framework.none,
        js_bundler: PROMPTS_VALUES.js_bundler.webpack,
      });
  });

  it(chalk.yellow('Created expected files'), done => {
    process.chdir(`${VALUES.TEST_FOLDER}/${VALUES.MARKUP}`);
    assert.file(expectedFiles);
    assert.noFile(nonExpectedFiles);
    assert.fileContent(expectedContent);
    assert.noFileContent(nonExpectedContent);
    done();
  });
  afterEach(async () => {
    await del(
      [
        `${VALUES.SRC}`,
        `${VALUES.DEST}`,
        `${VALUES.GULP}`,
        `!${VALUES.ROOT_MODULES}`,
      ].concat(
        VALUES.generalExpectedFiles,
        VALUES.webpackFiles,
        VALUES.sassFiles
      )
    );
    process.chdir(VALUES.INIT_CWD);
  });
});
