const chalk = require('chalk');
const {join, resolve} = require('path');
const {readdir, stat} = require('fs');
const {promisify} = require('util');
const {PATHS} = require('./globals');

const readdirP = promisify(readdir);
const statP = promisify(stat);

async function getFilesArray(dir, allFiles = []) {
  const files = (await readdirP(dir)).map(file => join(dir, file));

  allFiles.push(...files);

  await Promise.all(files.map(async f => (await statP(f)).isDirectory() && getFilesArray(f, allFiles)));

  return allFiles.map(file => {
    return file
      .split(dir)
      .pop()
      .substring(1);
  });
}

const setProcessToDestination = (dest = PATHS.tempMarkupFolder) => process.chdir(resolve(__dirname, dest));

const projectTypeMessage = prompts => {
  const message = `
    Project with settings:
    ${chalk.yellow(
      `
        1) Project type: ${prompts.projectType}
        2) CSS/JS framework: ${prompts.framework}
        3) Linters: ${JSON.stringify(prompts.linters)}
        4) CMS: ${JSON.stringify(prompts.cms)}
        5) Templating: ${JSON.stringify(prompts.templating)}
        `
    )}
  `;
  return chalk.blue(message)
}

module.exports = {getFilesArray, setProcessToDestination, projectTypeMessage};
