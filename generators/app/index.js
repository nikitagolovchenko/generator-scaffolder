const Generator = require('yeoman-generator');
const updateNotifier = require('update-notifier');
const chalk = require('chalk');
const yosay = require('yosay');
const fsNode = require('fs');

const pkg = require('../../package.json');
const PROMPTS = require('./prompts');
const WRITING = require('./writing');
const VALUES = require('./globals');
const { PROMPTS_VALUES } = require('./globals');
const notifier = updateNotifier({pkg, updateCheckInterval: 1000 * 60 * 60 * 24});

let yosayPrompts = (props) => {
  if (props) {
    return `Update available:
       ${chalk.red(props.current)} → ${chalk.green(props.latest)}.
       Run ${chalk.blue(`npm i -g generator-p2h`)} to update`
  }
  return `2005-${new Date().getFullYear()} All rights Reserved. P2H, Inc.`
}

function frameworkCopy(self) {
  self.log(
    chalk.green(`Copying ${self.props.frontend_framework} source files`)
  );

  switch (self.props.frontend_framework) {
    case PROMPTS_VALUES.frontend_framework.bootstrap:
      switch (self.props.bootstrap_version) {
        case PROMPTS_VALUES.bootstrap_version.bootstrap_3:
          switch (self.props.bootstrap_css_preprocessor) {
            case PROMPTS_VALUES.bootstrap_css_preprocessor.less:
              self.fs.copy(
                self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap/less`),
                self.destinationPath(
                  `${VALUES.MARKUP_SRC}/less/vendors/bootstrap`
                )
              );
              break;
            case PROMPTS_VALUES.bootstrap_css_preprocessor.scss:
              self.fs.copy(self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap-sass/assets/stylesheets/bootstrap`), self.destinationPath(`${VALUES.MARKUP_SRC}/scss/vendors/bootstrap`));
              break;
            default:
              break;
          }
          break;
        case PROMPTS_VALUES.bootstrap_version.bootstrap_4:
          self.fs.copy(
            self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap/scss`),
            self.destinationPath(`${VALUES.MARKUP_SRC}/scss/vendors/bootstrap`)
          );
          break;
        default:
          break;
      }
      break;
    case PROMPTS_VALUES.frontend_framework.zurb:
      break;
    case PROMPTS_VALUES.frontend_framework.materialize:
      self.fs.copy(
        self.destinationPath(`${VALUES.MARKUP_MODULES}/materialize-css/sass/components`),
        self.destinationPath(`${VALUES.MARKUP_SRC}/scss/vendors/materialize`)
      );
      break;
    default:
      break;
  }
}

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  prompting() {
    // Have Yeoman greet the user.

    if (notifier.update) {
      this.log(yosay(yosayPrompts({
        current: notifier.update.current,
        latest: notifier.update.latest,
      })));
    } else {
      this.log(yosay(yosayPrompts()));
    }

    return this.prompt(PROMPTS).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  // configuring() {
  // }

  // default() {}

  writing() {
    WRITING.call(this);
  }

  

  // conflicts() {}

  install() {
    if (this.checkModulesFolder()) return;

    process.chdir(`${process.cwd()}/${VALUES.MARKUP}`);

    this.installDependencies({
      bower: false,
      npm: true,
    });
  }

  checkModulesFolder() {
    return fsNode.existsSync(this.destinationPath(VALUES.MARKUP_MODULES));
  }

  end() {
    this.log(chalk.green(`🙌 🙌 🙌 Installation done! Run command ${chalk.red('gulp')} from markup folder 🙌 🙌 🙌`));
    if (this.props.frontend_framework !== PROMPTS_VALUES.frontend_framework.none && !this.checkModulesFolder()) {
      frameworkCopy(this);
    }
  }
};
