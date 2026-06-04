const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { upgradePackageJsonObject } = require('../lib/migrate/package-json')
const { replaceClassNames } = require('../lib/migrate/replace-class')
const { runMigrate, resolveMigration } = require('../lib/migrate')

const fixtureRoot = path.join(__dirname, 'fixtures/migrate-sample')

const pkgFixture = JSON.parse(
  fs.readFileSync(path.join(fixtureRoot, 'package.json'), 'utf8')
)

const { pkg, changes } = upgradePackageJsonObject(pkgFixture, '^5.0.0')

assert.strictEqual(pkg.dependencies['@hi-ui/button'], '^5.0.0')
assert.strictEqual(pkg.dependencies['@hi-ui/core'], '^5.0.0')
assert.strictEqual(pkg.dependencies['@hi-ui/hiui'], '^5.0.0')
assert.strictEqual(pkg.devDependencies['@hi-ui/icons'], '^5.0.0')
assert.strictEqual(pkg.devDependencies['@hi-ui/hi-build'], '4.1.2')
assert.strictEqual(pkg.overrides['@hi-ui/core'], '^5.0.0')
assert.strictEqual(pkg.dependencies.react, '^17.0.1')
assert.ok(changes.length >= 4)

const scss = fs.readFileSync(path.join(fixtureRoot, 'src/App.scss'), 'utf8')
const replaced = replaceClassNames(scss)

assert.strictEqual(replaced.count, 2)
assert.ok(replaced.content.includes('.hi-v5-button'))
assert.ok(replaced.content.includes("[class^='hi-v5-']"))
assert.ok(!replaced.content.includes('.hi-v4'))

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hiui-migrate-'))
const tempProject = path.join(tempDir, 'project')

function copyDir (src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(from, to)
    } else {
      fs.copyFileSync(from, to)
    }
  })
}

copyDir(fixtureRoot, tempProject)

assert.throws(
  () => resolveMigration('3', '5'),
  (err) => err.code === 'UNSUPPORTED_MIGRATION'
)

const migration = resolveMigration('4', '5')
assert.strictEqual(migration.version, '^5.0.0')

const result = runMigrate({
  from: '4',
  to: '5',
  path: tempProject,
  dryRun: false,
})

assert.strictEqual(result.from, '4')
assert.strictEqual(result.to, '5')

assert.strictEqual(result.packageJson.length, 1)
assert.strictEqual(result.classNames.totalReplacements, 2)

const upgradedPkg = JSON.parse(
  fs.readFileSync(path.join(tempProject, 'package.json'), 'utf8')
)
assert.strictEqual(upgradedPkg.dependencies['@hi-ui/button'], '^5.0.0')

const upgradedScss = fs.readFileSync(
  path.join(tempProject, 'src/App.scss'),
  'utf8'
)
assert.ok(upgradedScss.includes('.hi-v5-button'))

fs.rmSync(tempDir, { recursive: true, force: true })

console.log('migrate.test.js: ok')
