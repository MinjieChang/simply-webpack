const path = require('path')

module.exports = {
  entry: './test/index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        includes: /test\//,
        test: /\.js/,
        use: {
          plugins: [['console-omit', {env: 'production'}], 'lodash-import']
        }
      }
    ]
  }
}