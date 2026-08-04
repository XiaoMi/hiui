#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runScopedDoctor } from './lib/doctor-scope-filter.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))

runScopedDoctor({
  argv: process.argv.slice(2),
  doctorScript: path.join(scriptDir, 'typical-page-doctor.mjs'),
  scriptName: 'typical-page-doctor-integration.mjs',
  scope: 'integration',
})
