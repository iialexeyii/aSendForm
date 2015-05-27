module.exports = function(grunt) {



	grunt.initConfig({

		uglify: {
			js: {
				options: {
					sourceMap: true,
					sourceMapName: 'assets/jquery.send.form.js.map',
					sourceMapIncludeSources: true
				},
				files: {
					'assets/jquery.send.form.min.js': ['assets/jquery.send.form.js']
				}
			}
		}

	});


	/*---------------------- Load components --------------------------*/

	grunt.loadNpmTasks("grunt-contrib-uglify");


	grunt.registerTask('default', ["watch"]);



}