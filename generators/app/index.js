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
    stdio: [0, 1, 2]
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
    }, {
      type: 'list',
      name: 'backend',
      message: 'Are you generating a static html project, or a php application?',
      filter: function (val) {
        if (val !== '1' && val !== '2') {
          val = '1';
        }

        return val;
      },
      choices: [{
        name: 'Static (No Backend)',
        value: '1'
      }, {
        name: 'PHP (Laravel)',
        value: '2'
      }],
      store: true
    }, {
      type: 'checkbox',
      name: 'sprite',
      message: 'Would you like sprite generation? ' + chalk.blue('Note: You will need to use node versions 0.12 and below to use'),
      choices: [
        'css-sprite'
      ],
      default: [
        false
      ]
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log('Your project name is', this.props.name, '\n');

      this.props.basedir = path.resolve(process.cwd() + '/' + this.props.name);
      this.log(chalk.green('Project basedir set to: ' + this.props.basedir));

      if (this.props.backend === '2') {
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

  directories: function () {
    // Static template
    if (this.props.backend === '1') {
      this.props.dir = 'dev/assets';
      this.props.devCss = 'dev/assets/css';
      this.props.devJs = 'dev/assets/js/partials';
      this.props.devSass = 'dev/assets/sass';
      this.props.devTemplates = 'dev/templates/';
      this.props.devSprites = 'dev/assets/sprites';

      this.props.distCss = 'dist/assets/css';
      this.props.distJs = 'dist/assets/js/vendor';
      this.props.distImg = 'dist/assets/img';
      this.props.distFonts = 'dist/assets/fonts';
    }
    // Laravel project
    else if (this.props.backend === '2') {
      this.props.dir = 'resources/assets';
      this.props.devCss = 'resources/assets/css';
      this.props.devJs = 'resources/assets/js/partials';
      this.props.devSass = 'resources/assets/sass';
      this.props.devTemplates = 'resources/assets/templates/partials';
      this.props.devSprites = 'resources/assets/sprites';

      this.props.distCss = 'public/assets/css';
      this.props.distJs = 'public/assets/js/vendor';
      this.props.distImg = 'public/assets/img';
      this.props.distFonts = 'public/assets/fonts';
    }
  },

  scaffolding: function () {
    mkdirp(this.props.devCss);
    mkdirp(this.props.devJs);
    mkdirp(this.props.devSass);
    mkdirp(this.props.devTemplates);
    mkdirp(this.props.devSprites);
    mkdirp(this.props.distCss);
    mkdirp(this.props.distJs);
    mkdirp(this.props.distImg);
    mkdirp(this.props.distFonts);

    this.log('Scaffold created \n');
  },

  writing: function () {
    // copy base template
    this.fs.copy(
      this.templatePath('_index.html'),
      this.destinationPath(this.props.devTemplates + '/index.html')
    );

    this.fs.copy(
      this.templatePath('_header.html'),
      this.destinationPath(this.props.devTemplates + '/partials/header.html')
    );

    this.fs.copy(
      this.templatePath('_footer.html'),
      this.destinationPath(this.props.devTemplates + '/partials/footer.html')
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
        name: this.props.name,
        gensprite: this.props.sprite[0]
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

  install: function () {
    this.npmInstall();
  },

  end: function () {
    this.log(chalk.bgGreen('Everything is prepared. If npm failed make sure you have the right node version and run npm install once more'));
    this.log(yosay('Goodbye! '));
  }
});
