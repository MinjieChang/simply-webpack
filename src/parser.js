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
  }
  babelTraverse(ast, visitor)
  return dependencies
}

const transform = (code) => {
  return babel.transform(code, {
    presets: ['env']
  })
}

const generator = (ast, code) => {
  return babelGenerator(ast, { compact: true }, code)
}

module.exports = {
  parser,
  transform,
  generator,
  getModuleDependences,
}