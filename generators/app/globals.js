exports.PROMPTS_VALUES = {
  project_type: {
    name: 'project_type',
    markup: 'markup',
    markup_cms: 'markup_cms',
    markup_banner: 'markup_banner',
  },
  cms_type: {
    name: 'cms_type',
    wp: 'wp',
    magento: 'magento',
    other: 'other',
  },
  frontend_framework: {
    name: 'frontend_framework',
    none: '',
    bootstrap: 'bootstrap',
    zurb: 'zurb',
    materialize: 'materialize',
  },
  bootstrap_version: {
    name: 'bootstrap_version',
    bootstrap_4: '4',
    bootstrap_3: '3',
  },
  bootstrap_css_preprocessor: {
    name: 'bootstrap_css_preprocessor',
    sass: 'sass',
    less: 'less',
  },
  js_bundler: {
    name: 'js_bundler',
    webpack: 'webpack',
    no_webpack: 'no_webpack',
  },
  html_preprocessor: {
    name: 'html_preprocessor',
    none: 'none',
    haml: 'haml',
    jade: 'jade',
  },
};

exports.additionalPackages = {
  frameworks: {
    bootstrap_3_less: {
      name: 'generator-p2h-bootstrap-3-less',
      description: 'Gulp build for bootstrap 3 with LESS source files',
      dependencies: {
        'bootstrap-less': '3.3.7',
      },
    },
    bootstrap_3_sass: {
      name: 'generator-p2h-bootstrap-3-scss',
      description: 'Gulp build for bootstrap 3 with SCSS source files',
      dependencies: {
        'bootstrap-sass': '3.3.7',
      },
    },
    bootstrap_4: {
      name: 'generator-p2h-bootstrap4',
      description: 'Gulp build for bootstrap 4',
      dependencies: {
        bootstrap: '^4.1.3',
        'popper.js': '^1.14.1',
      },
    },
    zurb: {
      name: 'generator-p2h-zurb-foundation',
      description: 'Gulp build for Zurb Foundation',
      dependencies: {
        'foundation-sites': '^6.5.0-rc.3',
        'what-input': '^5.1.2',
      },
    },
    materialize: {
      name: 'generator-p2h-materialize',
      description: 'Gulp build for Materialize',
      dependencies: {
        'materialize-css': '^1.0.0-rc.2',
      },
    },
  },
};

const SRC = 'src';
const DEST = 'dist';
const MARKUP = 'markup';
const GULP = 'gulp';
const GULP_TASKS = `${GULP}/tasks`;
const ROOT_MODULES = 'node_modules';

const SRC_IMAGES = `${SRC}/images`;
const SRC_FONTS = `${SRC}/fonts`;
const SRC_SCSS = `${SRC}/scss`;
const SRC_GENERAL_FILES = `${SRC}/general_files`;
const SRC_JS = `${SRC}/js`;
const SRC_JS_NO_WEBPACK = `${SRC}/js_no-webpack`;
const SRC_JS_PUBLIC_PATH = `${SRC}/js_publicPath_wp`;
const GULP_TASKS_ROOT = `${GULP}/tasks`;
const GULP_TASKS_MARKUP = `${MARKUP}/${GULP_TASKS_ROOT}`;
const MARKUP_SRC = `${MARKUP}/${SRC}`;
const MARKUP_MODULES = `${MARKUP}/${ROOT_MODULES}`;

exports.SRC = SRC;
exports.SRC_IMAGES = SRC_IMAGES;
exports.SRC_FONTS = SRC_FONTS;
exports.SRC_SCSS = SRC_SCSS;
exports.SRC_GENERAL_FILES = SRC_GENERAL_FILES;
exports.SRC_JS = SRC_JS;
exports.SRC_JS_NO_WEBPACK = SRC_JS_NO_WEBPACK;
exports.SRC_JS_PUBLIC_PATH = SRC_JS_PUBLIC_PATH;
exports.DEST = DEST;
exports.MARKUP = MARKUP;
exports.MARKUP_SRC = MARKUP_SRC;
exports.ROOT_MODULES = ROOT_MODULES;
exports.GULP = GULP;
exports.GULP_TASKS_ROOT = GULP_TASKS_ROOT;
exports.GULP_TASKS_MARKUP = GULP_TASKS_MARKUP;
exports.MARKUP_MODULES = MARKUP_MODULES;
exports.INIT_CWD = process.env.INIT_CWD;
exports.TEST_FOLDER = `${process.env.INIT_CWD}/test`;

exports.generalExpectedFiles = [
  `README.md`,
  `.editorconfig`,
  `htmlhint.config.js`,
  `package.json`,
  `gulpfile.js`,
  `${GULP}/config.js`,
  `${GULP_TASKS}/util/watchDeletedFiles.js`,
  `${GULP_TASKS}/util/message--deleted.js`,
  `${GULP_TASKS}/util/message--error.js`,
  `${GULP_TASKS}/util/paths.js`,
  `${GULP_TASKS}/ajaxIncludes.js`,
  `${GULP_TASKS}/browserSync.js`,
  `${GULP_TASKS}/clean.js`,
  `${GULP_TASKS}/clear.js`,
  `${GULP_TASKS}/copy.js`,
  `${GULP_TASKS}/default.js`,
  `${GULP_TASKS}/fonts.js`,
  `${GULP_TASKS}/html.js`,
  `${GULP_TASKS}/imagemin.js`,
  `${GULP_TASKS}/video.js`,
  `${GULP_TASKS}/zip.js`,
  `${GULP_TASKS}/eslint.js`,
  `${GULP_TASKS}/htmlhint.js`,
  `${SRC_JS}/app.js`,
  `${SRC}/index.html`,
];

exports.generalExpectedContent = [
  [`${GULP_TASKS}/util/paths.js`, 'css: `${destPath}/css`'],
  [`${SRC}/index.html`, `<link rel="stylesheet" href="css/main.css">`],
];

exports.webpackFiles = [
  'eslintrc.js',
  'babel.config.js',
  'webpack.config.js',
  `prettier.config.js`,
  `${GULP_TASKS}/webpack.js`,
];

exports.nonWebpackFiles = [`${SRC_JS}/jquery-3.3.1.min.js`];

exports.nonWebpackContent = [
  [
    `${SRC}/index.html`,
    `https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js`,
  ],
];

exports.cmsSpecificFiles = [`${SRC_SCSS}/base/_cms-reset.scss`];

exports.cmsSpecificFiles_WP = [
  `${SRC_SCSS}/base/_wp-reset.scss`,
  `${SRC_SCSS}/style.scss`,
  `${SRC}/wp-test.html`,
];

exports.cmsSpecificContent_WP = [
  [`${GULP_TASKS}/util/paths.js`, 'css: `${destPath}`'],
  [`${SRC}/index.html`, `<link rel="stylesheet" href="style.css">`],
];

exports.sassFiles = [
  `sass-lint.yml`,
  `${GULP_TASKS}/sass-lint.js`,
  `${GULP_TASKS}/linters.js`,
  `${GULP_TASKS}/sass.js`,
];

exports.nonFrameworkScssFiles = [`${SRC_SCSS}/base/*`];
