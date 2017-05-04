'use strict';


module.exports = function(grunt) {
	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),

		clean: {
			dist: 'dist'
		},

		compress: {
			main: {
				options: {
					archive: 'dist/<%= package.name %>-<%= package.version %>.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: [
							'**'
						]
					},
					{
						src: [
							'LICENSE'
						]
					}
				]
			}
		},

		eslint: {
			all: {
				options: {
					configFile: 'eslint.json'
				},
				src: [
					'Gruntfile.js',
					'src/**/*.js',
					'!src/node_modules/**/*.js'
				]
			}
		},

		jsonlint: {
			eslint: {
				src: 'eslint.json'
			},
			fixtures: {
				src: 'fixtures/**/*.json'
			},
			package: {
				src: [
					'package.json',
					'src/package.json'
				]
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('lint', [
		'jsonlint',
		'jsonlint',
		'eslint'
	]);

	grunt.registerTask('build', [
		'lint',
		'clean',
		'compress'
	]);

	grunt.registerTask('default', [
		'build'
	]);
};
