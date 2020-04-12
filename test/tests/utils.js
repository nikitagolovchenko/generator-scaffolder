const glob = require('glob');
const rimraf = require('rimraf');
const { PATHS } = require(`${process.env.PWD}/generators/app/globals`);

const cleanUpFolder = async (pattern = `${PATHS.tempFolder}markup/!(node_modules|yarn.lock)`) => {
  await new Promise((resolve, reject) => {
    try {
      glob(pattern, async (err, matches) => {
        await Promise.all(
          matches.map((match, i) => {
            return new Promise((res) => {
              rimraf(match, () => res(match));
            });
          })
        );
        resolve(matches);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {cleanUpFolder};
