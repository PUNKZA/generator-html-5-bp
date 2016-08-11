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
    this.log(yosay('This is PUNK\'s ' + chalk.blue('custom web') + ' generator!\n\n'));
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
      message: 'Are you generating a static html project, or a php application?',
      filter: function(val) {
        if(val !== '1' && val !== '2') {
          val = '1';
        }

        return val;
      },
      choices: [{
        name: 'Static (No Backend)',
        value: '1'
      },{
        name: 'PHP (Laravel)',
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
      this.props.dir = 'dev/assets';
      this.props.dev_css = 'dev/assets/css';
      this.props.dev_js = 'dev/assets/js/partials';
      this.props.dev_sass = 'dev/assets/sass';
      this.props.dev_templates = 'dev/templates/partials';
      this.props.dev_sprites = 'dev/assets/sprites';

      this.props.dist_css = 'dist/assets/css';
      this.props.dist_js = 'dist/assets/js/vendor';
      this.props.dist_img = 'dist/assets/img';
      this.props.dist_fonts = 'dist/assets/fonts';
    }
    // Laravel project
    else if(this.props.backend === '2') {
      this.props.dir = 'resources/assets';
      this.props.dev_css = 'resources/assets/css';
      this.props.dev_js = 'resources/assets/js/partials';
      this.props.dev_sass = 'resources/assets/sass';
      this.props.dev_templates = 'resources/assets/templates/partials';
      this.props.dev_sprites = 'resources/assets/sprites';

      this.props.dist_css = 'public/assets/css';
      this.props.dist_js = 'public/assets/js/vendor';
      this.props.dist_img = 'public/assets/img';
      this.props.dist_fonts = 'public/assets/fonts';
    }
  },

  scaffolding: function () {kmkdirp(this.props.dev_css);
    mkdirp(this.props.dev_js);
    mkdirp(this.props.dev_sass);
    mkdirp(this.props.dev_templates);
    mkdirp(this.props.dev_sprites);
    mkdirp(this.props.dist_css);
    mkdirp(this.props.dist_js);
    mkdirp(this.props.dist_img);
    mkdirp(this.props.dist_fonts);

    this.log('Scaffold created \n');
  },

  writing: function () {
    // copy base template
    this.fs.copy(
      this.templatePath('_index.html'),
      this.destinationPath(this.props.dir + '/templates/index.html')
    );

    this.fs.copy(
      this.templatePath('_header.html'),
      this.destinationPath(this.props.dev_templates + '/header.html')
    );

    this.fs.copy(
      this.templatePath('_footer.html'),
      this.destinationPath(this.props.dev_templates + '/footer.html')
    );

    this.fs.copy(
      this.templatePath('sass/**/*'), 
      this.destinationPath(this.props.dir + '/sass')
    );

    this.fs.copy(
      this.templatePath('_index.js'),
      this.destinationPath(this.props.dir + '/js/index.js')
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
  },

  install: function() {
    this.npmInstall();
  },

  end: function () {
    this.log(chalk.bgGreen('Everything is prepared. If npm failed make sure you have the right node version and run npm install once more'));
    this.log(yosay('Goodbye! '));
  }
});
