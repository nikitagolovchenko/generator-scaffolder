const chalk = require('chalk');
const bootstrapTest = require('./tests/bootstrap');
const defaultTest = require('./tests/default');
const zurbTest = require('./tests/zurb');
const materializeTest = require('./tests/materialize');
const tailwindTest = require('./tests/tailwind');
const { TESTS_SETTINGS } = require(`${process.env.PWD}/generators/app/globals`);

const title = (text) => {
  return chalk.bgCyan(chalk.bold.black(`
    ****************************
    ${text}
    ****************************`))
}

describe(title('Markup'), () => {
  defaultTest(TESTS_SETTINGS.markup.default);
  bootstrapTest(TESTS_SETTINGS.markup.bootstrap);
  materializeTest(TESTS_SETTINGS.markup.materialize);
  tailwindTest(TESTS_SETTINGS.markup.tailwind);
  zurbTest(TESTS_SETTINGS.markup.zurb);
})

describe(title('Markup + PUG'), () => {
  defaultTest({...TESTS_SETTINGS.markup.default, ...TESTS_SETTINGS.pug});
  bootstrapTest({...TESTS_SETTINGS.markup.bootstrap, ...TESTS_SETTINGS.pug});
  materializeTest({...TESTS_SETTINGS.markup.materialize, ...TESTS_SETTINGS.pug});
  tailwindTest({...TESTS_SETTINGS.markup.tailwind, ...TESTS_SETTINGS.pug});
  zurbTest({...TESTS_SETTINGS.markup.zurb, ...TESTS_SETTINGS.pug});
})

describe(title('Markup + Wordpress'), () => {
  defaultTest(TESTS_SETTINGS.wp.default);
  bootstrapTest(TESTS_SETTINGS.wp.bootstrap);
  materializeTest(TESTS_SETTINGS.wp.materialize);
  zurbTest(TESTS_SETTINGS.wp.zurb);
  tailwindTest(TESTS_SETTINGS.wp.tailwind);
})


