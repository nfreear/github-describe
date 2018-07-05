#!/usr/bin/env node

const REPLACE = require('replace');
// const FS = require('fs');

console.warn('cwd:', process.cwd());

// https://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
// FS.createReadStream('../index.js').pipe(FS.createWriteStream('../browser.js'));

// destination.txt will be created or overwritten by default.
/* FS.copyFile('index.js', 'dist/browser.js', (err) => {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}); */

// A crude ES6 'const' to 'var' converter!
REPLACE({
  paths: [ 'dist/dist.js' ],
  regex: 'const ',
  replacement: 'var ',
  recursive: false,
  silent: false
});

/* REPLACE({
  paths: [ 'dist/browser.js' ],
  regex: "require('superagent').get;",
  replacement: 'ajaxGet;',
  recursive: false,
  silent: false
}); */
