let config = require('../../gulpConfig');
let gulp = require('gulp');
let del = require('del');
var chalk = require('chalk');
const globby = require('globby');

function deleteUnused(source, destination) {
  return Promise.all([
    globby(source),
    globby(destination)
  ])
  .then((paths) => {
    let srcPaths = paths[0];
    let destPaths = paths[1];
    let srcInnerDirectories = srcPaths;
    let destInnerDirectories = destPaths;
    let unusedFiles = [];
    let folderIsExist = false;

    //check for folders
    destPaths.map((destPath) => {
      let directory = destPath.replace(/dist\//, "").replace(/images\//, "");
      let tempName = 'folder';
      let matchFolder;

      if (/^([A-Za-z\d]*\/w*)/.test(directory) && !folderIsExist) {
        directory.replace(/^([A-Za-z\d]*\/w*)/, "folder");
        matchFolder = directory.substr(0, tempName.length);
        srcPaths.push('src/' + matchFolder);
        destPaths.push('dist/' + matchFolder);
        folderIsExist = true;
      }
    });

    //@TODO: folder deleting

    destPaths.map((destPath) => {   
      let unusedFilesFiltered = destPath.replace(/dist/, "src");

      if (srcPaths.indexOf(unusedFilesFiltered) === -1 ) {
        unusedFiles.push(destPath);
      }
    });

    return unusedFiles;
  })
  .then((unusedFiles) => {
    if (!unusedFiles.length) return;

    del.sync(unusedFiles);
    console.log(chalk.bgCyan.bold(' Deleted: '), chalk.magenta.bold(unusedFiles.join('\n')));
  })
  .catch((error) => {
    console.log(chalk.bgRed.white.bold(error));
  });
};

module.exports = deleteUnused;