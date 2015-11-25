# grunt-font-loader

> Get fonts from FTP

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-font-loader --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-font-loader');
```

## The "font_loader" task

### Overview
In your project's Gruntfile, add a section named `font_loader` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  font_loader: {
    your_target: {
	      options: {
	      // Task-specific options go here.
	    },
    },
  },
});
```

### Options

#### options.fonts
Type: `String`
Default value: `'fonts.yml'`

YAML file with fonts that you need to download

Example
```YAML
roboto:
  bold: ttf
  black: 
    - svg
    - eot
  italic: all
jikharev: all
```

Will download roboto-bold.ttf, roboto-black.svg, roboto-black.eot, all roboto-italic and all jikharev fonts.


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


#### options.debug
Type: `Boolean`
Default value: `false`


```js
grunt.initConfig({
  font_loader: {
    dc: {
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
```

## Release History
<li>2015/11/25 - v 0.0.1  Still work</li>

## Special thanks
Robert Winterbottom and his [grunt-ftp-push](https://github.com/Robert-W/grunt-ftp-push)