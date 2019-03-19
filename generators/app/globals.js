const PROMPTS_VALUES = {
  project_type: {
    name: 'project_type',
    markup_only: 'markup_only',
    markup_cms: 'markup_cms',
    markup_banner: 'markup_banner',
  },
  cms_type: {
    name: 'cms_type',
    cms_wp: 'cms_wp',
    cms_magento: 'cms_magento',
    cms_other: 'cms_other',
  },
  frontend_framework: {
    name: 'frontend_framework',
    none: 'none',
    bootstrap: 'bootstrap',
    zurb: 'zurb',
    materialize: 'materialize',
  },
  bootstrap_version: {
    name: 'bootstrap_version',
    bootstrap_4: 'bootstrap_4',
    bootstrap_3: 'bootstrap_3',
  },
  bootstrap_css_preprocessor: {
    name: 'bootstrap_css_preprocessor',
    scss: 'scss',
    less: 'less',
  },
  js_bundler: {
    name: 'js_bundler',
    webpack: 'webpack',
    no_webpack: 'no_webpack'
  },
  html_preprocessor: {
    name: 'html_preprocessor',
    none: 'none',
    haml: 'haml',
    jade: 'jade',
  },
};

const SRC = 'src';
const DEST = 'dist';
const MARKUP = 'markup';
const GULP = 'gulp';
const ROOT_MODULES = 'node_modules';

const SRC_IMAGES = `${SRC}/images`;
const SRC_FONTS = `${SRC}/fonts`;
const SRC_GENERAL_FILES = `${SRC}/general_files`;
const SRC_JS = `${SRC}/js`;
const SRC_JS_DEFAULT = `${SRC}/js_no-webpack`;
const GULP_TASKS_ROOT = `${GULP}/tasks`;
const GULP_TASKS_MARKUP = `${MARKUP}/${GULP_TASKS_ROOT}`;
const MARKUP_SRC = `${MARKUP}/${SRC}`;
const MARKUP_MODULES = `${MARKUP}/${ROOT_MODULES}`;

exports.SRC = SRC;
exports.SRC_IMAGES = SRC_IMAGES;
exports.SRC_FONTS = SRC_FONTS;
exports.SRC_GENERAL_FILES = SRC_GENERAL_FILES;
exports.SRC_JS = SRC_JS;
exports.SRC_JS_DEFAULT = SRC_JS_DEFAULT;
exports.DEST = DEST;
exports.MARKUP = MARKUP;
exports.MARKUP_SRC = MARKUP_SRC;
exports.ROOT_MODULES = ROOT_MODULES;
exports.GULP = GULP;
exports.GULP_TASKS_ROOT = GULP_TASKS_ROOT;
exports.GULP_TASKS_MARKUP = GULP_TASKS_MARKUP;
exports.MARKUP_MODULES = MARKUP_MODULES;
exports.PROMPTS_VALUES = PROMPTS_VALUES;
