#!/usr/bin/env node

/*!
  CLI. Trying anonymous function wrapping. (Was: crude ES6 'const' replacement!)

  @copyright © Nick Freear, 05-July-2018.
  @license   MIT
*/

const MIN_JS = 'dist/github-describe.min.js';
const REPLACE = require('replace');
// const PKG = require('../package.json');

console.warn('cwd:', process.cwd());

REPLACE({
  paths: [ MIN_JS ],
  regex: '// wrap-start',
  replacement: '(function(window){',
  count: true
});

REPLACE({
  paths: [ MIN_JS ],
  regex: '// wrap-end',
  replacement: '})(window)',
  count: true
});

// https://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
// FS.createReadStream('../index.js').pipe(FS.createWriteStream('../browser.js'));

// destination.txt will be created or overwritten by default.
/* FS.copyFile('index.js', 'dist/browser.js', (err) => {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}); */

// A crude ES6 'const' to 'var' converter!
/* REPLACE({
  paths: [ 'dist/github-describe.js' ],
  regex: 'const ',
  replacement: 'var ',
  recursive: false,
  silent: false
}); */
