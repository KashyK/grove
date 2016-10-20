module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify', 'uglify'],
                options: {
                    spawn: false
                },
            },
        },

        browserify: {
            client: {
                src: ['src/**/*.js'],
                dest: 'public/js/build/latest.js',
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
                    'public/js/build/latest.min.js': ['public/js/build/latest.js']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['watch']);
    
};