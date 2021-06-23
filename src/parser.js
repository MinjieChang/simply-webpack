const babel = require("babel-core");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const babelGenerator = require("@babel/generator").default;

const parser = (code) => {
  return babelParser.parse(code, { sourceType: 'module' })
}

const getModuleDependences = (ast) => {
  const dependencies = []
  const visitor = {
    ImportDeclaration: function(path) {
      dependencies.push(path.node.source.value)
    },
    CallExpression: function (path) {
      if (path.node.callee.name === 'require') {
        dependencies.push(path.node.arguments[0].value)
      }
    },
  }
  babelTraverse(ast, visitor)
  return dependencies
}

const transformWithPlugins = (code, usePlugins, plugins) => {
  return babel.transform(code, {
    plugins: usePlugins ? plugins: []
  })
}

const transformFromAst = (ast, usePresets) => {
  return babel.transformFromAst(ast, null, {
    presets: usePresets ? ['env'] : []
  })
}

const transformFromFile = (code) => {
  return babel.transform(code, {
    presets: ['env']
  })
}

const generator = (ast, code) => {
  return babelGenerator(ast, { compact: true }, code)
}

module.exports = {
  parser,
  generator,
  transformFromAst,
  transformFromFile,
  transformWithPlugins,
  getModuleDependences,
}