'use strict';

var path = require('path');
var fs = require('fs');

var isDirectory = function isDirectory(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  var stat = fs.lstatSync(filePath);
  return stat.isDirectory(); // true || false 判断是不是文件夹
};

var isRelativePath = function isRelativePath(requirePath) {
  return (/^\.?\.\//.test(requirePath)
  );
};

var isAbsolutePath = function isAbsolutePath(requirePath) {
  return !isRelativePath(requirePath);
};

var hasFileNameSuffix = function hasFileNameSuffix(name) {
  return (/\.js/.test(name)
  );
};

var addFileNameSuffix = function addFileNameSuffix(name) {
  return hasFileNameSuffix(name) ? name : `${name}.js`;
};

var transformPath = function transformPath(requirePath, filename) {
  if (isRelativePath(requirePath)) {
    var fullPathName = addFileNameSuffix(requirePath);
    return path.join(path.dirname(filename), fullPathName);
  } else {
    var resultFile = path.join(process.cwd(), 'node_modules', requirePath);
    // 是文件夹
    if (isDirectory(resultFile)) {
      return path.resolve(resultFile, './index.js');
    }
    // 是文件
    return path.join(process.cwd(), 'node_modules', `${requirePath}.js`);
  }
};

module.exports = {
  isRelativePath,
  isAbsolutePath,
  transformPath,
  addFileNameSuffix
};