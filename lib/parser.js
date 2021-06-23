"use strict";

var babel = require("babel-core");
var babelParser = require("@babel/parser");
var babelTraverse = require("@babel/traverse").default;
var babelGenerator = require("@babel/generator").default;

var parser = function parser(code) {
  return babelParser.parse(code, { sourceType: 'module' });
};

var getModuleDependences = function getModuleDependences(ast) {
  var dependencies = [];
  var visitor = {
    ImportDeclaration: function ImportDeclaration(path) {
      dependencies.push(path.node.source.value);
    },
    CallExpression: function CallExpression(path) {
      if (path.node.callee.name === 'require') {
        dependencies.push(path.node.arguments[0].value);
      }
    }
  };
  babelTraverse(ast, visitor);
  return dependencies;
};

var transformWithPlugins = function transformWithPlugins(code, usePlugins, plugins) {
  return babel.transform(code, {
    plugins: usePlugins ? plugins : []
  });
};

var transformFromAst = function transformFromAst(ast, usePresets) {
  return babel.transformFromAst(ast, null, {
    presets: usePresets ? ['env'] : []
  });
};

var transformFromFile = function transformFromFile(code) {
  return babel.transform(code, {
    presets: ['env']
  });
};

var generator = function generator(ast, code) {
  return babelGenerator(ast, { compact: true }, code);
};

module.exports = {
  parser,
  generator,
  transformFromAst,
  transformFromFile,
  transformWithPlugins,
  getModuleDependences
};