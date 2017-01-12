#!/usr/bin/env node
var program = require('commander');
var genpage = require("./lib/gen-page.js");

// process.on('exit', function () { });

program
  .version(require('./package.json').version)
  .option('-i --init [filePath]', 'init variables file')
  .parse(process.argv);


if (program.init) {
  genpage(program.init);
}
