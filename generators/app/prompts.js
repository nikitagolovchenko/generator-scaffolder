const { PROMPTS_VALUES } = require('./globals');

module.exports = [
  {
    type: 'list',
    name: PROMPTS_VALUES.project_type.name,
    message: 'Select project type:',
    choices: [
      {
        name: 'Markup only',
        value: PROMPTS_VALUES.project_type.markup_only,
      },
      {
        name: 'Markup + CMS',
        value: PROMPTS_VALUES.project_type.markup_cms,
      },
      {
        name: 'HTML5 Banner',
        value: PROMPTS_VALUES.project_type.markup_banner,
      },
    ],
    default: 0,
  },
  {
    when: answers =>
      answers.project_type === PROMPTS_VALUES.project_type.markup_cms,
    type: 'list',
    name: PROMPTS_VALUES.cms_type.name,
    message: 'Select CMS:',
    choices: [
      {
        name: 'Wordpress',
        value: PROMPTS_VALUES.cms_type.cms_wp,
      },
      // {
      //   name: 'Magento',
      //   value: PROMPTS_VALUES.cms_type.cms_magento,
      // },
      {
        name: 'Other CMS',
        value: PROMPTS_VALUES.cms_type.cms_other,
      },
    ],
    default: 0,
  },
  {
    type: 'list',
    name: PROMPTS_VALUES.frontend_framework.name,
    message: 'Select frontend framework:',
    choices: [
      {
        name: 'No framework',
        value: PROMPTS_VALUES.frontend_framework.none,
      },
      {
        name: 'Bootstrap',
        value: PROMPTS_VALUES.frontend_framework.bootstrap,
      },
      {
        name: 'Zurb Foundation',
        value: PROMPTS_VALUES.frontend_framework.zurb,
      },
      {
        name: 'Materialize',
        value: PROMPTS_VALUES.frontend_framework.materialize,
      },
    ],
    default: 0,
  },
  {
    when: answers =>
      answers.frontend_framework ===
      PROMPTS_VALUES.frontend_framework.bootstrap,
    type: 'list',
    name: PROMPTS_VALUES.bootstrap_version.name,
    message: 'Select Bootstrap version:',
    choices: [
      {
        name: 'Bootstrap 4',
        value: PROMPTS_VALUES.bootstrap_version.bootstrap_4,
      },
      {
        name: 'Bootstrap 3',
        value: PROMPTS_VALUES.bootstrap_version.bootstrap_3,
      },
    ],
    default: 0,
  },
  {
    when: answers =>
      answers.bootstrap_version ===
      PROMPTS_VALUES.bootstrap_version.bootstrap_3,
    type: 'list',
    name: PROMPTS_VALUES.bootstrap_css_preprocessor.name,
    message: 'Select CSS preprocessor:',
    choices: [
      {
        name: 'SCSS',
        value: PROMPTS_VALUES.bootstrap_css_preprocessor.scss,
      },
      // {
      //   name: 'LESS',
      //   value: PROMPTS_VALUES.bootstrap_css_preprocessor.less,
      // },
    ],
    default: 0,
  },
  {
    type: 'list',
    name: PROMPTS_VALUES.js_bundler.name,
    message: 'Do you want to use Webpack?:',
    choices: [
      {
        name: 'Yes, lets use it!',
        value: PROMPTS_VALUES.js_bundler.webpack,
      },
      {
        name: 'No',
        value: PROMPTS_VALUES.js_bundler.no_webpack,
      },
    ],
    default: 0,
  },
];
