module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // compile sass
    sass: {
      options: {
        style: 'expanded' // options: compressed,  
        // lineNumbers: true
      },
      dist: {
        files: {
          'dev/assets/css/default.noprefix.css': 'dev/assets/sass/default.sass', // 'destination': 'source'
          'dev/assets/css/smart.noprefix.css': 'dev/assets/sass/smart.sass' // 'destination': 'source'
        }
      }
    },

    // add vendor-specific prefixes from Can I Use
    postcss: {
        options: {
            map: false,
            processors: [
                require('autoprefixer')({
                    browsers: ['last 2 versions']
                })
            ]
        },
        default: {
            src: 'dev/assets/css/default.noprefix.css',
            dest: 'dist/assets/css/default.css'
        },
        smart: {
            src: 'dev/assets/css/smart.noprefix.css',
            dest: 'dist/assets/css/smart.css'
        }
    },

    // copy assets
    copy: {
      js_to_frontend: {
        cwd: 'dev/assets/js',
        src: '**',
        expand: true,
        dest: 'dist/assets/js',
        flatten: false
      }
    },

    // create retina & non-retina sprite sheets
    css_sprite: {
      options: {
        cssPath: '../img/', // checked
        orientation: 'binary-tree',
        processor: 'sass',
        margin: 4,
        interpolation: 'linear',
        retina: true
      }
    },

    // compile handlebars
    'compile-handlebars': {
      globbedTemplateAndOutput: {
        template: 'dev/templates/*.html',
        templateData: 'dev/templates/**/**/*.json',
        output: 'dist/*.html',
        partials: 'dev/templates/partials/**/*.html'
      }
    },

    express: {
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },

    // watch
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['dev/assets/sass/**/*', 'dev/templates/**/*', 'dev/assets/sprite/**/*'],
        tasks: ['css_sprite', 'sass', 'autoprefixer', 'copy:js_to_frontend', 'compile-handlebars']
      },
      js: {
        files: ['dev/assets/js/**/*'],
        tasks: ['copy:js_to_frontend']
      }
    },

    // configure live reload
    livereload: {
      options: {
        base: ''
      },
      files: ['dist/**/*']
    }
  });

  require('matchdep').filterDev(['grunt-*', 'css-sprite', 'postcss']).forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['copy', 'css_sprite', 'sass', 'compile-handlebars', 'autoprefixer', 'watch', 'livereload']);
};
