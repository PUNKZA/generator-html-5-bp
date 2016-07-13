'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var path = require('path');
var exec = require('child_process').exec;
var execs = require('child_process').execSync;

function createProject(name) {
  name = _.kebabCase(name);
  return name;
}

function initLaravel(name, context) {
  context.log(chalk.blue('Creating Laravel project via Composer in ' + path.resolve('./' + name)));
  execs('composer create-project laravel/laravel ./' + name, {
    stdio: [0,1,2]
  });
}

module.exports = yeoman.Base.extend({
  initializing: function () {
    // Yeoman greets user and outputs version
    this.log(yosay('This is PUNK\'s ' + chalk.blue('custom boilerplate') + ' generator!\n\n'));
    this.props = {};
  },

  prompting: function () {
    var done = this.async();
    this.log('Follow the prompts to get your project started.\n');

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: createProject(path.basename(process.cwd())),
      filter: createProject,
      validate: function (str) {
        return str.length > 0;
      },
      store: true
    },{
      type: 'list',
      name: 'backend',
      message: 'Are you generating a static project, or using a framework?',
      filter: function(val) {
        if(val !== '1' && val !== '2') {
          val = '1';
        }

        return val;
      },
      choices: [{
        name: 'Static',
        value: '1'
      },{
        name: 'Laravel',
        value: '2'
      }],
      store: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log('Your project name is', this.props.name, '\n');

      this.props.basedir = path.resolve(process.cwd() + '/' + this.props.name);
      this.log(chalk.green('Project basedir set to: ' + this.props.basedir));

      if(this.props.backend == '2') {
        initLaravel(this.props.name, this);
      }

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

  directories: function() {
    // Static template
    if(this.props.backend === '1') {
      this.props.dir_base = 'dev';
      this.props.dir_assets = 'dev/assets';
      this.props.dir_css = 'dev/assets/css';
      this.props.dir_js = 'dev/assets/js';
      this.props.dir_sass = 'dev/assets/sass';
      this.props.dir_img = 'dev/assets/img';
      this.props.dir_fonts = 'dev/assets/fonts';
      this.props.dir_templates = 'dev/templates';
      this.props.dir_partials = 'dev/templates/partials';
    }
    // Laravel project
    else if(this.props.backend === '2') {
      this.props.dir_base = 'resources';
      this.props.dir_assets = 'resources/assets';
      this.props.dir_css = 'resources/assets/css';
      this.props.dir_js = 'resources/assets/js';
      this.props.dir_sass = 'resources/assets/sass';
      this.props.dir_img = 'public/assets/img';
      this.props.dir_fonts = 'public/assets/fonts';
      this.props.dir_templates = 'resources/views';
      this.props.dir_partials = 'resources/views/partials';
    }
  },

  scaffolding: function () {
    mkdirp(this.props.dir_base);

    mkdirp(this.props.dir_assets);
    mkdirp(this.props.dir_css);
    mkdirp(this.props.dir_js);
    mkdirp(this.props.dir_sass);
    mkdirp(this.props.dir_img);
    mkdirp(this.props.dir_fonts);

    mkdirp(this.props.dir_templates);
    mkdirp(this.props.dir_partials);

    this.log('Scaffold created \n');
  },

  writing: function () {
    // copy base template
    this.fs.copy(
      this.templatePath('_index.html'),
      this.destinationPath(this.props.dir_templates + '/index.html')
    );

    this.fs.copy(
      this.templatePath('_header.html'),
      this.destinationPath(this.props.dir_partials + '/header.html')
    );

    this.fs.copy(
      this.templatePath('_footer.html'),
      this.destinationPath(this.props.dir_partials + '/footer.html')
    );

    this.fs.copy(
      this.templatePath('_default.sass'),
      this.destinationPath(this.props.dir_sass + '/default.sass')
    );

    this.fs.copy(
      this.templatePath('_smart.sass'),
      this.destinationPath(this.props.dir_sass + '/smart.sass')
    );

    this.fs.copy(
      this.templatePath('_library.sass'),
      this.destinationPath(this.props.dir_sass + '/_library.sass')
    );

    this.fs.copy(
      this.templatePath('_normalize.sass'),
      this.destinationPath(this.props.dir_sass + '/normalize.sass')
    );

    this.fs.copy(
      this.templatePath('_index.js'),
      this.destinationPath(this.props.dir_js + '/index.js')
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
