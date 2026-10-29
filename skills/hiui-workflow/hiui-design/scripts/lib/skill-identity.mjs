import fs from 'node:fs/promises'
import path from 'node:path'

export const SKILL_PUBLIC_NAME = 'hiui-design'
export const SKILL_CONTEXT_DIRNAME = 'hiui-design'
export const LEGACY_SKILL_CONTEXT_DIRNAMES = ['hiui5-design']
export const SKILL_CONTEXT_DIR = path.posix.join('.local-context', SKILL_CONTEXT_DIRNAME)
export const APPLY_STATE_FILENAME = 'HIUI_DESIGN_APPLY_STATE.json'
export const APPLY_PROGRESS_FILENAME = 'HIUI_DESIGN_APPLY_PROGRESS.json'
export const PROJECT_PAGE_TASK_STATUS_FILENAME = 'PROJECT_PAGE_TASK_STATUS.json'
export const PAGE_TYPE_CAPABILITY_REPORT_FILENAME = 'PAGE_TYPE_CAPABILITY_REPORT.json'
export const AI_GENERATION_READY_CONTEXT_FILENAME = 'AI_GENERATION_READY_CONTEXT.json'
export const PROJECT_HOST_CONTRACT_FILENAME = 'PROJECT_HOST_CONTRACT.json'
export const PROJECT_STATE_SUMMARY_FILENAME = 'HIUI_DESIGN_PROJECT_STATE_SUMMARY.json'
export const REMOTE_RUNTIME_SOURCE_STATUS_FILENAME = 'REMOTE_RUNTIME_SOURCE_STATUS.json'
export const APPLY_STATE_RELATIVE_PATH = path.posix.join(
  SKILL_CONTEXT_DIR,
  'outputs',
  APPLY_STATE_FILENAME
)
export const APPLY_PROGRESS_RELATIVE_PATH = path.posix.join(
  SKILL_CONTEXT_DIR,
  'outputs',
  APPLY_PROGRESS_FILENAME
)
export const PROJECT_PAGE_TASK_STATUS_RELATIVE_PATH = path.posix.join(
  SKILL_CONTEXT_DIR,
  'outputs',
  PROJECT_PAGE_TASK_STATUS_FILENAME
)
export const PROJECT_STATE_SUMMARY_RELATIVE_PATH = path.posix.join(
  SKILL_CONTEXT_DIR,
  'outputs',
  PROJECT_STATE_SUMMARY_FILENAME
)
export const PROJECT_HOST_CONTRACT_RELATIVE_PATH = path.posix.join(
  SKILL_CONTEXT_DIR,
  'outputs',
  PROJECT_HOST_CONTRACT_FILENAME
)
export const REMOTE_RUNTIME_SOURCE_STATUS_RELATIVE_PATH = path.posix.join(
  SKILL_CONTEXT_DIR,
  'outputs',
  REMOTE_RUNTIME_SOURCE_STATUS_FILENAME
)

export function getContextPath(...segments) {
  return segments.length > 0 ? path.posix.join(SKILL_CONTEXT_DIR, ...segments) : SKILL_CONTEXT_DIR
}

export function getContextScriptPath(scriptName) {
  return getContextPath('scripts', scriptName)
}

export function getContextDocPath(...segments) {
  return getContextPath('docs', ...segments)
}

export function getContextOutputPath(...segments) {
  return getContextPath('outputs', ...segments)
}

export function getContextVendorPath(filename) {
  return getContextPath('vendor', filename)
}

export function getProjectContextPath(targetRoot, contextDirName, ...segments) {
  return path.join(targetRoot, '.local-context', contextDirName, ...segments)
}

export function resolveProjectContextPath(targetRoot, ...segments) {
  return getProjectContextPath(targetRoot, SKILL_CONTEXT_DIRNAME, ...segments)
}

export function resolveProjectContextPathCandidates(targetRoot, ...segments) {
  return [
    resolveProjectContextPath(targetRoot, ...segments),
    ...LEGACY_SKILL_CONTEXT_DIRNAMES.map((contextDirName) =>
      getProjectContextPath(targetRoot, contextDirName, ...segments)
    ),
  ]
}

export async function resolveExistingProjectContextPath(targetRoot, ...segments) {
  for (const candidate of resolveProjectContextPathCandidates(targetRoot, ...segments)) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      continue
    }
  }

  return resolveProjectContextPath(targetRoot, ...segments)
}

export function toContextVendorFileSpec(filename) {
  return `file:${getContextVendorPath(filename)}`
}

export function toSkillSourceTag(sourcePath) {
  return `${SKILL_PUBLIC_NAME}:${sourcePath}`
}
