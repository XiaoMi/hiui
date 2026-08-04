import fs from 'node:fs/promises'
import path from 'node:path'

function normalizeRelativePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//u, '')
}

function resolveTargetPath(targetRoot, value) {
  if (!value) return ''
  return path.isAbsolute(value) ? value : path.join(targetRoot, value)
}

async function pathExists(filePath) {
  if (!filePath) return false
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function isNonLocalUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return false
  try {
    const url = new URL(raw)
    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
    const loopbackLike =
      ['localhost', '127.0.0.1', '0.0.0.0', '::1', 'host.docker.internal'].includes(hostname) ||
      hostname.endsWith('.localhost') ||
      /^127(?:\.\d{1,3}){3}$/.test(hostname) ||
      /(^|\.)127(?:\.\d{1,3}){3}(\.|$)/.test(hostname)
    return !loopbackLike && url.protocol !== 'file:'
  } catch {
    return false
  }
}

function hasViewport(value) {
  return Number.isFinite(Number(value?.width)) && Number.isFinite(Number(value?.height))
}

export async function runVisualEvidenceGate({ targetRoot, runtimeEvidence = null, visualEvidence = '', profile = 'preview' }) {
  const runtimeScreenshot = typeof runtimeEvidence?.screenshotPath === 'string' ? runtimeEvidence.screenshotPath : ''
  const candidate = visualEvidence || runtimeScreenshot
  const absolutePath = resolveTargetPath(targetRoot, candidate)
  const exists = await pathExists(absolutePath)
  const issues = []

  if (!exists) {
    issues.push('visual evidence screenshot is required and must exist')
  }

  if (profile === 'delivery') {
    if (!runtimeScreenshot) {
      issues.push('delivery visual evidence must be referenced by runtime evidence screenshotPath')
    }
    if (visualEvidence && runtimeScreenshot && normalizeRelativePath(visualEvidence) !== normalizeRelativePath(runtimeScreenshot)) {
      issues.push('delivery visual evidence must match runtime evidence screenshotPath')
    }
    if (!isNonLocalUrl(runtimeEvidence?.url)) {
      issues.push('delivery visual evidence must come from a non-local runtime evidence url')
    }
    if (!hasViewport(runtimeEvidence?.viewport)) {
      issues.push('delivery visual evidence must include viewport width and height')
    }
  }

  return {
    ok: issues.length === 0,
    path: candidate ? normalizeRelativePath(candidate) : '',
    exists,
    source: visualEvidence ? 'explicit' : runtimeScreenshot ? 'runtime-evidence' : 'missing',
    viewport: runtimeEvidence?.viewport || null,
    runtimeUrl: runtimeEvidence?.url || '',
    issues,
    reason: issues[0] || '',
  }
}
