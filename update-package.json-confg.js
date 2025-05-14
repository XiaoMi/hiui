const fs = require('fs')
const glob = require('glob')

// 获取所有 package.json 文件
const packageFiles = glob.sync('packages/**/package.json', {
  ignore: ['packages/**/node_modules/**', 'packages/**/dist/**'],
})

packageFiles.forEach((file) => {
  const content = JSON.parse(fs.readFileSync(file, 'utf8'))

  // 如果有 main 和 module 字段，但没有 exports 字段，则添加 exports
  if (content.main && content.module && !content.exports) {
    content.exports = {
      '.': {
        require: './lib/cjs/index.js',
        default: './lib/esm/index.js',
        types: './lib/types/index.d.ts',
      },
    }
  }
  // 如果已有 exports 字段，但没有 types，则添加 types
  else if (content.exports && content.exports['.'] && !content.exports['.'].types) {
    content.exports['.'].types = './lib/types/index.d.ts'
  }

  // 写回文件
  fs.writeFileSync(file, JSON.stringify(content, null, 2) + '\n')
})

console.log('Updated all package.json files')
