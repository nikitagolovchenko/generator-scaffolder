const fs = require('fs');
const path = require('path');
const merge = require('lodash.merge');
const {PROMPTS_VALUES, PACKAGES, PATHS} = require('./globals');

const projectConfig = 'markup/config.json';
const projectPackages = 'markup/package.json';

module.exports = async function writeFiles() {
  const copyFiles = paths => {
    paths.forEach(files => {
      this.fs.copy(this.templatePath(files[0]), this.destinationPath(files[1]), {
        globOptions: {
          dot: true,
        }
      });
    });

    
  };

  const modifyConfig = (settings, config = projectConfig) => {
    this.fs.extendJSON(this.destinationPath(config), settings);
  }

  const setLinters = () => {
    if (this.props.linters && this.props.linters.length) {
      const lintCSS = this.props.linters.includes(PROMPTS_VALUES.linters.css);
      const lintJS = this.props.linters.includes(PROMPTS_VALUES.linters.js);
      const lintersSettings = {
        linters: {
          css: lintCSS,
          js: lintJS,
        }
      }

      copyFiles([['linters/general', PATHS.destination]]);
      modifyConfig(lintersSettings)

      if (lintCSS) {
        const cssLinterPackages = merge(PACKAGES.linters.general, PACKAGES.linters.css);
        copyFiles([['linters/css', PATHS.destination]]);
        modifyConfig(cssLinterPackages, projectPackages);
      }

      if (lintJS) {
        const jsLinterPackages = merge(PACKAGES.linters.general, PACKAGES.linters.js);
        copyFiles([['linters/js', PATHS.destination]]);
        modifyConfig(jsLinterPackages, projectPackages);
      }
    } else {
      const noLinters = {
        linters: false,
      }

      modifyConfig(noLinters);
    }
  };

  const setProjectTypeBasedSettings = () => {
    const WP = {
      config: {
        styles: {
          bundle: 'style',
          dest: './',
        }
      },
    }

    if (this.props.cms === PROMPTS_VALUES.cms.wp) {
      modifyConfig(WP.config);
    }
  }

  const setFrontendFrameworks = () => {
    switch(this.props.framework) {
      case PROMPTS_VALUES.framework.bootstrap:
        modifyConfig(PACKAGES.frameworks.bootstrap, projectPackages);
        copyFiles([['bootstrap', PATHS.destination]]);
        break;
      case PROMPTS_VALUES.framework.zurb:
        modifyConfig(PACKAGES.frameworks.zurb, projectPackages);
        copyFiles([['zurb', PATHS.destination]]);
        break;
      case PROMPTS_VALUES.framework.materialize:
        modifyConfig(PACKAGES.frameworks.materialize, projectPackages);
        copyFiles([['materialize', PATHS.destination]]);
        break;
      case PROMPTS_VALUES.framework.tailwind:
        modifyConfig(PACKAGES.frameworks.tailwind, projectPackages);
        copyFiles([['tailwind', PATHS.destination]]);
        break;
      default:
        return;
    }
  }


  await Promise.all([
    copyFiles([['base', PATHS.destination]]),
    setLinters(),
    setProjectTypeBasedSettings(),
    setFrontendFrameworks(),
  ])
};
