#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var Compiler = require('./compiler');

var configFile = './webpack.config.js';

var optionName = process.argv[2];
var fileName = process.argv[3];

if (optionName === '--config' && fileName) {
  if (fs.existsSync(path.join(process.cwd(), fileName))) {
    configFile = fileName;
  } else {
    console.log(chalk.red(fileName + ' not exist, please check'));
    process.exit(1);
  }
}

var configPath = path.join(process.cwd(), configFile);
var config = require(configPath);

new Compiler(config).run();