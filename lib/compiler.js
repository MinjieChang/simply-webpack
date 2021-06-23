'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var fs = require('fs');

var _require = require('./parser'),
    getModuleDependences = _require.getModuleDependences,
    transformWithPlugins = _require.transformWithPlugins,
    transformFromAst = _require.transformFromAst;

var _require2 = require('./util'),
    transformPath = _require2.transformPath,
    addFileNameSuffix = _require2.addFileNameSuffix;

var Compiler = function () {
  function Compiler(options) {
    _classCallCheck(this, Compiler);

    var entry = options.entry,
        output = options.output,
        _options$module = options.module,
        module = _options$module === undefined ? {} : _options$module;

    this.entry = entry;
    this.output = output;
    this.rules = module.rules || [];
    this.modules = [];
  }

  Compiler.prototype.run = function run() {
    var _this = this;

    // 依赖收集
    var entry = this.buildModules(path.resolve(this.entry));
    var modules = [entry];

    // 深度优先
    // const walk = (module) => {
    //   const { dependencies, filename } = module
    //   if (!dependencies || !dependencies.length) {
    //     return
    //   }
    //   module.dependencieMap = {}
    //   dependencies.forEach(dependencie => {
    //     const dependenciePath = path.join(path.dirname(filename), dependencie)
    //     module.dependencieMap[dependencie] = dependenciePath
    //     const depModule = this.buildModules(dependenciePath)
    //     modules.push(depModule)
    //     walk(depModule)
    //   })
    // }
    // walk(entry)

    // 广度优先，实际上广度优先更加合理
    // 由于深度优先在递归的层级过深的情况下容易出现栈溢出的情况

    var _loop = function _loop(i) {
      var module = modules[i];
      var filename = module.filename,
          dependencies = module.dependencies;

      if (dependencies) {
        module.dependencieMap = {};
        dependencies.forEach(function (dependencie) {
          var dependenciePath = transformPath(dependencie, filename);
          module.dependencieMap[dependencie] = dependenciePath;
          modules.push(_this.buildModules(dependenciePath));
        });
      }
    };

    for (var i = 0; i < modules.length; i++) {
      _loop(i);
    }
    this.modules = modules;
    // 生成文件
    this.emitFiles();
  };

  Compiler.prototype.buildModules = function buildModules(filename) {
    var file = fs.readFileSync(addFileNameSuffix(filename), 'utf-8');

    var ast = void 0;
    var dependencies = void 0;
    var code = void 0;

    var usePlugins = false;
    var usePresets = false;
    this.rules.forEach(function (rule) {
      // node_modules 下的文件不需要加上插件和presets
      if (rule.includes && rule.includes.test(filename) && rule.test.test(addFileNameSuffix(filename)) || rule.excludes && !rule.excludes.test(filename) && rule.test.test(addFileNameSuffix(filename))) {
        usePlugins = true;
        usePresets = true;
      }
      ast = transformWithPlugins(file, usePlugins, rule.use.plugins).ast;
      dependencies = getModuleDependences(ast);
      code = transformFromAst(ast, usePresets).code;
    });
    // 1、先用自定义插件转换一下
    // const { ast } = transformWithPlugins(file)
    // const dependencies = getModuleDependences(ast)
    // const { code } = transformFromAst(ast)
    var result = {
      code,
      filename,
      dependencies
    };
    return result;
  };

  Compiler.prototype.emitFiles = function emitFiles() {
    var modules = {};
    this.modules.forEach(function (module) {
      modules[module.filename] = {
        code: `function fn(module, require, exports){${module.code}}`,
        dependencieMap: module.dependencieMap
      };
    });

    var entry = path.resolve(this.entry);

    var _output = this.output,
        outputPath = _output.path,
        filename = _output.filename;


    var file = `
      (function (modules) {
        function rawRequire(path) {
          const module = {
            exports: {}
          }
          const { code, dependencieMap } = modules[path]
          let require = (path) => {
            return rawRequire(dependencieMap[path])
          }
          let codeFn = eval("(false || " + code + ")");
          codeFn(module, require, module.exports)
          return module.exports
        }
        return rawRequire('${entry}')
      })(${JSON.stringify(modules)})
    `;
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }
    fs.writeFileSync(path.join(outputPath, filename), file, 'utf-8');
  };

  return Compiler;
}();

module.exports = Compiler;