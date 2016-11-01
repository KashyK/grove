module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/**/*.*'],
                tasks: ['browserify', 'uglify', 'sass'],
                options: {
                    spawn: false
                },
            },
        },

        browserify: {
            client: {
                src: ['src/js/**/*.*'],
                dest: 'public/js/latest.js',
                options: {
                    transform: [['babelify', {
                        presets: ['es2015']
                    }]]
                }
            }
        },

        uglify: {
            my_target: {
                files: {
                    'public/js/latest.min.js': ['public/js/latest.js']
                }
            }
        },

        sass: { // Task
            dist: { // Target
                options: { // Target options
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: { // Dictionary of files
                    'public/css/play.css': 'src/css/play.sass', // 'destination': 'source'
                    'public/css/index.css': 'src/css/index.sass', // 'destination': 'source'
                    'public/css/login.css': 'src/css/login.sass', // 'destination': 'source'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Default task(s).
    grunt.registerTask('default', ['browserify', 'uglify', 'sass', 'watch']);

};
