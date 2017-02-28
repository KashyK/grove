// OOGENSNARGLE

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        esteWatch: {
            options: {
                dirs: ['src/js/**/'],
                livereload: {
                    enabled: false
                }
            },
            '*': () => {
                return ['browserify', 'uglify'];
            }
        },

        browserify: {
            client: {
                src: ['src/js/**/*.*'],
                dest: 'public/js/latest.js',
                options: {
                    banner: '// Brought to you with <3 by the Grove team. <%= new Date() %>\n',
                    transform: [
                        ['babelify', {
                            presets: ['es2015']
                        }]
                    ]
                }
            }
        },

        uglify: {
            grove: {
                files: {
                    'public/js/latest.min.js': ['public/js/latest.js']
                }
            }
        },

        sass: { // Task
            dist: { // Target
                options: { // Target options
                    style: 'compressed',
                    sourcemap: 'none',
                    noCache: true
                },
                files: { // Dictionary of files
                    'public/css/play.css': 'src/css/play.sass', // 'destination': 'source'
                    'public/css/index.css': 'src/css/index.sass', // 'destination': 'source'
                    'public/css/login.css': 'src/css/login.sass', // 'destination': 'source'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-este-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Runnable tasks.
    grunt.registerTask('build', ['browserify', 'uglify', 'sass']);
    grunt.registerTask('js', ['browserify', 'uglify', 'watch']);
    grunt.registerTask('css', ['sass', 'watch']);
    grunt.registerTask('default', ['esteWatch']);

};
