const chalk = require('chalk');
const bootstrapTest = require('./markupOnly/bootstrap');
const defaultTest = require('./markupOnly/default');
const zurbTest = require('./markupOnly/zurb');
const materializeTest = require('./markupOnly/materialize');
const tailwindTest = require('./markupOnly/tailwind');
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

describe(title('Markup + Wordpress'), () => {
  defaultTest(TESTS_SETTINGS.wp.default);
  bootstrapTest(TESTS_SETTINGS.wp.bootstrap);
  materializeTest(TESTS_SETTINGS.wp.materialize);
  zurbTest(TESTS_SETTINGS.wp.zurb);
  tailwindTest(TESTS_SETTINGS.wp.tailwind);
})
