const {PROMPTS_VALUES} = require('./globals');

module.exports = [
  {
    type: 'list',
    name: Object.keys(PROMPTS_VALUES)[0],
    message: 'Select project type:',
    choices: [
      {
        name: 'Markup only',
        value: PROMPTS_VALUES.projectType.markup,
      },
      {
        name: 'Markup + CMS',
        value: PROMPTS_VALUES.projectType.markupCms,
      },
    ],
    default: 0,
  },
  {
    when: (answers) => answers.projectType === PROMPTS_VALUES.projectType.markupCms,
    type: 'list',
    name: Object.keys(PROMPTS_VALUES)[1],
    message: 'Select CMS:',
    choices: [
      {
        name: 'Wordpress',
        value: PROMPTS_VALUES.cms.wp,
      },
      {
        name: 'Other CMS',
        value: PROMPTS_VALUES.cms.other,
      },
    ],
    default: 0,
  },
  {
    type: 'list',
    name: Object.keys(PROMPTS_VALUES)[2],
    message: 'Select framework:',
    choices: [
      {
        name: 'No framework',
        value: PROMPTS_VALUES.framework.none,
      },
      {
        name: 'Bootstrap',
        value: PROMPTS_VALUES.framework.bootstrap,
      },
      {
        name: 'Zurb Foundation',
        value: PROMPTS_VALUES.framework.zurb,
      },
      {
        name: 'Materialize',
        value: PROMPTS_VALUES.framework.materialize,
      },
      {
        name: 'Tailwind CSS',
        value: PROMPTS_VALUES.framework.tailwind,
      },
    ],
    default: 0,
  },
  {
    type: 'list',
    name: Object.keys(PROMPTS_VALUES)[3],
    message: 'Select Template Engine:',
    choices: [
      {
        name: 'No engine, just HTML',
        value: PROMPTS_VALUES.templating.html,
      },
      {
        name: 'PUG',
        value: PROMPTS_VALUES.templating.pug,
      },
      {
        name: 'Twig',
        value: PROMPTS_VALUES.templating.twig,
      },
    ],
    default: 0,
  },
  {
    type: 'expand',
    name: 'lintersSetup',
    message: 'Do you want to use linters for SCSS and JS ?',
    choices: [
      {
        key: 'y',
        name: 'Yes, add linters',
        value: true,
      },
      {
        key: 'n',
        name: "I don't want to lint my code 😢",
        value: false,
      },
    ],
    default: 0,
  },
  {
    when: answers => answers.lintersSetup,
    type: 'checkbox',
    name: Object.keys(PROMPTS_VALUES)[4],
    message: 'Choose linters for your project:',
    choices: [
      {
        name: 'Stylelint for SCSS',
        checked: true,
        value: PROMPTS_VALUES.linters.css,
      },
      {
        name: 'ESLint for JS',
        checked: true,
        value: PROMPTS_VALUES.linters.js,
      },
    ],
    default: [0, 1],
  },
];
