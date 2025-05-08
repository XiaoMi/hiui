const fs = require('fs')
const path = require('path')

function findPackageJsonFiles(dir) {
  const results = []
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results.push(...findPackageJsonFiles(filePath))
    } else if (file === 'package.json') {
      results.push(filePath)
    }
  }

  return results
}

// 查找所有 package.json 文件
const packageFiles = findPackageJsonFiles('packages')

packageFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8')
  const pkg = JSON.parse(content)
  let modified = false

  // 处理 dependencies
  if (pkg.dependencies) {
    Object.keys(pkg.dependencies).forEach((dep) => {
      if (dep.startsWith('@hi-ui/env')) {
        pkg.dependencies[dep] = 'workspace:~'
        modified = true
      }
    })
  }

  if (modified) {
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
    console.log(`Updated ${file}`)
  }
})
