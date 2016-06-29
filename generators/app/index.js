'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var path = require('path');
var exec = require('child_process').exec;

function createProject (name) {
  name = _.kebabCase(name);
  return name;
}

module.exports = yeoman.Base.extend({
  initializing: function () {
    // Yeoman greets user and outputs version
    this.log(yosay('This is PUNK\'s ' + chalk.blue('custom boilerplate') + ' generator!\n\n'));
    this.props = {};
  },

  prompting: function () {
    var done = this.async();
    this.log('Follow the prompts to get your project started.\n' );

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: createProject(path.basename(process.cwd())),
      filter: createProject,
      validate: function(str) {
        return str.length > 0;
      },
      store: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log('Your project name is', this.props.name, '\n');

      done();
    }.bind(this));
  },

  default: function () {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log('If this directory has not been created I\'ll automatically create one for you. \n');
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  },

  scaffolding: function () {
    mkdirp('dev');

    mkdirp('dev/assets');
    mkdirp('dev/assets/css');
    mkdirp('dev/assets/js');
    mkdirp('dev/assets/sass');
    mkdirp('dev/assets/img');
    mkdirp('dev/assets/fonts');

    mkdirp('dev/templates');
    mkdirp('dev/templates/partials');

    this.log('Scaffold created \n');
  },

  writing: function () {
    // copy base template
    this.fs.copy(
      this.templatePath('_index.html'),
      this.destinationPath('dev/templates/index.html')
    );

    this.fs.copy(
      this.templatePath('_header.html'),
      this.destinationPath('dev/templates/partials/header.html')
    );

    this.fs.copy(
      this.templatePath('_footer.html'),
      this.destinationPath('dev/templates/partials/footer.html')
    );

    this.fs.copy(
      this.templatePath('_default.sass'),
      this.destinationPath('dev/assets/sass/default.sass')
    );

    this.fs.copy(
      this.templatePath('_smart.sass'),
      this.destinationPath('dev/assets/sass/smart.sass')
    );

    this.fs.copy(
      this.templatePath('_library.sass'),
      this.destinationPath('dev/assets/sass/_library.sass')
    );

    this.fs.copy(
      this.templatePath('_normalize.sass'),
      this.destinationPath('dev/assets/sass/normalize.sass')
    );

    this.fs.copy(
      this.templatePath('_index.js'),
      this.destinationPath('dev/assets/js/index.js')
    );

    // copy config files
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'), {
        name: this.props.name
      }
    );

    this.fs.copy(
      this.templatePath('_gruntfile.js'),
      this.destinationPath('Gruntfile.js')
    );

    this.fs.copy(
      this.templatePath('_config.js'),
      this.destinationPath('config.js')
    );

    this.fs.copy(
      this.templatePath('_server.js'),
      this.destinationPath('server.js')
    );
  },

  git: function () {
    // Init git
    this.log(chalk.blue('Will reinit git repo if there is an existing one otherwise will init one for you in the newly created project.'));
    // this.spawnCommand('git', ['init']);
    exec('git init');
    exec('touch .gitignore');
  },

  end: function () {
    this.log(chalk.bgGreen('Everything is prepared. Now make sure you have the right node version and run npm install'));
    this.log(yosay('Goodbye! '));
  }
});

