# grunt-font-loader

> Скачивание web-шрифтов с FTP-сервера 

## С чего начать
Для плагина требуется Grunt `~0.4.5`

Если вы еще не использовали [Grunt](http://gruntjs.com/), прочитайте [Getting Started](http://gruntjs.com/getting-started) руководство, в котором объясняyj как создать [Gruntfile](http://gruntjs.com/sample-gruntfile) и как устанавливать плагины. После того как вы разберетесь с этим, вы можeте установить плагин командой:

``` shell
npm install grunt-font-loader --save-dev
```

Установив плагин, его так же необходимо подключить в Gruntfile строкой:

``` js
grunt.loadNpmTasks('grunt-font-loader');
```

## Задача "font_loader"

### Кратко
В файле Gruntfile вашего проекта, добавте массив `font_loader` в данные объекта передаваемого в `grunt.initConfig()`.

``` js
grunt.initConfig({
  font_loader: {
    your_target: {
	      options: {
	      // Всякие настройки для работы задания.
	    },
    },
  },
});
```

### Настройки

#### mode
Тип: `String`

По умолчанию: `'load'`

Допустимые значения: `load / info`


#### options.fonts
Тип: `String`

По умолчанию: `'fonts.yml'`

YAML-файл с перечисленными шрифтами, которые вы хотите скачать для проекта

Пример такого файла:

``` YAML
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
```

Будут скачаны roboto-bold.ttf, roboto-black.svg, roboto-black.eot, roboto-italic всех расширений, jikharev всех расширений, все шрифты panton с расширением ttf, и все nova с расширениями ttf и eot.


#### options.dest
Тип: `String`

По умолчанию: `'fonts/'`

Путь до каталога куда вам необходимо скачать шрифты


#### options.host
Тип: `String`

По умолчанию: `'localhost'`


#### options.port
Тип: `Number`

По умолчанию: `21`


#### options.username
Тип: `String`

По умолчанию: `none`


#### options.password
Тип: `String`

По умолчанию: `none`

#### options.clearUnused
Тип: `Boolean`

По умолчанию: `false`

Удаление файлов из папки dest не упомянутых в YAML файле. !!! **Осторожно установка этой опции может снести к херам и ваши собственые шрифты** !!!

#### options.debug
Тип: `Boolean`

По умолчанию: `false`

###Пример настройки задания для загрузки шрифтов

``` js
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
```

###Пример настройки задания для режима `info`

``` js
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
```

Данный режим позволяет вывести все доступные для скачивания шрифты в консоль и в файл `.fonts` помешенный в каталог указанный в `dest`. Доступные на данный момент шрифты можно посмотреть [здесь](https://github.com/konstantin24121/grunt-font-loader/blob/master/AVALIABLEFONTS.md).

Так же вы можeте использовать переменную `font` для поиска нужного вам шрифта. Пример вызова такого вызова `grunt font_loader:list --font=roboto` выведет в консоль и файл что-то вроде того:

``` roboto-black [eot, svg, ttf, woff, woff2]
roboto-bold [eot, svg, ttf, woff, woff2]
roboto-regular [eot, svg, ttf, woff, woff2]
```

## История версий

<li>2015/11/25 - v 0.1.0  Заработало</li>
<li>2015/11/28 - v 0.2.0  Немного больше функций</li>
<li>2015/12/14 - v 0.3.0  Никакой больше лишней загрузки. Можно очищать директорию от неиспользуемых шрифтов</li>

## Особая благодарность
Robert Winterbottom и его плагину [grunt-ftp-push](https://github.com/Robert-W/grunt-ftp-push)

## Поддержи проект
У нас имеется свой ftp со шрифтами доступы к нему привидены в примерах выше.
Если вы хотите помочь проекту и поддержать нас, просто поместите web-шрифты (можно сделать [тут](http://www.fontsquirrel.com/tools/webfont-generator)) в каталог `helpus` и сделайте pull request.