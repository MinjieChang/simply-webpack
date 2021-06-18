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
    const entry = this.buildModules( path.resolve(this.entry))
    const modules = [entry]
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
}

module.exports = Compiler