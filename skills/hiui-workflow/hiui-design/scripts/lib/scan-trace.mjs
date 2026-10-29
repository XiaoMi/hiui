import fs from 'node:fs'
import path from 'node:path'

const TRACE_FILE_ENV = 'HIUI_DESIGN_SCAN_TRACE_FILE'

function normalizeString(value) {
  return String(value || '').trim()
}

function resolveTraceFilePath() {
  const tracePath = normalizeString(process.env[TRACE_FILE_ENV])
  return tracePath ? path.resolve(tracePath) : ''
}

export function recordScanEvent(name, details = {}) {
  const traceFilePath = resolveTraceFilePath()
  if (!traceFilePath) return

  const payload = {
    name: normalizeString(name) || 'unknown',
    timestamp: new Date().toISOString(),
    pid: process.pid,
    details: details && typeof details === 'object' ? details : {},
  }

  fs.mkdirSync(path.dirname(traceFilePath), { recursive: true })
  fs.appendFileSync(traceFilePath, `${JSON.stringify(payload)}\n`, 'utf8')
}
