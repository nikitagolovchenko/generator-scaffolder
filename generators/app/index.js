const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const prompts = require('./prompts');
const writing = require('./writing');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay('2005-2018 All rights Reserved. P2H, Inc.'));

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  // configuring() {
  // }

  // default() {}

  writing() {
    writing.call(this);
  }

  // conflicts() {}

  install() {
    this.installDependencies();
  }

  end() {
    this.log(chalk.green('Done!'));
  }
};
