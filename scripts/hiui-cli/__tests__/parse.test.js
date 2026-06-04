const assert = require('assert')
const fs = require('fs')
const path = require('path')
const {
  parseComponentListFromIndex,
  parsePropsFromMarkdown,
  parseDescriptionFromMarkdown,
} = require('../lib/parse')

const alertFixture = fs.readFileSync(
  path.join(__dirname, 'fixtures/alert.md'),
  'utf8'
)

assert.strictEqual(
  parseDescriptionFromMarkdown(alertFixture),
  '作用于页面的内容区域的提示，非触发类信息'
)

const indexText = `
## Component Docs
- https://xiaomi.github.io/hiui/llms/alert.md
- https://xiaomi.github.io/hiui/components/button.md
`

assert.deepStrictEqual(parseComponentListFromIndex(indexText), [
  'alert',
  'button',
])

const parsed = parsePropsFromMarkdown(alertFixture)
assert.strictEqual(parsed.groups.length, 1)
assert.strictEqual(parsed.groups[0].name, 'Alert')
assert.strictEqual(parsed.groups[0].props.length, 3)
assert.strictEqual(parsed.groups[0].props[0].name, 'type')
assert.strictEqual(parsed.groups[0].props[1].required, true)
assert.strictEqual(parsed.groups[0].props[1].name, 'title')

console.log('parse.test.js: ok')
