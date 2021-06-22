const path = require('path')
const fs = require('fs')
const { parser, getModuleDependences, transform } = require('./parser')

class Compiler {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
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
          const dependenciePath = path.join(path.dirname(filename), dependencie)
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
    const file = fs.readFileSync(filename, 'utf-8')
    const ast = parser(file)
    const dependencies = getModuleDependences(ast)
    const { code } = transform(file)
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
    console.log(modules);

    const entry = path.resolve(this.entry)

    const { path: outputPath, filename } = this.output
    
    const file = `
      (function (modules) {
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