#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import path from 'node:path'

const projectRoot = process.cwd()
const bridgeScript = path.resolve(projectRoot, '.local-context/hiui-design/scripts/init-i18n.mjs')

const result = spawnSync(process.execPath, [bridgeScript, '--target', projectRoot, '--sync-only'], {
  stdio: 'inherit',
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 0)
