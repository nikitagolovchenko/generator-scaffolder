const {existsSync, mkdir} = require('fs');
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

const setProcessToDestination = (dest = PATHS.tempMarkupFolder) => {
  if (!existsSync(dest)) {
    mkdir('./test/tmp/markup/', {}, () => {
      process.chdir(resolve(__dirname, dest));
    })
  } else {
    process.chdir(resolve(__dirname, dest));
  }
};

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

/**
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 *
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
function mergeDeep(target, source) {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}

module.exports = {getFilesArray, setProcessToDestination, projectTypeMessage, mergeDeep};
