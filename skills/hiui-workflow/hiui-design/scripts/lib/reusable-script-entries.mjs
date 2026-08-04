function buildBaseScripts(lineSuffix) {
  return {
    "typical-page:apply": `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs"${lineSuffix}`,
    "typical-page:apply:no-install": `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --no-install${lineSuffix}`,
    "typical-page:doctor": `node ".local-context/hiui-design/scripts/typical-page-doctor.mjs"${lineSuffix}`,
    "typical-page:doctor:integration": `node ".local-context/hiui-design/scripts/typical-page-doctor-integration.mjs"${lineSuffix}`,
    "typical-page:audit-onboarding": `node ".local-context/hiui-design/scripts/audit-project-onboarding.mjs"${lineSuffix}`,
    "typical-page:clean-stale-outputs": `node ".local-context/hiui-design/scripts/typical-page-clean-stale-outputs.mjs"${lineSuffix}`,
    "typical-page:adapter-gate": `node ".local-context/hiui-design/scripts/typical-page-adapter-gate.mjs"${lineSuffix}`,
    "typical-page:dom-geometry-gate": `node ".local-context/hiui-design/scripts/typical-page-dom-geometry-gate.mjs"${lineSuffix}`,
    "typical-page:slot-gate": `node ".local-context/hiui-design/scripts/typical-page-slot-gate.mjs"${lineSuffix}`,
    "typical-page:designer-setup": `node ".local-context/hiui-design/scripts/setup-for-designers.mjs"${lineSuffix}`,
  }
}

function buildHostIntegrationScripts(lineSuffix) {
  return {
    ...buildBaseScripts(lineSuffix),
    "typical-page:apply:host-assets": `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode host-integration${lineSuffix}`,
    "typical-page:apply:host-assets:force": `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode host-integration --force${lineSuffix}`,
    "typical-page:init": `node ".local-context/hiui-design/core/generators/init.mjs"`,
    "typical-page:generate": `node ".local-context/hiui-design/core/generators/generate.mjs"`,
    "typical-page:analytics": `node ".local-context/hiui-design/core/generators/analytics.mjs"`,
    "typical-page:verify": `node ".local-context/hiui-design/core/verify/verify-lite.mjs"`,
    "typical-page:verify:visual": `node ".local-context/hiui-design/core/verify/verify-visual.mjs"`,
    "typical-page:preflight-new-project": `node ".local-context/hiui-design/scripts/preflight-new-project.mjs"${lineSuffix}`,
    "typical-page:capabilities": `node ".local-context/hiui-design/scripts/typical-page-capabilities.mjs"${lineSuffix}`,
    "typical-page:list-assets": `node ".local-context/hiui-design/scripts/typical-page-list-assets.mjs"${lineSuffix}`,
    "typical-page:inspect-asset": `node ".local-context/hiui-design/scripts/typical-page-inspect-asset.mjs"${lineSuffix}`,
    "typical-page:add-asset": `node ".local-context/hiui-design/scripts/typical-page-add-asset.mjs"${lineSuffix}`,
    "typical-page:diff-asset": `node ".local-context/hiui-design/scripts/typical-page-diff-asset.mjs"${lineSuffix}`,
    "typical-page:update-asset": `node ".local-context/hiui-design/scripts/typical-page-update-asset.mjs"${lineSuffix}`,
    "typical-page:doctor:gate": `node ".local-context/hiui-design/scripts/typical-page-doctor-gate.mjs"${lineSuffix}`,
    "typical-page:contract-gate": `node ".local-context/hiui-design/scripts/typical-page-contract-gate.mjs"${lineSuffix}`,
    "typical-page:archetype-gate": `node ".local-context/hiui-design/scripts/typical-page-archetype-gate.mjs"${lineSuffix}`,
    "typical-page:source-gate": `node ".local-context/hiui-design/scripts/typical-page-source-gate.mjs"${lineSuffix}`,
    "typical-page:candidate-gate": `node ".local-context/hiui-design/scripts/typical-page-candidate-gate.mjs"${lineSuffix}`,
    "typical-page:ci:gate": `node ".local-context/hiui-design/scripts/typical-page-ci-gate.mjs"${lineSuffix}`,
    "typical-page:translation-map": `node ".local-context/hiui-design/scripts/generate-translation-map.mjs"${lineSuffix}`,
    "typical-page:preview-ready": `node ".local-context/hiui-design/scripts/typical-page-preview-ready.mjs"${lineSuffix}`,
    "typical-page:record-usage": `node ".local-context/hiui-design/scripts/record-usage.mjs"${lineSuffix}`,
    "typical-page:runtime-smoke": `node ".local-context/hiui-design/scripts/typical-page-runtime-smoke.mjs"${lineSuffix}`,
    "typical-page:render-final-report": `node ".local-context/hiui-design/scripts/render-final-report.mjs"${lineSuffix}`,
    "typical-page:i18n:init": `node ".local-context/hiui-design/scripts/init-i18n.mjs"${lineSuffix}`,
    "typical-page:images:init": `node ".local-context/hiui-design/scripts/init-project-images.mjs"${lineSuffix}`,
    "typical-page:designer-setup:host-assets": `node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode host-integration${lineSuffix}`,
    "typical-page:designer-setup:host-assets:force": `node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode host-integration --force${lineSuffix}`,
  }
}

function addReferenceAssetScripts(scripts, lineSuffix) {
  scripts["typical-page:apply:reference-assets"] = `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode rules-only${lineSuffix}`
  scripts["typical-page:apply:reference-assets:force"] = `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode rules-only --force${lineSuffix}`
  scripts["typical-page:designer-setup:reference-assets"] = `node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode rules-only${lineSuffix}`
  scripts["typical-page:designer-setup:reference-assets:force"] = `node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode rules-only --force${lineSuffix}`
  return scripts
}

function buildRulesOnlyScripts(lineSuffix) {
  return addReferenceAssetScripts(buildHostIntegrationScripts(lineSuffix), lineSuffix)
}

function buildLegacyMinimalScripts(lineSuffix) {
  return {
    ...buildBaseScripts(lineSuffix),
    "typical-page:apply:legacy": `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode legacy-host-compatible${lineSuffix}`,
    "typical-page:light-plan": `node ".local-context/hiui-design/scripts/typical-page-light-plan.mjs"${lineSuffix}`,
    "typical-page:light-readiness": `node ".local-context/hiui-design/scripts/typical-page-light-readiness.mjs"${lineSuffix}`,
    "typical-page:light-rollback": `node ".local-context/hiui-design/scripts/typical-page-light-rollback.mjs"${lineSuffix}`,
    "typical-page:legacy:init": `node ".local-context/hiui-design/scripts/typical-page-legacy-init.mjs"`,
    "typical-page:legacy:new": `node ".local-context/hiui-design/scripts/typical-page-legacy-new.mjs"${lineSuffix}`,
    "typical-page:legacy:rewrite": `node ".local-context/hiui-design/scripts/typical-page-legacy-rewrite.mjs"${lineSuffix}`,
    "typical-page:legacy:verify": `node ".local-context/hiui-design/scripts/typical-page-legacy-verify.mjs"${lineSuffix}`,
    "typical-page:legacy:accept": `node ".local-context/hiui-design/scripts/typical-page-legacy-accept.mjs"${lineSuffix}`,
    "typical-page:designer-setup:legacy": `node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode legacy-host-compatible${lineSuffix}`,
  }
}

function buildLegacyWorkbenchScripts(lineSuffix) {
  return addReferenceAssetScripts({
    ...buildHostIntegrationScripts(lineSuffix),
    ...buildLegacyMinimalScripts(lineSuffix),
    "typical-page:apply:legacy:workbench": `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode legacy-host-compatible --sync-profile workbench${lineSuffix}`,
  }, lineSuffix)
}

export function getReusableScripts(line = "", options = {}) {
  const lineSuffix = line ? ` --line ${line}` : ""
  const mode = typeof options === 'string' ? options : options?.mode
  const syncProfile = typeof options === 'string' ? '' : options?.syncProfile

  if (mode === 'legacy-host-compatible') {
    return syncProfile === 'workbench'
      ? buildLegacyWorkbenchScripts(lineSuffix)
      : buildLegacyMinimalScripts(lineSuffix)
  }

  if (mode === 'rules-only') {
    return buildRulesOnlyScripts(lineSuffix)
  }

  return buildHostIntegrationScripts(lineSuffix)
}
