# grunt-font-loader

> Get fonts from FTP

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

`shell
npm install grunt-font-loader --save-dev
`

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

`js
grunt.loadNpmTasks('grunt-font-loader');
`

## The "font_loader" task

### Overview
In your project's Gruntfile, add a section named `font_loader` to the data object passed into `grunt.initConfig()`.

`js
grunt.initConfig({
  font_loader: {
    your_target: {
	      options: {
	      // Task-specific options go here.
	    },
    },
  },
});
`

### Options

#### mode
Type: `String`

Default value: `'load'`

Value: `load / info`


#### options.fonts
Type: `String`

Default value: `'fonts.yml'`

YAML file with fonts that you need to download

Example
`YAML
roboto:
  bold: ttf
  black: 
    - svg
    - eot
  italic: all
jikharev: all
panton:
   all: ttf
nova:
   all: 
     - ttf
     - eot
`

Will download roboto-bold.ttf, roboto-black.svg, roboto-black.eot, all roboto-italic, all jikharev fonts, all panton with ttf filename extension, all nova with ttf and eot filename extension.


#### options.dest
Type: `String`

Default value: `'fonts/'`

Folder into which fonts will be downloaded


#### options.host
Type: `String`

Default value: `'localhost'`


#### options.port
Type: `Number`

Default value: `21`


#### options.username
Type: `String`

Default value: `none`


#### options.password
Type: `String`

Default value: `none`

#### options.clearUnused
Type: `Boolean`

Default value: `false`

Remove fonts that do not exist in YAML file. !!! **Caution this option can delete and your oun fonts** !!!

#### options.debug
Type: `Boolean`

Default value: `false`


###Example config for downloading fonts

`js
grunt.initConfig({
  font_loader: {
    get: {
		options:{
			fonts: 'sources/fonts/fonts.yml',
            dest: 'web/fonts/',
            host: '88.198.10.230',
            username: 'fonts',
            password: 'fcfifq',
		}
    },
  },
});
`

###Example config for `info` mode

`js
grunt.initConfig({
  font_loader: {
    list: {
		mode: 'info',
		options:{
            dest: 'web/fonts',
            host: '88.198.10.230',
            username: 'fonts',
            password: 'fcfifq',
		}
    },
  },
});
`

This task  will print all available for download fonts into console and into file `.fonts` on dest folder. 

Also you can pass a variable `font` with shape for search. Type `grunt font_loader:list --font=roboto` and you see a result something like this

`roboto-black [eot, svg, ttf, woff, woff2]
roboto-bold [eot, svg, ttf, woff, woff2]
roboto-regular [eot, svg, ttf, woff, woff2]`

## Release History

<li>2015/11/25 - v 0.1.0  Still work</li>
<li>2015/11/28 - v 0.2.0  More functions</li>
<li>2015/12/14 - v 0.3.0  No more excess load. You can clear font directory of unused fonts.</li>

## Special thanks
Robert Winterbottom and his [grunt-ftp-push](https://github.com/Robert-W/grunt-ftp-push)

## Support the project

We have oure ftp whit fonts, access to server you can find above.
If you want help us, just put your web-fonts (made web-fonts [here](http://www.fontsquirrel.com/tools/webfont-generator)) into folder `helpus` and made pull request.