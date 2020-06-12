const merge = require('lodash.merge');
const {PROMPTS_VALUES, PACKAGES, PATHS, CONFIG_REWRITES} = require('./globals');
const projectConfig = 'markup/config.json';
const projectPackages = 'markup/package.json';
const pkg = require('../../package.json');

module.exports = async function writeFiles() {
  const copyFiles = (paths) => {
    this.fs.copy(this.templatePath(paths[0]), this.destinationPath(paths[1]), {
      globOptions: {
        dot: true,
      },
    });
  };

  const modifyConfig = (settings, config = projectConfig) => {
    this.fs.extendJSON(this.destinationPath(config), settings);
  };

  const setLinters = () => {
    if (this.props.linters && typeof this.props.linters === 'object') {
      const lintCSS = this.props.linters.includes(PROMPTS_VALUES.linters.css);
      const lintJS = this.props.linters.includes(PROMPTS_VALUES.linters.js);
      const lintersSettings = {
        linters: {
          css: lintCSS,
          js: lintJS,
        },
      };

      copyFiles(['linters/general', PATHS.destination]);
      modifyConfig(lintersSettings);

      if (lintCSS) {
        const cssLinterPackages = merge(PACKAGES.linters.general, PACKAGES.linters.css);
        copyFiles(['linters/css', PATHS.destination]);
        modifyConfig(cssLinterPackages, projectPackages);
      }

      if (lintJS) {
        const jsLinterPackages = merge(PACKAGES.linters.general, PACKAGES.linters.js);
        copyFiles(['linters/js', PATHS.destination]);
        modifyConfig(jsLinterPackages, projectPackages);
      }
    } else {
      const noLinters = {
        linters: false,
      };

      modifyConfig(noLinters);
    }
  };

  const setProjectTypeBasedSettings = () => {
    if (this.props.cms === PROMPTS_VALUES.cms.wp) {
      modifyConfig(CONFIG_REWRITES.wp);
    }
  };

  const setFrontendFrameworks = () => {
    switch (this.props.framework) {
      case PROMPTS_VALUES.framework.bootstrap:
        modifyConfig(PACKAGES.frameworks.bootstrap, projectPackages);
        copyFiles(['bootstrap', PATHS.destination]);
        break;
      case PROMPTS_VALUES.framework.zurb:
        modifyConfig(PACKAGES.frameworks.zurb, projectPackages);
        copyFiles(['zurb', PATHS.destination]);
        break;
      case PROMPTS_VALUES.framework.materialize:
        modifyConfig(PACKAGES.frameworks.materialize, projectPackages);
        copyFiles(['materialize', PATHS.destination]);
        break;
      case PROMPTS_VALUES.framework.tailwind:
        modifyConfig(PACKAGES.frameworks.tailwind, projectPackages);
        copyFiles(['tailwind', PATHS.destination]);
        break;
      default:
        return;
    }
  };

  const setTemplateEngine = () => {
    switch (this.props.templating) {
      case PROMPTS_VALUES.templating.pug:
        modifyConfig(PACKAGES.templating.pug, projectPackages);
        modifyConfig(CONFIG_REWRITES.pug);
        copyFiles(['pug', PATHS.destination]);
        break;

      case PROMPTS_VALUES.templating.twig:
        modifyConfig(PACKAGES.templating.twig, projectPackages);
        modifyConfig(CONFIG_REWRITES.twig);
        copyFiles(['twig', PATHS.destination]);
        break;
      default:
        copyFiles(['html', PATHS.destination]);
        break;
    }
  };

  const copyRoutesTemplate = () => {
    copyFiles(['__routes', PATHS.destination]);
  };

  const setVersion = () => {
    const v = {
      version: pkg.version,
    };

    modifyConfig(v, projectPackages);
  };

  await Promise.all([
    copyFiles(['base', PATHS.destination]),
    setLinters(),
    setProjectTypeBasedSettings(),
    setFrontendFrameworks(),
    setTemplateEngine(),
    copyRoutesTemplate(),
    setVersion(pkg.version),
  ]);
};
