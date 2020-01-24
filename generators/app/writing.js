const fs = require('fs');
const path = require('path');
const merge = require('lodash.merge');
const {PROMPTS_VALUES, packages} = require('./globals');
const config = require('./templates/base/config.json');

const projectConfig = 'markup/config.json';
const pkg = 'markup/package.json';

module.exports = async function writeFiles() {
  const copyFiles = paths => {
    paths.forEach(files => {
      this.fs.copy(this.templatePath(files[0]), this.destinationPath(files[1]), {
        globOptions: {
          dot: true,
        },
      });
    })
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

      copyFiles([['linters/general', 'markup']]);
      modifyConfig(lintersSettings)

      if (lintCSS) {
        const cssLinterPackages = merge(packages.linters.general, packages.linters.css);
        copyFiles([['linters/css', 'markup']]);
        modifyConfig(cssLinterPackages, pkg);
      }

      if (lintJS) {
        const jsLinterPackages = merge(packages.linters.general, packages.linters.js);
        copyFiles([['linters/js', 'markup']]);
        modifyConfig(jsLinterPackages, pkg);
      }

      // console.log(2);
    }
  };

  const setProjectTypeBasedSettings = () => {
    const WPStyles = {
      styles: {
        bundle: 'style',
        dest: '/',
      }
    }

    if (this.props.cms === PROMPTS_VALUES.cms.wp) {
      modifyConfig(WPStyles);

      // fs.renameSync(this.destinationPath(`${config.styles.src}/${config.styles.bundle}.${config.styles.extension}`), this.destinationPath(`${config.styles.src}/${WPStyles.styles.bundle}.${config.styles.extension}`));

      // console.log(fs.readFile(this.destinationPath(projectConfig), (a) => {
      //   console.log(a);
      // }));

      // this.fs.rename(this.destinationPath(config.))
    }

    // console.log(3);
  }

  await Promise.all([
    copyFiles([['base', 'markup']]),
    setLinters(),
    setProjectTypeBasedSettings(),
  ])

  console.log(4);

};
