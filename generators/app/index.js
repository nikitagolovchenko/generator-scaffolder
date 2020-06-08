const fs = require('fs');
const chalk = require('chalk');
const yosay = require('yosay');
const Generator = require('yeoman-generator');
const updateNotifier = require('update-notifier');
const PROMPTS = require('./prompts');
const WRITING = require('./writing');
const pkg = require('../../package.json');
const {PROMPTS_VALUES} = require('./globals');
const addWPHeader = require('./extends/wordpressHeader');
const notifier = updateNotifier({pkg, updateCheckInterval: 1000 * 60 * 60 * 24});

const yosayPrompts = (props) => {
  if (props) {
    return `Update available:
       ${chalk.red(props.current)} → ${chalk.green(props.latest)}.
       Run ${chalk.blue(`npm i -g generator-p2h`)} to update`;
  }
  return `
    generator-p2h: v${pkg.version}.
    2005-${new Date().getFullYear()} All rights Reserved. P2H, Inc
  `;
};

class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('babel');
  }

  async prompting() {
    if (notifier.update) {
      this.log(yosay(yosayPrompts({
        current: notifier.update.current,
        latest: notifier.update.latest,
      })));
    } else {
      this.log(yosay(yosayPrompts()));
    }

    this.props = await this.prompt(PROMPTS);
  }

  writing() {
    WRITING.call(this);
  }

  install() {
    if (this.props.cms === PROMPTS_VALUES.cms.wp) {
      addWPHeader({
        instance: this,
      });
    }
  }

  end() {
    this.log(
      chalk.green(`
  🙌 Installation done! 🙌
  🛶 Go to markup folder: ${chalk.red('cd markup')}
  📦 Dont forget to install node modules: ${chalk.red('npm install')} OR ${chalk.red('yarn')}
  💻 For ${chalk.yellow('development mode')} run command ${chalk.red('npm run dev')} OR ${chalk.red('yarn dev')} 👊.
  ℹ️  For more info, read ${chalk.yellow('README.md')}
    `)
    );
  }
};

module.exports = WebpackGenerator;
