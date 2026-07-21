#!/usr/bin/env node

import process from 'node:process'
import { runLegacyLightweightSurface } from './lib/legacy-lightweight-surface.mjs'

runLegacyLightweightSurface({
  argv: process.argv.slice(2),
  commandName: 'typical-page:legacy:rewrite',
  intent: 'rewrite',
}).catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page:legacy:rewrite] ${message}`)
  process.exit(1)
})

