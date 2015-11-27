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
        if (Array.isArray(params))
            params.forEach(function(item, i, array) {
                files.push(string + '.' + item + '$');
                return true;
            })
        else if (typeof params === 'object')
            for (var param in params) {
                var buffer = string;
                if(param === 'all')
                	var regular = '\\w+';
               	else
               		var regular = param;
                string += !string ? regular : '-' + regular;
                getNextClar(params[param], string, files);
                string = buffer;
            } else
                files.push(string + '.' + params + '$');
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
            })
            if(!check)
            	grunt.log.warn('You have no suitable fonts at pattern ' + item);
        })
        downloadFiles();
    }

    /**
     * 
     */
    function downloadFiles() {
        grunt.file.mkdir(options.dest);

        function download() {
            if (uploadFiles.length < 1) {
                closeConnection();
                return; // We are completed, close connection and end the program
            }
            var file = uploadFiles.pop();
            grunt.file.write(options.dest + file, '');

            ftp.get(file, options.dest + file, function(hadErr) {
                if (hadErr) {
                    grunt.log.error('There was an error retrieving the font ' + file);
                } else
                    grunt.log.ok('File ' + file + ' transferred successfully');
                download();
            });
        }
        download();
    }

    grunt.registerMultiTask('font_loader', 'Get fonts from our FTP', function() {
        options = this.options({
            fonts: 'fonts.yml',
            dest: 'fonts/',
            host: 'localhost',
            port: 21,
            username: '',
            password: '',
            debug: false,
        });

        var filepath = options.fonts;
        //Проверка на сущствование файла-манифеста
        if (!grunt.file.exists(filepath)) {
            grunt.log.error('Source file "' + filepath + '" not found.');
            return false;
        }

        //readFrom YAML-file
        var yaml = grunt.file.readYAML(filepath);

        getNextClar(yaml, '', files = []);

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
                createDownloadList();
            });
        });

    });

};
