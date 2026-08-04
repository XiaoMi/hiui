#!/usr/bin/env node

import process from 'node:process'
import { runLegacyContractPageCommand } from './lib/legacy-contract-page-generator.mjs'

runLegacyContractPageCommand({
  argv: process.argv.slice(2),
  commandName: 'typical-page:legacy:new',
  intent: 'new',
}).catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page:legacy:new] ${message}`)
  process.exit(1)
})
