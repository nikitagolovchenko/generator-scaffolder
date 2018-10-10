const path = require('path');
const mkDir = require('mkdirp');

const VALUES = require('./globals');
const { PROMPTS_VALUES } = require('./globals');

const additionalPackages = {
  frameworks: {
    bootstrap: {
      v3: {
        less: {
          name: 'generator-p2h-bootstrap-3-less',
          description: 'Gulp build for bootstrap 3 with LESS source files',
          dependencies: {
            bootstrap: '3.3.7'
          }
        },
        scss: {
          name: 'generator-p2h-bootstrap-3-scss',
          description: 'Gulp build for bootstrap 3 with SCSS source files',
          dependencies: {
            'bootstrap-sass': '3.3.7'
          }
        }
      },
      v4: {
        name: 'generator-p2h-bootstrap4',
        description: 'Gulp build for bootstrap 4',
        dependencies: {
          bootstrap: '^4.1.3',
          'popper.js': '^1.14.1'
        }
      }
    },
    zurb: {
      name: 'generator-p2h-zurb-foundation',
      description: 'Gulp build for Zurb Foundation',
      dependencies: {
        'foundation-sites': '^6.5.0-rc.3',
        'what-input': '^5.1.2'
      }
    }
  }
};

module.exports = function writeFiles() {
  mkDir(path.join(`${VALUES.MARKUP}/src/fonts`));
  mkDir(path.join(`${VALUES.MARKUP}/src/images`));

  this.fs.copy(this.templatePath('.gitignore'), `${VALUES.MARKUP}/.gitignore`);
  this.fs.copy(this.templatePath('.editorconfig'), `${VALUES.MARKUP}/.editorconfig`);
  this.fs.copy(this.templatePath('.travis.yml'), `${VALUES.MARKUP}/.travis.yml`);
  this.fs.copy(this.templatePath('.sass-lint.yml'), `${VALUES.MARKUP}/.sass-lint.yml`);
  this.fs.copy(this.templatePath('package.json'), `${VALUES.MARKUP}/package.json`);

  // Gulp files
  this.fs.copy(this.templatePath('gulpfile.js'), `${VALUES.MARKUP}/gulpfile.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP}/config.js`), `${VALUES.MARKUP}/${VALUES.GULP}/config.js`);

  // Gulp tasks
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/watchDeletedFiles.js`), `${VALUES.GULP_TASKS_MARKUP}/util/watchDeletedFiles.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/message--deleted.js`), `${VALUES.GULP_TASKS_MARKUP}/util/message--deleted.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/message--error.js`), `${VALUES.GULP_TASKS_MARKUP}/util/message--error.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/ajaxIncludes.js`), `${VALUES.GULP_TASKS_MARKUP}/ajaxIncludes.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/browserSync.js`), `${VALUES.GULP_TASKS_MARKUP}/browserSync.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/imagemin.js`), `${VALUES.GULP_TASKS_MARKUP}/imagemin.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/default.js`), `${VALUES.GULP_TASKS_MARKUP}/default.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/clean.js`), `${VALUES.GULP_TASKS_MARKUP}/clean.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/clear.js`), `${VALUES.GULP_TASKS_MARKUP}/clear.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/copy.js`), `${VALUES.GULP_TASKS_MARKUP}/copy.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/fonts.js`), `${VALUES.GULP_TASKS_MARKUP}/fonts.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/html.js`), `${VALUES.GULP_TASKS_MARKUP}/html.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/sass.js`), `${VALUES.GULP_TASKS_MARKUP}/sass.js`);
  this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/video.js`), `${VALUES.GULP_TASKS_MARKUP}/video.js`);

  if (this.props.cms_type === PROMPTS_VALUES.cms_type.cms_magento) {
    this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/watch_no_webpack.js`), `${VALUES.GULP_TASKS_MARKUP}/watch.js`);
    this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/build_no_webpack.js`), `${VALUES.GULP_TASKS_MARKUP}/build.js`);
    this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/js.js`), `${VALUES.GULP_TASKS_MARKUP}/js.js`);
  } else {
    this.fs.copy(this.templatePath(VALUES.SRC_IMAGES), `${VALUES.MARKUP}/${VALUES.SRC_IMAGES}`);
    this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/build.js`), `${VALUES.GULP_TASKS_MARKUP}/build.js`);
    this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/watch.js`), `${VALUES.GULP_TASKS_MARKUP}/watch.js`);
    this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/webpack.js`), `${VALUES.GULP_TASKS_MARKUP}/webpack.js`);
    this.fs.copy(this.templatePath('.babelrc'), `${VALUES.MARKUP}/.babelrc`);
    this.fs.copy(this.templatePath('.eslintrc'), `${VALUES.MARKUP}/.eslintrc`);
    this.fs.copy(this.templatePath('.prettierrc'), `${VALUES.MARKUP}/.prettierrc`);
    this.fs.copy(this.templatePath('webpack.config.js'), `${VALUES.MARKUP}/webpack.config.js`);
  }

  this.fs.copy(this.templatePath(`${VALUES.SRC}/fonts`), `${VALUES.MARKUP_SRC}/fonts`);

  if (this.props.frontend_framework === PROMPTS_VALUES.frontend_framework.none) {
    if (this.props.cms_type !== PROMPTS_VALUES.cms_type.cms_magento) {
      this.fs.copy(this.templatePath(VALUES.SRC_JS), `${VALUES.MARKUP}/${VALUES.SRC_JS}`);
      this.fs.copy(this.templatePath(`${VALUES.SRC_JS}/vendors/vendorTest.js`), `${VALUES.MARKUP}/${VALUES.SRC_JS}/vendors/vendorTest.js`);
    }

    switch (this.props.project_type) {
      case PROMPTS_VALUES.project_type.markup_only:
        this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_only`), `${VALUES.MARKUP}/${VALUES.SRC}`);
        this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/paths/paths_markup_only.js`), `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`);
        break;
      case PROMPTS_VALUES.project_type.markup_cms:
        switch (this.props.cms_type) {
          case PROMPTS_VALUES.cms_type.cms_wp:
            this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp`), `${VALUES.MARKUP}/${VALUES.SRC}`);
            this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/paths/paths_wp.js`), `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`);
            break;
          case PROMPTS_VALUES.cms_type.cms_magento:
            this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_magento`), `${VALUES.MARKUP}/${VALUES.SRC}`);
            this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/paths/paths_markup_only.js`), `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`);
            break;
          case PROMPTS_VALUES.cms_type.cms_other:
            this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_other_cms`), `${VALUES.MARKUP}/${VALUES.SRC}`);
            this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/paths/paths_markup_only.js`), `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`);
            break;
          default:
            break;
        }
        break;
      case PROMPTS_VALUES.project_type.markup_banner:
        break;
      default:
        break;
    }
  }

  switch (this.props.frontend_framework) {
    case PROMPTS_VALUES.frontend_framework.bootstrap:
      /*
      // copying specific PATHS file from where we take global paths for gulp tasks. WP require placement of css files in 
      // the root of the project, while another builds works from CSS folder
      */
      if (this.props.cms_type === PROMPTS_VALUES.cms_type.cms_wp) {
        this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/paths/paths_wp.js`), `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`);
      } else {
        this.fs.copy(this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/paths/paths_markup_only.js`), `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`);
      }

      switch (this.props.bootstrap_version) {
        case PROMPTS_VALUES.bootstrap_version.bootstrap_3:
          if (this.props.cms_type === PROMPTS_VALUES.cms_type.cms_wp) {
            this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_3/sources/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          } else {
            this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_3/sources/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          }
          switch (this.props.bootstrap_css_preprocessor) {
            case PROMPTS_VALUES.bootstrap_css_preprocessor.less:
              this.fs.extendJSON(this.destinationPath(`${VALUES.MARKUP}/package.json`), additionalPackages.frameworks.bootstrap.v3.less);
              if (this.props.cms_type === PROMPTS_VALUES.cms_type.cms_wp) {
                this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_3/preprocessors/less`), `${VALUES.MARKUP}/${VALUES.SRC}/less`);
              } else {
                this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_3/preprocessors/less`), `${VALUES.MARKUP}/${VALUES.SRC}/less`);
              }
              break;
            case PROMPTS_VALUES.bootstrap_css_preprocessor.scss:
              this.fs.extendJSON(this.destinationPath(`${VALUES.MARKUP}/package.json`), additionalPackages.frameworks.bootstrap.v3.scss);
              if (this.props.cms_type === PROMPTS_VALUES.cms_type.cms_wp) {
                this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_3/preprocessors/scss`), `${VALUES.MARKUP}/${VALUES.SRC}/scss`);
              } else {
                this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_3/preprocessors/scss`), `${VALUES.MARKUP}/${VALUES.SRC}/scss`);
              }
              break;
            default:
              break;
          }
          break;
        case PROMPTS_VALUES.bootstrap_version.bootstrap_4:
          this.fs.extendJSON(this.destinationPath(`${VALUES.MARKUP}/package.json`), additionalPackages.frameworks.bootstrap.v4);
          if (this.props.cms_type === PROMPTS_VALUES.cms_type.cms_wp) {
            this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_4`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          } else {
            this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_4`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          }
          break;
        default:
          break;
      }
      break;
    case PROMPTS_VALUES.frontend_framework.zurb:
      this.fs.extendJSON(this.destinationPath(`${VALUES.MARKUP}/package.json`), additionalPackages.frameworks.zurb);
      if (this.props.cms_type === PROMPTS_VALUES.cms_type.cms_wp) {
        this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_zurb/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
      } else {
        this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_zurb/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
      }
      break;
    case PROMPTS_VALUES.frontend_framework.materialize:
      break;
    default:
      break;
  }
};

// Module.exports = files;
