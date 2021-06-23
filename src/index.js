#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const chalk = require('chalk');
const Compiler = require('./compiler')

let configFile = './webpack.config.js'

let optionName = process.argv[2]
let fileName = process.argv[3]

if (optionName === '--config' && fileName) {
  if (fs.existsSync(path.join(process.cwd(), fileName))) {
    configFile = fileName
  } else {
    console.log(chalk.red(fileName + ' not exist, please check'));
    process.exit(1)
  }
}

const configPath = path.join(process.cwd(), configFile)
const config = require(configPath)

new Compiler(config).run()