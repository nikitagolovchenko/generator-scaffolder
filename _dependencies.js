const chalk = require('chalk');
const fs = require('fs');
const child_process = require('child_process');
const VALUES = require('../generators/app/globals');

const testModules = item => `${VALUES.TEST_FOLDER}/${VALUES.MARKUP_MODULES}/${item}`;

let generateDependencies = (arr, cb) => {
  arr.forEach((item, num) => {
    cb(item, num);
  });
};
let expectedFiles = [];

describe(chalk.blue('Installing frameworks dependencides'), () => {
  beforeEach(async () => {
    for (var group in VALUES.additionalPackages) {
      let packageCopy = VALUES.additionalPackages[group];
      for (packageType in packageCopy) {
        let packageTypeCopy = packageCopy[packageType];
        for (key in packageTypeCopy.dependencies) {
          expectedFiles.push({
            name: key,
            version: packageTypeCopy.dependencies[key],
            fileForSearch: 'package.json',
          });
        }
      }
    }
    await generateDependencies(expectedFiles, (item, num) => {
      if (!fs.existsSync(testModules(item.name))) {
        child_process.execSync(`npm install ${item.name}@${item.version} --force`, {
          cwd: testModules(item.name),
          stdio: ['inherit', 'inherit', 'inherit'],
        });
      }
    });
  });

  it(chalk.yellow('All dependencies for test are installed'), async () => {
    await generateDependencies(expectedFiles, (item, num) => {
      fs.existsSync(testModules(item.name));
    });
  });
});
