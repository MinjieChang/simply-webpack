'use strict';

var modules = {
  '/Users/chang/Desktop/simple-webpack/test/index.js': {
    code: "function fn(module, require, exports){'use strict';\n" + '\n' + "var _a = require('./a.js');\n" + '\n' + 'var _a2 = _interopRequireDefault(_a);\n' + '\n' + "var _c = require('./c.js');\n" + '\n' + 'var _c2 = _interopRequireDefault(_c);\n' + '\n' + 'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n' + '\n' + 'console.log(_c2.default);\n' + '(0, _a2.default)();}',
    dependencieMap: {
      './a.js': '/Users/chang/Desktop/simple-webpack/test/a.js',
      './c.js': '/Users/chang/Desktop/simple-webpack/test/c.js'
    }
  },
  '/Users/chang/Desktop/simple-webpack/test/a.js': {
    code: "function fn(module, require, exports){'use strict';\n" + '\n' + 'Object.defineProperty(exports, "__esModule", {\n' + '  value: true\n' + '});\n' + '\n' + "var _b = require('./b.js');\n" + '\n' + 'var _b2 = _interopRequireDefault(_b);\n' + '\n' + 'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n' + '\n' + 'console.log(_b2.default);\n' + '\n' + "var a = 'a';\n" + '\n' + 'var add = function add() {\n' + '  return a + _b2.default;\n' + '};\n' + '\n' + 'exports.default = add;}',
    dependencieMap: { './b.js': '/Users/chang/Desktop/simple-webpack/test/b.js' }
  },
  '/Users/chang/Desktop/simple-webpack/test/c.js': {
    code: "function fn(module, require, exports){'use strict';\n" + '\n' + "module.exports = 'c';}",
    dependencieMap: {}
  },
  '/Users/chang/Desktop/simple-webpack/test/b.js': {
    code: "function fn(module, require, exports){'use strict';\n" + '\n' + 'Object.defineProperty(exports, "__esModule", {\n' + '  value: true\n' + '});\n' + "var b = 'b';\n" + '\n' + 'exports.default = b;}',
    dependencieMap: {}
  }
};

var entry = '/Users/chang/Desktop/simple-webpack/test/index.js';

function run(modules) {
  function rawRequire(path) {
    var module = {
      exports: {}
    };
    var _modules$path = modules[path],
        code = _modules$path.code,
        dependencieMap = _modules$path.dependencieMap;

    console.log(dependencieMap, 'dependencieMap');
    var require = function require(path) {
      return rawRequire(dependencieMap[path]);
    };
    // return code(module, require, module.exports)
    var codeFn = eval("(false || " + code + ")");
    codeFn(module, require, module.exports);
    return module.exports;
  }
  return rawRequire(entry);
}
run(modules);