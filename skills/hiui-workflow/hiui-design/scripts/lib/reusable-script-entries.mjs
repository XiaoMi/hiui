import { getContextScriptPath } from './skill-identity.mjs'

export function getReusableScripts(line = '', options = {}) {
  const {
    includeManagedRuntimePatchScripts = true,
    includeI18nInitScript = false,
  } = options
  const lineSuffix = line ? ` --line ${line}` : ''

  const scripts = {
    'typical-page:ensure': `node "${getContextScriptPath('ensure-in-current-project.mjs')}"${lineSuffix}`,
    'typical-page:apply': `node "${getContextScriptPath('apply-in-current-project.mjs')}"${lineSuffix}`,
    'typical-page:apply:no-install':
      `node "${getContextScriptPath('apply-in-current-project.mjs')}" --no-install${lineSuffix}`,
    'typical-page:legacy-react-compat':
      `node "${getContextScriptPath('legacy-react-compat-autofix.mjs')}"${lineSuffix}`,
    'typical-page:legacy-hiui5-bridge-autofix':
      `node "${getContextScriptPath('legacy-hiui5-bridge-autofix.mjs')}"${lineSuffix}`,
    'typical-page:legacy-mf-shared-contract-autofix':
      `node "${getContextScriptPath('legacy-mf-shared-contract-autofix.mjs')}"${lineSuffix}`,
    'typical-page:managed-mf-host-contract-autofix':
      `node "${getContextScriptPath('managed-mf-host-contract-autofix.mjs')}"${lineSuffix}`,
    'typical-page:doctor':
      `node "${getContextScriptPath('typical-page-doctor.mjs')}"${lineSuffix}`,
    'typical-page:preflight':
      `node "${getContextScriptPath('typical-page-preflight.mjs')}"${lineSuffix}`,
    'typical-page:brief':
      `node "${getContextScriptPath('generation-brief.mjs')}"${lineSuffix}`,
    'typical-page:generate:single':
      `node "${getContextScriptPath('generate-page.mjs')}"${lineSuffix}`,
    'typical-page:execute:non-typical':
      `node "${getContextScriptPath('execute-non-typical-page-task.mjs')}"${lineSuffix}`,
    'typical-page:generate':
      `node "${getContextScriptPath('generate-page-from-brief.mjs')}"${lineSuffix}`,
    'typical-page:integration-preflight':
      `node "${getContextScriptPath('integration-preflight.mjs')}"${lineSuffix}`,
    'typical-page:dependency-isolation-check':
      `node "${getContextScriptPath('dependency-isolation-check.mjs')}"${lineSuffix}`,
    'typical-page:designer-setup':
      `node "${getContextScriptPath('setup-for-designers.mjs')}"${lineSuffix}`,
  }

  if (includeI18nInitScript) {
    scripts['typical-page:i18n:init'] = `node "${getContextScriptPath('init-i18n.mjs')}"`
  }

  if (includeManagedRuntimePatchScripts) {
    scripts['typical-page:runtime-patch'] =
      `node "${getContextScriptPath('apply-runtime-patches.mjs')}"${lineSuffix}`
    scripts['typical-page:react19-runtime-patch'] =
      `node "${getContextScriptPath('apply-react19-runtime-patches.mjs')}"${lineSuffix}`
  }

  return scripts
}
