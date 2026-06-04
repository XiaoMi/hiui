const fs = require('fs')

function readPackageJson (filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  return { raw, data: JSON.parse(raw) }
}

function detectIndent (raw) {
  const match = raw.match(/^(\s+)"/m)
  return match ? match[1] : '  '
}

function writePackageJson (filePath, data, raw) {
  const indent = detectIndent(raw)
  const content = `${JSON.stringify(data, null, indent)}\n`
  fs.writeFileSync(filePath, content, 'utf8')
  return content
}

module.exports = {
  readPackageJson,
  writePackageJson,
  detectIndent,
}
