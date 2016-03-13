'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.font_loader = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  get_fonts_list: function(test) {
    test.expect(1);

    test.ok(grunt.file.exists('tmp/.fonts'), 'File with list exist.');
    test.done();
  },
  load_fonts: function(test) {
    test.expect(14);

    test.ok(grunt.file.exists('tmp/panton-blackcaps.eot'), 'File exist.');
    test.ok(grunt.file.exists('tmp/panton-blackcaps.svg'), 'File exist.');
    test.ok(grunt.file.exists('tmp/panton-blackcaps.ttf'), 'File exist.');
    test.ok(grunt.file.exists('tmp/panton-blackcaps.woff'), 'File exist.');
    test.ok(grunt.file.exists('tmp/panton-blackcaps.woff2'), 'File exist.');
    test.ok(grunt.file.exists('tmp/roboto-bold.eot'), 'File exist.');
    test.ok(grunt.file.exists('tmp/roboto-bold.woff'), 'File exist.');
    test.ok(!grunt.file.exists('tmp/roboto-bold.woff2'), 'File not exist, but he is not in a download list.');
    test.ok(grunt.file.exists('tmp/roboto-regular.eot'), 'File exist.');
    test.ok(grunt.file.exists('tmp/roboto-regular.svg'), 'File exist.');
    test.ok(grunt.file.exists('tmp/roboto-regular.ttf'), 'File exist.');
    test.ok(grunt.file.exists('tmp/roboto-regular.woff'), 'File exist.');
    test.ok(grunt.file.exists('tmp/roboto-regular.woff2'), 'File exist.');
    test.ok(!grunt.file.exists('tmp/roboto-regular-italic.eot'), 'File not exist, but he is not in a download list.');
    test.done();
  },
};
