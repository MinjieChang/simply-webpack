const modules = {
  '/Users/chang/Desktop/simplify-webpack/test/index.js': {
    code: "function fn(module, require, exports){'use strict';\n" +
      '\n' +
      "var _a = require('./a.js');\n" +
      '\n' +
      'var _a2 = _interopRequireDefault(_a);\n' +
      '\n' +
      "var _c = require('./c.js');\n" +
      '\n' +
      'var _c2 = _interopRequireDefault(_c);\n' +
      '\n' +
      'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n' +
      '\n' +
      'console.log(_c2.default);\n' +
      '(0, _a2.default)();}',
    dependencieMap: {
      './a.js': '/Users/chang/Desktop/simplify-webpack/test/a.js',
      './c.js': '/Users/chang/Desktop/simplify-webpack/test/c.js'
    }
  },
  '/Users/chang/Desktop/simplify-webpack/test/a.js': {
    code: "function fn(module, require, exports){'use strict';\n" +
      '\n' +
      'Object.defineProperty(exports, "__esModule", {\n' +
      '  value: true\n' +
      '});\n' +
      '\n' +
      "var _b = require('./b.js');\n" +
      '\n' +
      'var _b2 = _interopRequireDefault(_b);\n' +
      '\n' +
      'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n' +
      '\n' +
      'console.log(_b2.default);\n' +
      '\n' +
      "var a = 'a';\n" +
      '\n' +
      'var add = function add() {\n' +
      '  return a + _b2.default;\n' +
      '};\n' +
      '\n' +
      'exports.default = add;}',
    dependencieMap: { './b.js': '/Users/chang/Desktop/simplify-webpack/test/b.js' }
  },
  '/Users/chang/Desktop/simplify-webpack/test/c.js': {
    code: "function fn(module, require, exports){'use strict';\n" +
      '\n' +
      "module.exports = 'c';}",
    dependencieMap: {}
  },
  '/Users/chang/Desktop/simplify-webpack/test/b.js': {
    code: "function fn(module, require, exports){'use strict';\n" +
      '\n' +
      'Object.defineProperty(exports, "__esModule", {\n' +
      '  value: true\n' +
      '});\n' +
      "var b = 'b';\n" +
      '\n' +
      'exports.default = b;}',
    dependencieMap: {}
  }
}

const entry = '/Users/chang/Desktop/simplify-webpack/test/index.js'

function run(modules) {
  function rawRequire(path) {
    const module = {
      exports: {}
    }
    const { code, dependencieMap } = modules[path]
    console.log(dependencieMap, 'dependencieMap');
    let require = (path) => {
      return rawRequire(dependencieMap[path])
    }
    // return code(module, require, module.exports)
    let codeFn = eval("(false || "+code+")");
    codeFn(module, require, module.exports)
    return module.exports
  }
  return rawRequire(entry)
}
run(modules)