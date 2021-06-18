
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
          let codeFn = eval("(false || " + code + ")");
          codeFn(module, require, module.exports)
          return module.exports
        }
        return rawRequire('/Users/chang/Desktop/simple-webpack/test/index.js')
      }
      run({"/Users/chang/Desktop/simple-webpack/test/index.js":{"code":"function fn(module, require, exports){'use strict';\n\nvar _a = require('./a.js');\n\nvar _a2 = _interopRequireDefault(_a);\n\nvar _c = require('./c.js');\n\nvar _c2 = _interopRequireDefault(_c);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(1);\nconsole.log(_c2.default);\nconsole.log(_a2.default, 888);\nconsole.log((0, _a2.default)(), 999);\nconsole.log(3);}","dependencieMap":{"./a.js":"/Users/chang/Desktop/simple-webpack/test/a.js","./c.js":"/Users/chang/Desktop/simple-webpack/test/c.js"}},"/Users/chang/Desktop/simple-webpack/test/a.js":{"code":"function fn(module, require, exports){'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _b = require('./b.js');\n\nvar _b2 = _interopRequireDefault(_b);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_b2.default);\n\nvar a = 'a';\n\nvar add = function add() {\n  return a + _b2.default;\n};\n\nexports.default = add;}","dependencieMap":{"./b.js":"/Users/chang/Desktop/simple-webpack/test/b.js"}},"/Users/chang/Desktop/simple-webpack/test/c.js":{"code":"function fn(module, require, exports){'use strict';\n\nmodule.exports = 'c';}","dependencieMap":{}},"/Users/chang/Desktop/simple-webpack/test/b.js":{"code":"function fn(module, require, exports){'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar b = 'b';\n\nexports.default = b;}","dependencieMap":{}}})
    