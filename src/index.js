const Compiler = require('./compiler')
const config = require('../webpack.config')

new Compiler(config).run()