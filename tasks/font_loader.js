/*
 * grunt-font-loader
 * 
 * Copyright (c) 2015 Konstantin
 * Thanks for Robert-W and his grunt-ftp-push
 * Licensed under the MIT license.
 */

'use strict';

Array.prototype.remove = function() {
	var what, a = arguments,
		L = a.length,
		ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};

module.exports = function(grunt) {

	var JSFtp = require("jsftp"),
		options,
		ftp,
		credentials,
		done,
		files,
		serverFonts,
		uploadFiles;
	/**
	 * @returns {Boolean} true is returned if the required options have all been supplied
	 */
	function requirementsAreValid() {
		// host and dest are mandatory options
		return (options.host && options.fonts);
	}

	/**
	 * @param {string} dest - path to directory
	 * @return {string} - Return dest with trailing slash if not present
	 */
	function normalizeDir(dest) {
		return (dest.charAt(dest.length - 1) !== '/' ? dest + '/' : dest);
	}

	/**
	 * @return {Object} returns an object containing a username and password
	 */
	function getCredentials() {
		if (options.username && options.password) {
			return {
				username: options.username,
				password: options.password
			};
		} else {
			grunt.log.warn("Attempting Anonymous Login");
			return {
				username: null,
				password: null
			};
		}
	}

	/**
	 * Close the connection and end the asynchronous task
	 */
	function closeConnection(errMsg) {
		if (ftp) {
			ftp.raw.quit(function(err, res) {
				if (err) {
					grunt.log.error(err);
					done(false);
				}
				ftp.destroy();
				grunt.log.ok("FTP connection closed!");
				done();
			});
		} else if (errMsg) {
			grunt.log.warn(errMsg);
			done(false);
		} else {
			done();
		}
	}

	/**
	 * Create regexp massive
	 * @param  {array} params massive
	 * @param  {string} string regexp
	 * @param  {array} files  creating massive
	 * @return {boolean}        
	 */
	function getNextClar(params, string, files) {
		if (params === 'all') {
			files.push(string);
			return true;
		}
		if (Array.isArray(params)){
			params.forEach(function(item, i, array) {
				files.push(string + '.' + item + '$');
				return true;
			});
		}else if (typeof params === 'object'){
			var param;
			for (param in params) {
				var buffer = string;
				var regular;
				if (param === 'all'){
					regular = '\\w+';
				}else{
					regular = param;
				}
				string += !string ? regular : '-' + regular;
				getNextClar(params[param], string, files);
				string = buffer;
			}
		}else{
			files.push(string + '.' + params + '$');
		}
		return true;
	}

	/**
	 * Create list for downloading
	 */
	function createDownloadList() {
		uploadFiles = [];
	

		files.forEach(function(item, i, arr) {
			var preg = new RegExp(item);
			var check = false;    
			serverFonts.forEach(function(item, i, arr) {
				if (preg.test(item)) {
					uploadFiles.push(item);
					check = true;
					// serverFonts.remove(item);
				}
			});
			if (!check){
				grunt.log.warn('You have no suitable fonts at pattern ' + item);
			}
		});

		downloadFiles();
	}

	/**
	 * Remove unused files
	 * @param  {array} files files need to remove
	 */
	function removeFonts(files){
		var dest = normalizeDir(options.dest);
		files.forEach(function(item, i, arr){
			grunt.file.delete(dest + item);
			grunt.log.warn('File ' + item + ' remove.');
		});
	}

	/**
	 * 
	 */
	function downloadFiles() {
		grunt.file.mkdir(options.dest);
		var dest = normalizeDir(options.dest);
		var exsFiles = grunt.file.expand({'cwd':dest},'*.*');
		function download() {
			if (uploadFiles.length < 1) {
				//Если установлена опция очистки лишних шрифтов
				if(options.clearUnused){
					removeFonts(exsFiles);
				}
				closeConnection();
				return; // We are completed, close connection and end the program
			}
			var file = uploadFiles.pop();

			//Поиск соответствий файлов в папке и тех что мы собрались скачивать
			//в случае если он там есть удаляем его из 
			//массива который будем использовать для очистки
			var index = exsFiles.indexOf(file);
			if(index > -1){
				exsFiles.splice(index, 1);
			}

			//Если файл уже есть, качать его бессмысленно
			if(!grunt.file.exists(dest + file)){
				grunt.file.write(dest + file, '');

				ftp.get(file, dest + file, function(hadErr) {
					if (hadErr) {
						grunt.log.error('There was an error retrieving the font ' + file);
					} else{
						grunt.log.ok('File ' + file + ' transferred successfully');
					}
					download();
				});
			}else{
				grunt.log.ok('File ' + file + ' allready exist.');
				download();
			}
		}
		download();
	}

	/**
	 * Get list from server
	 * @param  {String} pattern pattern for search
	 */
	function getFilesList(pattern) {
		//If pattern empty return all avaliable fonts
		if (pattern === undefined || pattern === '') {
			formatingFontsArray(serverFonts);
			closeConnection();
			return; // We are completed, close connection and end the program
		}

		var serverFiles = [],
			preg = new RegExp('[\\w\\-\\.]*' + pattern + '[\\w\\-\\.]*');


		function regular() {
			if (serverFonts.length < 1) {
				if (serverFiles.length !== 0){
					formatingFontsArray(serverFiles);
				}else{
					grunt.log.warn('We haven\'t any suitable fonts');
				}
				closeConnection();
				return; // We are completed, close connection and end the program
			}
			var file = serverFonts.pop();
			if (preg.test(file)) {
				serverFiles.push(file);
			}
			regular();
		}
		regular();
	}

	/**
	 * Formating array with font into better readding
	 * @param  {Array} array
	 */
	function formatingFontsArray(array) {
		var fileContent = '',
			file = [],
			buffer = array[0].split('.')[0],
			exp = [];

		function writeResult() {
			var str = buffer + ' [' + exp.join(', ') + ']';
			fileContent += str + '\n';
			grunt.log.ok(str);
		}

		array.forEach(function(item, i, arr) {
			file = item.split('.');
			if (buffer === file[0]) {
				exp.push(file[1]);
			} else {
				writeResult();
				buffer = file[0];
				exp = [];
				exp.push(file[1]);
			}
		});
		writeResult();

		//Put last search result into file
		grunt.file.mkdir(options.dest);
		grunt.file.write(normalizeDir(options.dest) + '.fonts', fileContent);
	}

	grunt.registerMultiTask('font_loader', 'Get fonts from our FTP', function() {
		var mode = this.data.mode || 'load';
		options = this.options({
			fonts: 'fonts.yml',
			dest: 'fonts/',
			host: 'localhost',
			port: 21,
			username: '',
			password: '',
			clearUnused: false,
			debug: false,
		});

		if (mode === 'load') {
			var filepath = options.fonts;
			//Проверка на сущствование файла-манифеста
			if (!grunt.file.exists(filepath)) {
				grunt.log.error('Source file "' + filepath + '" not found.');
				return false;
			}

			//readFrom YAML-file
			var yaml = grunt.file.readYAML(filepath);

			getNextClar(yaml, '', files = []);
		}

		done = this.async();

		ftp = new JSFtp({
			host: options.host,
			port: options.port || 21,
			debugMode: options.debug
		});

		if (!requirementsAreValid()) {
			closeConnection("You did not specify all the requirements.");
			return false;
		}

		ftp.on('jsftp_debug', function(eventType, data) {
			console.log('DEBUG: ', eventType);
			console.log(JSON.stringify(data, null, 2));
		});

		credentials = getCredentials();

		//Auth at server
		ftp.auth(credentials.username, credentials.password, function(err, res) {
			if (err) {
				grunt.log.error(err.message);
				throw err;
			}
			grunt.log.ok("You successfully authenticated!");

			serverFonts = [];

			//Get fonts list
			ftp.ls(".", function(err, res) {
				res.forEach(function(file) {
					serverFonts.push(file.name);
				});
				if (mode === 'load') {
					createDownloadList();
				} else if (mode === 'info') {
					var pattern = grunt.option("font");
					getFilesList(pattern);
				} else {
					grunt.log.error('Task haven\'t mode ' + mode + '. Why you need him?');
					closeConnection();
					return; // We are completed, close connection and end the program
				}
			});
		});

	});

};
