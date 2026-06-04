const assert = require('assert')
const { toComponentSlug, suggestComponents } = require('../lib/utils')

assert.strictEqual(toComponentSlug('Alert'), 'alert')
assert.strictEqual(toComponentSlug('BackTop'), 'back-top')
assert.strictEqual(toComponentSlug('check_cascader'), 'check-cascader')
assert.strictEqual(toComponentSlug('CheckCascader'), 'check-cascader')

assert.deepStrictEqual(
  suggestComponents('alet', ['alert', 'avatar', 'button']),
  ['alert', 'avatar', 'button']
)

console.log('utils.test.js: ok')
