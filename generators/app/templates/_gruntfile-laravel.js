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
          'assets/css/default.noprefix.css': 'assets/sass/default.sass', // 'destination': 'source'
          'assets/css/smart.noprefix.css': 'assets/sass/smart.sass' // 'destination': 'source'
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
            src: 'assets/css/default.noprefix.css',
            dest: '../public/css/default.css'
        },
        smart: {
            src: 'assets/css/smart.noprefix.css',
            dest: '../public/css/smart.css'
        }
    },

    // copy assets
    copy: {
      js_to_frontend: {
        cwd: 'assets/js',
        src: '**',
        expand: true,
        dest: '../public/js',
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

    // watch
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['assets/sass/**/*', 'assets/sprite/**/*'],
        tasks: [/*'css-sprite',*/ 'sass', 'postcss', 'copy:js_to_frontend']
      },
      js: {
        files: ['assets/js/**/*'],
        tasks: ['copy:js_to_frontend']
      }
    },

    // configure live reload
    livereload: {
      options: {
        base: ''
      },
      files: ['/**/*']
    }
  });

  require('matchdep').filterDev(['grunt-*', /*'css-sprite',*/]).forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['copy', /*'css_sprite',*/ 'sass', 'postcss', 'watch', 'livereload']);
  
};