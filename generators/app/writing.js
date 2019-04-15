const path = require('path');
const mkDir = require('mkdirp');

const VALUES = require('./globals');
const { PROMPTS_VALUES } = require('./globals');

const additionalPackages = {
  cms: {
    magento: {
      name: 'generator-p2h-magento',
      description: 'Gulp build for magento',
      dependencies: {
        eventie: '^1.0.6',
      },
    },
  },
  frameworks: {
    bootstrap_3_less: {
      name: 'generator-p2h-bootstrap-3-less',
      description: 'Gulp build for bootstrap 3 with LESS source files',
      dependencies: {
        bootstrap: '3.3.7',
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
        'materialize-css': '^1.0.0-rc.2'
      },
    }
  },
};



module.exports = function writeFiles() {
  mkDir(path.join(`${VALUES.MARKUP_SRC}/fonts`));
  mkDir(path.join(`${VALUES.MARKUP_SRC}/images`));

  let copyFiles = files => {
    files.forEach(file => this.fs.copy(this.templatePath(file.from), file.to));
  }

  let generateFiles = settings => {
    let cmsName = '';
    let frameworkName = '';
    let bootstrapVersion = '';
    let bootstrapPreprocessor = '';

    if (this.props.cms_type === PROMPTS_VALUES.project_type.cms_wp) {
      cmsName = `_${this.props.cms_type}`;
    }
    if (!!this.props.frontend_framework) {
      frameworkName = `_${this.props.frontend_framework}`;
    }
    if (!!this.props.bootstrap_version) {
      bootstrapVersion = `_${this.props.bootstrap_version}`;
    }
    if (!!this.props.bootstrap_css_preprocessor) {
      bootstrapPreprocessor = `_${this.props.bootstrap_css_preprocessor}`;
    }

    let folderName = `${this.props.project_type}${cmsName}${frameworkName}${bootstrapVersion}${bootstrapPreprocessor}`;
    let frameworkPackage = `${frameworkName}${bootstrapVersion}${bootstrapPreprocessor}`;

    while(frameworkPackage.charAt(0) === '_') {
     frameworkPackage = frameworkPackage.substr(1);
    }

    if (additionalPackages.frameworks.hasOwnProperty(frameworkPackage)) {
      this.fs.extendJSON(this.destinationPath(`${VALUES.MARKUP}/package.json`), additionalPackages.frameworks[frameworkPackage]);
    }

    copyFiles([
      {
        from: `${VALUES.SRC}/${folderName}`,
        to: `${VALUES.MARKUP}/${VALUES.SRC}`,
      },
      {
        from: `${VALUES.SRC}/${folderName}/html/${this.props.js_bundler}/`,
        to: `${VALUES.MARKUP}/${VALUES.SRC}`,
      },
    ]);
    this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
  }

  copyFiles([
    {
      from: 'README.md',
      to: `${VALUES.MARKUP}/README.md`
    },
    {
      from: '.editorconfig',
      to: `${VALUES.MARKUP}/.editorconfig`
    },
    {
      from: 'htmlhint.config.js',
      to: `${VALUES.MARKUP}/htmlhint.config.js`
    },
    {
      from: 'package.json',
      to: `${VALUES.MARKUP}/package.json`
    },
    {
      from: 'gulpfile.js',
      to: `${VALUES.MARKUP}/gulpfile.js`
    },
    {
      from: `${VALUES.GULP}/config.js`,
      to: `${VALUES.MARKUP}/${VALUES.GULP}/config.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/util/watchDeletedFiles.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/util/watchDeletedFiles.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/util/message--deleted.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/util/message--deleted.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/util/message--error.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/util/message--error.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/ajaxIncludes.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/ajaxIncludes.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/browserSync.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/browserSync.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/clean.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/clean.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/clear.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/clear.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/copy.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/copy.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/default.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/default.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/fonts.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/fonts.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/html.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/html.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/imagemin.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/imagemin.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/video.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/video.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/zip.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/zip.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/eslint.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/eslint.js`
    },
    {
      from: `${VALUES.GULP_TASKS_ROOT}/htmlhint.js`,
      to: `${VALUES.GULP_TASKS_MARKUP}/htmlhint.js`
    },
    {
      from: VALUES.SRC_JS,
      to: `${VALUES.MARKUP}/${VALUES.SRC_JS}`
    },
  ]);

  switch (this.props.cms_type) {
    case PROMPTS_VALUES.cms_type.cms_wp:
      copyFiles([
        {
          from: `${VALUES.GULP_TASKS_ROOT}/util/paths/paths_wp.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`,
        },
      ]);
      if (this.props.bootstrap_css_preprocessor !== PROMPTS_VALUES.bootstrap_css_preprocessor.less) {
        copyFiles([
          {
            from: `${VALUES.SRC_GENERAL_FILES}/scss/cms_specific/_wp-reset.scss`,
            to: `${VALUES.MARKUP_SRC}/scss/base/_wp-reset.scss`,
          },
          {
            from: `${VALUES.SRC_GENERAL_FILES}/scss/cms_specific/_cms-reset.scss`,
            to: `${VALUES.MARKUP_SRC}/scss/base/_cms-reset.scss`,
          },
        ]);
      }

      if (this.props.js_bundler === PROMPTS_VALUES.js_bundler.webpack) {
        copyFiles([
          {
            from: VALUES.SRC_JS_PUBLIC_PATH,
            to: `${VALUES.MARKUP}/${VALUES.SRC_JS}`,
          },
        ]);
      }
      break;
    case PROMPTS_VALUES.cms_type.cms_other:
      if (this.props.bootstrap_css_preprocessor != PROMPTS_VALUES.bootstrap_css_preprocessor.less) {
        copyFiles([
          {
            from: `${VALUES.SRC_GENERAL_FILES}/scss/cms_specific/_cms-reset.scss`,
            to: `${VALUES.MARKUP_SRC}/scss/base/_cms-reset.scss`,
          },
          {
            from: `${VALUES.GULP_TASKS_ROOT}/util/paths/paths_markup_only.js`,
            to: `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`,
          },
        ]);
      }
      break;
    case PROMPTS_VALUES.cms_type.cms_magento:
      copyFiles([
        {
          from: 'sass-lint.magento.yml',
          to: `${VALUES.MARKUP}/sass-lint.yml`,
        },
        {
          from: `${VALUES.GULP_TASKS_ROOT}/util/paths/paths_markup_only.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`,
        },
      ]);
      this.fs.extendJSON(this.destinationPath(`${VALUES.MARKUP}/package.json`), additionalPackages.cms.magento);
      break;
    default:
      copyFiles([
        {
          from: `${VALUES.GULP_TASKS_ROOT}/util/paths/paths_markup_only.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`,
        },
      ]);
      break;
  }

  switch (this.props.js_bundler) {
    case PROMPTS_VALUES.js_bundler.no_webpack:
      this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC_JS}`);
      copyFiles([
        {
          from: `${VALUES.GULP_TASKS_ROOT}/watch_no_webpack.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/watch.js`,
        },
        {
          from: `${VALUES.GULP_TASKS_ROOT}/build_no_webpack.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/build.js`,
        },
        {
          from: `${VALUES.GULP_TASKS_ROOT}/js.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/js.js`,
        },
        {
          from: VALUES.SRC_JS_NO_WEBPACK,
          to: `${VALUES.MARKUP}/${VALUES.SRC_JS}`,
        },
      ]);
      break;
    default:
      copyFiles([
        {
          from: `${VALUES.GULP_TASKS_ROOT}/build.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/build.js`,
        },
        {
          from: `${VALUES.GULP_TASKS_ROOT}/watch.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/watch.js`,
        },
        {
          from: `${VALUES.GULP_TASKS_ROOT}/webpack.js`,
          to: `${VALUES.GULP_TASKS_MARKUP}/webpack.js`,
        },
        {
          from: 'babel.config.js',
          to: `${VALUES.MARKUP}/babel.config.js`,
        },
        {
          from: 'eslintrc.js',
          to: `${VALUES.MARKUP}/eslintrc.js`,
        },
        {
          from: 'prettier.config.js',
          to: `${VALUES.MARKUP}/prettier.config.js`,
        },
        {
          from: 'webpack.config.js',
          to: `${VALUES.MARKUP}/webpack.config.js`,
        },
      ]);
      break;
  }

  if (this.props.bootstrap_css_preprocessor === PROMPTS_VALUES.bootstrap_css_preprocessor.less) {
    copyFiles([
      {
        from: `${VALUES.GULP_TASKS_ROOT}/less.js`,
        to: `${VALUES.GULP_TASKS_MARKUP}/less.js`,
      },
    ]);
    switch (this.props.js_bundler) {
      case PROMPTS_VALUES.js_bundler.no_webpack:
        copyFiles([
          {
            from: `${VALUES.GULP_TASKS_ROOT}/build_less_no_webpack.js`,
            to: `${VALUES.GULP_TASKS_MARKUP}/build.js`,
          },
          {
            from: `${VALUES.GULP_TASKS_ROOT}/watch_less_no_webpack.js`,
            to: `${VALUES.GULP_TASKS_MARKUP}/watch.js`,
          },
        ]);
        break;
      default:
        copyFiles([
          {
            from: `${VALUES.GULP_TASKS_ROOT}/build_less.js`,
            to: `${VALUES.GULP_TASKS_MARKUP}/build.js`,
          },
          {
            from: `${VALUES.GULP_TASKS_ROOT}/watch_less.js`,
            to: `${VALUES.GULP_TASKS_MARKUP}/watch.js`,
          },
        ]);
        break;
    }
  } else {
    copyFiles([
      {
        from: 'sass-lint.yml',
        to: `${VALUES.MARKUP}/sass-lint.yml`,
      },
      {
        from: `${VALUES.GULP_TASKS_ROOT}/sass-lint.js`,
        to: `${VALUES.GULP_TASKS_MARKUP}/sass-lint.js`,
      },
      {
        from: `${VALUES.GULP_TASKS_ROOT}/linters.js`,
        to: `${VALUES.GULP_TASKS_MARKUP}/linters.js`,
      },
      {
        from: `${VALUES.GULP_TASKS_ROOT}/sass.js`,
        to: `${VALUES.GULP_TASKS_MARKUP}/sass.js`,
      },
      {
        from: `${VALUES.SRC_GENERAL_FILES}/scss/base/_functions.scss`,
        to: `${VALUES.MARKUP_SRC}/scss/base/_functions.scss`,
      },
      {
        from: `${VALUES.SRC_GENERAL_FILES}/scss/base/_helpers.scss`,
        to: `${VALUES.MARKUP_SRC}/scss/base/_helpers.scss`,
      },
      {
        from: `${VALUES.SRC_GENERAL_FILES}/scss/base/_mixins.scss`,
        to: `${VALUES.MARKUP_SRC}/scss/base/_mixins.scss`,
      },
    ]);
  }

  if (this.props.cms_type !== PROMPTS_VALUES.cms_type.cms_magento) {
    if (this.props.frontend_framework === PROMPTS_VALUES.frontend_framework.none) {
      copyFiles([
        {
          from: `${VALUES.SRC_GENERAL_FILES}/scss/common_files/*`,
          to: `${VALUES.MARKUP_SRC}/scss/base`,
        },
      ]);
    }
  }

  generateFiles();
};
