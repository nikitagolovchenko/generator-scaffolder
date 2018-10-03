module.exports = [
  {
    type: 'list',
    name: 'project_type',
    message: 'Select project type',
    choices: [
      {
        name: 'Markup only',
        value: 'markup'
      },
      {
        name: 'Markup + CMS',
        value: 'markup_cms'
      },
      {
        name: 'HTML5 Banner',
        value: 'markup_banner'
      }
    ],
    default: 0
  },
  {
    type: 'list',
    name: 'frontend_framework',
    message: 'Select project type',
    choices: [
      {
        name: 'No framework',
        value: 'no_framework'
      },
      {
        name: 'Bootstrap',
        value: 'bootstrap'
      },
      {
        name: 'Zurb Foundation',
        value: 'zurb'
      },
      {
        name: 'Materialize',
        value: 'materialize'
      }
    ],
    default: 0
  },
  {
    type: 'list',
    name: 'html_preprocessor',
    message: 'Select HTML preprocessor',
    choices: [
      {
        name: 'Pure HTML',
        value: 'html_preprocessor_none'
      },
      {
        name: 'HAML',
        value: 'html_preprocessor_haml'
      },
      {
        name: 'PUG(JADE)',
        value: 'html_preprocessor_fade'
      }
    ],
    default: 0
  }
];
