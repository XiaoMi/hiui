const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { addPatchDependencies } = require('../lib/patch-for-react/package-json')
const { injectPatchImport, findDirectiveInsertIndex } = require('../lib/patch-for-react/entry')

const pkg = addPatchDependencies(
  { name: 'app', dependencies: { react: '^19.0.0' } },
  { patchVersion: '^5.0.0' }
)

assert.strictEqual(pkg.pkg.dependencies['@hi-ui/patch-for-react'], '^5.0.0')
assert.strictEqual(pkg.pkg.dependencies['@hi-ui/react-compat'], undefined)
assert.strictEqual(pkg.changes.length, 1)

const withUseClient = injectPatchImport(
  "'use client'\n\nimport React from 'react'\n"
)
assert.ok(withUseClient.inserted)
assert.ok(withUseClient.content.indexOf("'use client'") === 0)
assert.ok(
  withUseClient.content.indexOf("import '@hi-ui/patch-for-react'") >
    withUseClient.content.indexOf("'use client'")
)

const duplicate = injectPatchImport(
  "import '@hi-ui/patch-for-react'\nimport App from './App'\n"
)
assert.strictEqual(duplicate.alreadyPresent, true)

const lines = ['#!/usr/bin/env node', "'use strict'", '', 'import x']
assert.strictEqual(findDirectiveInsertIndex(lines), 3)

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hiui-patch-'))
const project = path.join(tempDir, 'app')
fs.mkdirSync(path.join(project, 'src'), { recursive: true })
fs.writeFileSync(
  path.join(project, 'package.json'),
  JSON.stringify({ name: 'demo', version: '1.0.0' }, null, 2)
)
fs.writeFileSync(
  path.join(project, 'src', 'index.tsx'),
  "import React from 'react'\n"
)

const { runPatchForReact } = require('../lib/patch-for-react')
const result = runPatchForReact({
  path: project,
  dryRun: false,
  skipInstall: true,
})

assert.strictEqual(result.packageJson.changes.length, 1)
assert.strictEqual(result.entry.inserted, true)

const entry = fs.readFileSync(path.join(project, 'src', 'index.tsx'), 'utf8')
assert.ok(entry.startsWith("import '@hi-ui/patch-for-react'"))

fs.rmSync(tempDir, { recursive: true, force: true })

console.log('patch-for-react.test.js: ok')
