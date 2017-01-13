#!/usr/bin/env node

var program = require('commander');
var genpage = require("./lib/gen-page.js");
var ora = require('ora');

program
    .version(require('./package.json').version)
    .usage("[options] <page-dirname ...>")
    .option('-i --init [page-dirname]', 'Generate page directory')
    .parse(process.argv);

if (program.init) {
    genpage(program.init);

} else if (typeof process.argv[2] === "undefined") {
    program.help();

}
