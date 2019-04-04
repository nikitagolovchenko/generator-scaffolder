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
    bootstrap: {
      v3: {
        less: {
          name: 'generator-p2h-bootstrap-3-less',
          description: 'Gulp build for bootstrap 3 with LESS source files',
          dependencies: {
            bootstrap: '3.3.7',
          },
        },
        scss: {
          name: 'generator-p2h-bootstrap-3-scss',
          description: 'Gulp build for bootstrap 3 with SCSS source files',
          dependencies: {
            'bootstrap-sass': '3.3.7',
          },
        },
      },
      v4: {
        name: 'generator-p2h-bootstrap4',
        description: 'Gulp build for bootstrap 4',
        dependencies: {
          bootstrap: '^4.1.3',
          'popper.js': '^1.14.1',
        },
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
  },
};

module.exports = function writeFiles() {
  mkDir(path.join(`${VALUES.MARKUP_SRC}/fonts`));
  mkDir(path.join(`${VALUES.MARKUP_SRC}/images`));
  mkDir(path.join(`${VALUES.MARKUP_SRC}/scss/base`));

  this.fs.copy(this.templatePath('README.md'), `${VALUES.MARKUP}/README.md`);
  this.fs.copy(
    this.templatePath('.editorconfig'),
    `${VALUES.MARKUP}/.editorconfig`
  );
  this.fs.copy(
    this.templatePath('htmlhint.config.js'),
    `${VALUES.MARKUP}/htmlhint.config.js`
  );
  this.fs.copy(
    this.templatePath('sass-lint.yml'),
    `${VALUES.MARKUP}/sass-lint.yml`
  );
  this.fs.copy(
    this.templatePath('package.json'),
    `${VALUES.MARKUP}/package.json`
  );

  // Gulp files
  this.fs.copy(
    this.templatePath('gulpfile.js'),
    `${VALUES.MARKUP}/gulpfile.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP}/config.js`),
    `${VALUES.MARKUP}/${VALUES.GULP}/config.js`
  );

  // Gulp tasks
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/watchDeletedFiles.js`),
    `${VALUES.GULP_TASKS_MARKUP}/util/watchDeletedFiles.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/message--deleted.js`),
    `${VALUES.GULP_TASKS_MARKUP}/util/message--deleted.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/message--error.js`),
    `${VALUES.GULP_TASKS_MARKUP}/util/message--error.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/ajaxIncludes.js`),
    `${VALUES.GULP_TASKS_MARKUP}/ajaxIncludes.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/browserSync.js`),
    `${VALUES.GULP_TASKS_MARKUP}/browserSync.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/clean.js`),
    `${VALUES.GULP_TASKS_MARKUP}/clean.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/clear.js`),
    `${VALUES.GULP_TASKS_MARKUP}/clear.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/copy.js`),
    `${VALUES.GULP_TASKS_MARKUP}/copy.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/default.js`),
    `${VALUES.GULP_TASKS_MARKUP}/default.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/fonts.js`),
    `${VALUES.GULP_TASKS_MARKUP}/fonts.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/html.js`),
    `${VALUES.GULP_TASKS_MARKUP}/html.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/imagemin.js`),
    `${VALUES.GULP_TASKS_MARKUP}/imagemin.js`
  );
  
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/video.js`),
    `${VALUES.GULP_TASKS_MARKUP}/video.js`
  );

  // linters
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/eslint.js`),
    `${VALUES.GULP_TASKS_MARKUP}/eslint.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/htmlhint.js`),
    `${VALUES.GULP_TASKS_MARKUP}/htmlhint.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/sass-lint.js`),
    `${VALUES.GULP_TASKS_MARKUP}/sass-lint.js`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.GULP_TASKS_ROOT}/linters.js`),
    `${VALUES.GULP_TASKS_MARKUP}/linters.js`
  );

  this.fs.copy(
    this.templatePath(`${VALUES.SRC_GENERAL_FILES}/scss/base/_functions.scss`),
    `${VALUES.MARKUP_SRC}/scss/base/_functions.scss`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.SRC_GENERAL_FILES}/scss/base/_helpers.scss`),
    `${VALUES.MARKUP_SRC}/scss/base/_helpers.scss`
  );
  this.fs.copy(
    this.templatePath(`${VALUES.SRC_GENERAL_FILES}/scss/base/_mixins.scss`),
    `${VALUES.MARKUP_SRC}/scss/base/_mixins.scss`
  );

  this.fs.copy(this.templatePath(VALUES.SRC_JS), `${VALUES.MARKUP}/${VALUES.SRC_JS}`);

  switch (this.props.project_type) {
    case PROMPTS_VALUES.project_type.markup_cms:
      switch (this.props.cms_type) {
        case PROMPTS_VALUES.cms_type.cms_wp:
          switch (this.props.js_bundler) {
            case PROMPTS_VALUES.js_bundler.no_webpack:
              this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp`), `${VALUES.MARKUP}/${VALUES.SRC}`);
              this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp/html/no_webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
              this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
              break;
            default:
              this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp`), `${VALUES.MARKUP}/${VALUES.SRC}`);
              this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp/html/webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
              this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
              break;
          }
          break;
        case PROMPTS_VALUES.cms_type.cms_magento:
          this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_magento`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          break;
        default:
          switch (this.props.js_bundler) {
            case PROMPTS_VALUES.js_bundler.no_webpack:
              this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_other_cms`), `${VALUES.MARKUP}/${VALUES.SRC}`);
              this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_other_cms/html/no_webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
              this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
              break;
            default:
              this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_other_cms`), `${VALUES.MARKUP}/${VALUES.SRC}`);
              this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_other_cms/html/webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
              this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
              break;
          }
          // this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_other_cms`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          break;
      }
      break;
    case PROMPTS_VALUES.project_type.markup_banner:
      break;
    case PROMPTS_VALUES.project_type.markup_only:
      switch (this.props.js_bundler) {
        case PROMPTS_VALUES.js_bundler.no_webpack:
          this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_only`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_only/html/no_webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
          break;
        default:
          this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_only`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_only/html/webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
          this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
          break;
      }
      break;
    default:
      break;
  }

  switch (this.props.frontend_framework) {
    case PROMPTS_VALUES.frontend_framework.bootstrap:
      switch (this.props.bootstrap_version) {
        case PROMPTS_VALUES.bootstrap_version.bootstrap_4:
          this.fs.extendJSON(
            this.destinationPath(`${VALUES.MARKUP}/package.json`),
            additionalPackages.frameworks.bootstrap.v4
          );

          switch (this.props.js_bundler) {
            case PROMPTS_VALUES.js_bundler.no_webpack:
              switch (this.props.cms_type) {
                case PROMPTS_VALUES.cms_type.cms_wp:
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_4`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_4/html/no_webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
                  break;
                default:
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_4`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_4/html/no_webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
                  break;
              }
              break;
            case PROMPTS_VALUES.js_bundler.webpack:
              switch (this.props.cms_type) {
                case PROMPTS_VALUES.cms_type.cms_wp:
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_4`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_4/html/webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
                  break;
                default:
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_4`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_4/html/webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
                  break;
              }
              break;
            default:
              break;
          }
          break;
        case PROMPTS_VALUES.bootstrap_version.bootstrap_3:
          switch (this.props.js_bundler) {
            case PROMPTS_VALUES.js_bundler.no_webpack:
              switch (this.props.cms_type) {
                case PROMPTS_VALUES.cms_type.cms_wp:
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_3/sources/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_3/sources/html/no_webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
                  break;
                default:
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_3/sources/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_3/sources/html/no_webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
                  break;
              }
              break;
            case PROMPTS_VALUES.js_bundler.webpack:
              switch (this.props.cms_type) {
                case PROMPTS_VALUES.cms_type.cms_wp:
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_3/sources`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_wp_bootstrap_3/sources/html/webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
                  break;
                default:
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_3/sources`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.copy(this.templatePath(`${VALUES.SRC}/markup_bootstrap_3/sources/html/webpack/`), `${VALUES.MARKUP}/${VALUES.SRC}`);
                  this.fs.delete(`${VALUES.MARKUP}/${VALUES.SRC}/html`);
                  break;
              }
              break;
            default:
              break;
          }
          switch (this.props.bootstrap_css_preprocessor) {
            case PROMPTS_VALUES.bootstrap_css_preprocessor.less:
              this.fs.extendJSON(
                this.destinationPath(`${VALUES.MARKUP}/package.json`),
                additionalPackages.frameworks.bootstrap.v3.less
              );
              this.fs.copy(this.templatePath( `${VALUES.SRC}/markup_wp_bootstrap_3/js_less`), `${VALUES.MARKUP}/${VALUES.SRC}/js`);
              switch (this.props.cms_type) {
                case PROMPTS_VALUES.cms_type.cms_wp:
                  this.fs.copy(this.templatePath( `${VALUES.SRC}/markup_wp_bootstrap_3/preprocessors/less`), `${VALUES.MARKUP}/${VALUES.SRC}/less`);
                  break;
                default:
                  this.fs.copy(this.templatePath( `${VALUES.SRC}/markup_bootstrap_3/preprocessors/less`), `${VALUES.MARKUP}/${VALUES.SRC}/less`);
                  break;
              }
              break;
            case PROMPTS_VALUES.bootstrap_css_preprocessor.scss:
              this.fs.extendJSON(
                this.destinationPath(`${VALUES.MARKUP}/package.json`),
                additionalPackages.frameworks.bootstrap.v3.scss
              );
              this.fs.copy(this.templatePath( `${VALUES.SRC}/markup_wp_bootstrap_3/js_scss`), `${VALUES.MARKUP}/${VALUES.SRC}/js`);
              switch (this.props.cms_type) {
                case PROMPTS_VALUES.cms_type.cms_wp:
                  this.fs.copy(this.templatePath( `${VALUES.SRC}/markup_wp_bootstrap_3/preprocessors/scss`), `${VALUES.MARKUP}/${VALUES.SRC}/scss`);
                  break;
                default:
                  this.fs.copy(this.templatePath( `${VALUES.SRC}/markup_bootstrap_3/preprocessors/scss`), `${VALUES.MARKUP}/${VALUES.SRC}/scss`);
                  break;
              }
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      break;
    case PROMPTS_VALUES.frontend_framework.zurb:
      this.fs.copy(
        this.templatePath('webpack.config.foundation.js'),
        `${VALUES.MARKUP}/webpack.config.js`
      );
      this.fs.extendJSON(
        this.destinationPath(`${VALUES.MARKUP}/package.json`),
        additionalPackages.frameworks.zurb
      );
      if (this.props.cms_type === PROMPTS_VALUES.cms_type.cms_wp) {
        this.fs.copy(
          this.templatePath(`${VALUES.SRC}/markup_wp_zurb/`),
          `${VALUES.MARKUP}/${VALUES.SRC}`
        );
      } else {
        this.fs.copy(
          this.templatePath(`${VALUES.SRC}/markup_zurb/`),
          `${VALUES.MARKUP}/${VALUES.SRC}`
        );
      }


      break;
    case PROMPTS_VALUES.frontend_framework.materialize:
      break;
    default:
      break;
  }

  switch (this.props.cms_type) {
    case PROMPTS_VALUES.cms_type.cms_wp:
      this.fs.copy(
        this.templatePath(`${VALUES.GULP_TASKS_ROOT}/util/paths/paths_wp.js`),
        `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`
      );
      
      this.fs.copy(
        this.templatePath(
          `${VALUES.SRC_GENERAL_FILES}/scss/cms_specific/_wp-reset.scss`
        ),
        `${VALUES.MARKUP_SRC}/scss/base/_wp-reset.scss`
      );
      this.fs.copy(
        this.templatePath(
          `${VALUES.SRC_GENERAL_FILES}/scss/cms_specific/_cms-reset.scss`
        ),
        `${VALUES.MARKUP_SRC}/scss/base/_cms-reset.scss`
      );

      if (this.props.js_bundler === PROMPTS_VALUES.js_bundler.webpack) {
        this.fs.copy(
          this.templatePath(VALUES.SRC_JS_PUBLIC_PATH),
          `${VALUES.MARKUP}/${VALUES.SRC_JS}`
        );
      }
      break;
    case PROMPTS_VALUES.cms_type.cms_other:
      this.fs.copy(
        this.templatePath(
          `${VALUES.SRC_GENERAL_FILES}/scss/cms_specific/_cms-reset.scss`
        ),
        `${VALUES.MARKUP_SRC}/scss/base/_cms-reset.scss`
      );
      break;
    case PROMPTS_VALUES.cms_type.cms_magento:
      this.fs.copy(this.templatePath('sass-lint.magento.yml'), `${VALUES.MARKUP}/sass-lint.yml`);
      this.fs.extendJSON(this.destinationPath(`${VALUES.MARKUP}/package.json`), additionalPackages.cms.magento);
      break;
    default:
      this.fs.copy(
        this.templatePath(
          `${VALUES.GULP_TASKS_ROOT}/util/paths/paths_markup_only.js`
        ),
        `${VALUES.GULP_TASKS_MARKUP}/util/paths.js`
      );
      break;
  }

  switch (this.props.js_bundler) {
    case PROMPTS_VALUES.js_bundler.no_webpack:
      this.fs.copy(
        this.templatePath(`${VALUES.GULP_TASKS_ROOT}/watch_no_webpack.js`),
        `${VALUES.GULP_TASKS_MARKUP}/watch.js`
      );
      this.fs.copy(
        this.templatePath(`${VALUES.GULP_TASKS_ROOT}/build_no_webpack.js`),
        `${VALUES.GULP_TASKS_MARKUP}/build.js`
      );
      this.fs.copy(
        this.templatePath(`${VALUES.GULP_TASKS_ROOT}/js.js`),
        `${VALUES.GULP_TASKS_MARKUP}/js.js`
      );
      this.fs.copy(
        this.templatePath(VALUES.SRC_JS_DEFAULT),
        `${VALUES.MARKUP}/${VALUES.SRC_JS}`
      );
      break;
    default:
      this.fs.copy(
        this.templatePath(`${VALUES.GULP_TASKS_ROOT}/build.js`),
        `${VALUES.GULP_TASKS_MARKUP}/build.js`
      );
      this.fs.copy(
        this.templatePath(`${VALUES.GULP_TASKS_ROOT}/watch.js`),
        `${VALUES.GULP_TASKS_MARKUP}/watch.js`
      );
      this.fs.copy(
        this.templatePath(`${VALUES.GULP_TASKS_ROOT}/webpack.js`),
        `${VALUES.GULP_TASKS_MARKUP}/webpack.js`
      );
      this.fs.copy(
        this.templatePath('babel.config.js'),
        `${VALUES.MARKUP}/babel.config.js`
      );
      this.fs.copy(
        this.templatePath('eslintrc.js'),
        `${VALUES.MARKUP}/eslintrc.js`
      );
      this.fs.copy(
        this.templatePath('prettier.config.js'),
        `${VALUES.MARKUP}/prettier.config.js`
      );
      this.fs.copy(
        this.templatePath('webpack.config.js'),
        `${VALUES.MARKUP}/webpack.config.js`
      );
      break;
  }


  if (this.props.cms_type !== PROMPTS_VALUES.cms_type.cms_magento) {
    if (this.props.frontend_framework === PROMPTS_VALUES.frontend_framework.none) {
      this.fs.copy(this.templatePath(`${VALUES.SRC_GENERAL_FILES}/scss/common_files/*`), `${VALUES.MARKUP_SRC}/scss/base`);
    }
  }
};
