module.exports = function(grunt) {



	grunt.initConfig({

		uglify: {
			js: {
				options: {
					banner: "/* Created by Art-Sites Studio art-sites.org */"
				},
				files: {
					'assets/jquery.send.form.min.js': ['assets/jquery.send.form.js']
				}
			}
		}

	});


	/*---------------------- Load components --------------------------*/

	grunt.loadNpmTasks("grunt-contrib-uglify");


	grunt.registerTask('default', ["uglify"]);



}