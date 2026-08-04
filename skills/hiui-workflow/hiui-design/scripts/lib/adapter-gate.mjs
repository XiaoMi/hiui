import fs from 'node:fs/promises'
import path from 'node:path'

export const DEFAULT_HOST_CONTRACT_RELATIVE_PATH = '.local-context/hiui-design/host-contract.json'
export const REQUIRED_LEGACY_ADAPTERS = ['request', 'message', 'permission', 'route', 'theme']

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(filePath) {
  if (!(await pathExists(filePath))) return null
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

function adapterHasEvidence(adapter) {
  return Boolean(adapter?.evidence || adapter?.facts || adapter?.verifiedAt || adapter?.source === 'runtime-capture')
}

function issue(code, message, adapter = '', severity = 'error') {
  return { code, message, adapter, severity }
}

export function evaluateAdapterGate({ hostContract, profile = 'preview' }) {
  const issues = []
  if (!hostContract || typeof hostContract !== 'object') {
    issues.push(issue('host-contract-missing', 'host contract is required for legacy adapter gate'))
  } else {
    if (hostContract.schemaVersion !== 'host-contract.v1') {
      issues.push(issue('invalid-host-contract-schema', 'host contract schemaVersion must be host-contract.v1'))
    }
    if (hostContract.mode !== 'legacy-host-compatible') {
      issues.push(issue('invalid-host-contract-mode', 'host contract mode must be legacy-host-compatible'))
    }
    for (const adapterName of REQUIRED_LEGACY_ADAPTERS) {
      const adapter = hostContract.adapters?.[adapterName]
      const status = String(adapter?.status || '').trim()
      if (status !== 'ready' && status !== 'not-required') {
        issues.push(issue('adapter-not-ready', `${adapterName} adapter must be ready or not-required; current status=${status || 'missing'}`, adapterName))
        continue
      }
      if (profile === 'delivery' && status === 'ready' && !adapterHasEvidence(adapter)) {
        issues.push(issue('adapter-evidence-missing', `${adapterName} adapter ready status requires evidence for delivery acceptance`, adapterName))
      }
    }
  }

  const blockingIssues = profile === 'delivery' ? issues : issues.filter((item) => item.code === 'adapter-not-ready')
  return {
    ok: blockingIssues.length === 0,
    issues,
    blockingIssues,
  }
}

export async function runAdapterGate({ targetRoot = process.cwd(), hostContractPath = DEFAULT_HOST_CONTRACT_RELATIVE_PATH, profile = 'preview' } = {}) {
  const resolvedPath = path.isAbsolute(hostContractPath) ? hostContractPath : path.join(targetRoot, hostContractPath)
  const hostContract = await readJsonIfExists(resolvedPath)
  const result = evaluateAdapterGate({ hostContract, profile })
  return {
    ...result,
    hostContractPath: path.isAbsolute(hostContractPath) ? hostContractPath : hostContractPath.replace(/\\/g, '/'),
    profile,
  }
}
