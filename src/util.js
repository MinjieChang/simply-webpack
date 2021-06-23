const path = require('path')
const fs = require('fs')

const isDirectory = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return false
  }
  const stat = fs.lstatSync(filePath);
  return stat.isDirectory();// true || false 判断是不是文件夹
}

const isRelativePath = (requirePath) => {
  return /^\.?\.\//.test(requirePath)
}

const isAbsolutePath = (requirePath) => {
  return !isRelativePath(requirePath)
}

const hasFileNameSuffix = (name) => {
  return /\.js/.test(name)
}

const addFileNameSuffix = (name) => {
  return hasFileNameSuffix(name) ? name : `${name}.js`
}

const transformPath = (requirePath, filename) => {
  if (isRelativePath(requirePath)) {
    const fullPathName = addFileNameSuffix(requirePath)
    return path.join(path.dirname(filename), fullPathName)
  } else {
    const resultFile = path.join(process.cwd(), 'node_modules', requirePath)
    // 是文件夹
    if (isDirectory(resultFile)) {
      return path.resolve(resultFile, './index.js')
    }
    // 是文件
    return path.join(process.cwd(), 'node_modules', `${requirePath}.js`)
  }
}

module.exports = {
  isRelativePath,
  isAbsolutePath,
  transformPath,
  addFileNameSuffix
}