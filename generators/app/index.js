const Generator = require('yeoman-generator');
const updateNotifier = require('update-notifier');
const chalk = require('chalk');
const yosay = require('yosay');
const fsNode = require('fs');

const pkg = require('../../package.json');
const PROMPTS = require('./prompts');
const WRITING = require('./writing');
const VALUES = require('./globals');
// const {PROMPTS_VALUES} = require('./globals');
// const notifier = updateNotifier({pkg, updateCheckInterval: 1000 * 60 * 60 * 24});

let yosayPrompts = props => {
  if (props) {
    return `Update available:
       ${chalk.red(props.current)} → ${chalk.green(props.latest)}.
       Run ${chalk.blue(`npm i -g generator-p2h`)} to update`;
  }
  return `2005-${new Date().getFullYear()} All rights Reserved. P2H, Inc.`;
};

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  async prompting() {
    // Have Yeoman greet the user.

    // if (notifier.update) {
    //   this.log(
    //     yosay(
    //       yosayPrompts({
    //         current: notifier.update.current,
    //         latest: notifier.update.latest,
    //       })
    //     )
    //   );
    // } else {
    // }
    this.log(yosay(yosayPrompts()));


    this.props = await this.prompt(PROMPTS);

    console.log(this.props);
  }

  // configuring() {
  // }

  // default() {}

  writing() {
    WRITING.call(this);
  }

  // conflicts() {}

  install() {
    // if (this.checkModulesFolder()) return;

    // process.chdir(`${process.cwd()}/${VALUES.MARKUP}`);

    // this.installDependencies({
    //   bower: false,
    //   npm: true,
    // });
  }

  checkModulesFolder() {
    // return fsNode.existsSync(this.destinationPath(VALUES.MARKUP_MODULES));
  }

  end() {
    this.log(chalk.green(`🙌 🙌 🙌 Installation done! Install modules and run command ${chalk.red('gulp')} from markup folder 🙌 🙌 🙌`));
    // if (this.props.frontend_framework !== PROMPTS_VALUES.frontend_framework.none) {
    //   frameworkCopy(this);
    // }
  }
};
