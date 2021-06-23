const path = require('path')
const fs = require('fs')
const { getModuleDependences, transformWithPlugins ,transformFromAst } = require('./parser')
const { transformPath, addFileNameSuffix } = require('./util')

class Compiler {
  constructor(options) {
    const { entry, output, module = {} } = options
    this.entry = entry
    this.output = output
    this.rules = module.rules || []
    this.modules = []
  }
  run() {
    // 依赖收集
    const entry = this.buildModules(path.resolve(this.entry))
    const modules = [entry]

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
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      const { filename, dependencies } = module
      if (dependencies) {
        module.dependencieMap = {}
        dependencies.forEach((dependencie) => {
          const dependenciePath = transformPath(dependencie, filename)
          module.dependencieMap[dependencie] = dependenciePath
          modules.push(this.buildModules(dependenciePath))
        })
      }
    }
    this.modules = modules
    // 生成文件
    this.emitFiles()
    
  }
  buildModules(filename) {
    const file = fs.readFileSync(addFileNameSuffix(filename), 'utf-8')

    let ast
    let dependencies
    let code

    let usePlugins = false
    let usePresets = false
    this.rules.forEach(rule => {
      // node_modules 下的文件不需要加上插件和presets
      if (rule.includes && rule.includes.test(filename) && rule.test.test(addFileNameSuffix(filename))
        || rule.excludes && !rule.excludes.test(filename) && rule.test.test(addFileNameSuffix(filename))
      ) {
        usePlugins = true
        usePresets = true
      }
      ast = transformWithPlugins(file, usePlugins, rule.use.plugins).ast
      dependencies = getModuleDependences(ast)
      code = transformFromAst(ast, usePresets).code
    })
    // 1、先用自定义插件转换一下
    // const { ast } = transformWithPlugins(file)
    // const dependencies = getModuleDependences(ast)
    // const { code } = transformFromAst(ast)
    const result = {
      code,
      filename,
      dependencies,
    }
    return result
  }
  emitFiles() {
    const modules = {}
    this.modules.forEach(module => {
      modules[module.filename] = {
        code: `function fn(module, require, exports){${module.code}}`,
        dependencieMap: module.dependencieMap
      }
    })

    const entry = path.resolve(this.entry)

    const { path: outputPath, filename } = this.output
    
    const file = `
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
    `
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath)
    }
    fs.writeFileSync(path.join(outputPath, filename), file, 'utf-8')
  }
}

module.exports = Compiler