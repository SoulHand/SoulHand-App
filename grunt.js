module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jasmine: {
			requirejs: {
				options: {
					specs: './Test/*Test.js',
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfigFile : './Test/requirejs.config.js',
						requireConfig: {
							baseUrl: './Test'
						}
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	
	grunt.registerTask('test', ['connect', 'jasmine:requirejs']);
};