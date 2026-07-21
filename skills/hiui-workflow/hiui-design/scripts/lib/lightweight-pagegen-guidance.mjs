export const LIGHTWEIGHT_PAGEGEN_SURFACE = Object.freeze([
  'typical-page:init',
  'typical-page:generate',
  'typical-page:analytics',
  'typical-page:verify',
  'typical-page:verify:visual',
])

export function getLightweightChainSummary() {
  return 'typical-page:init -> typical-page:generate/analytics -> typical-page:verify -> typical-page:verify:visual'
}

export function getLegacyLightweightChainSummary() {
  return 'typical-page:legacy:new | typical-page:legacy:rewrite'
}

export function getLegacyNewCommand(pagePath = '<page-or-dir>') {
  return `pnpm typical-page:legacy:new -- --page ${pagePath} --change "<task>"`
}

export function getLegacyRewriteCommand(pagePath = '<page-or-dir>') {
  return `pnpm typical-page:legacy:rewrite -- --page ${pagePath} --change "<task>"`
}

export function getLightweightGenerateCommand(pagePath = '<page-dir>') {
  return `pnpm typical-page:generate -- --page ${pagePath} --change "<task>"`
}

export function getLightweightAnalyticsCommand(pagePath = '<page-dir>') {
  return `pnpm typical-page:analytics -- --page ${pagePath} --change "<task>"`
}

export function getLightweightVerifyCommand(pagePath = '<page-dir>') {
  return `pnpm typical-page:verify -- --page ${pagePath}`
}

export function getLightweightVisualCommand(pageType = '<page-type>') {
  return `pnpm typical-page:verify:visual -- --page ${pageType}`
}

export function buildLegacyContractMigrationMessage(detail, options = {}) {
  const pagePath = options.pagePath || '<page-dir>'
  const pageType = options.pageType || '<page-type>'
  const commands = [getLightweightVerifyCommand(pagePath)]

  if (options.includeVisual !== false) {
    commands.push(`${getLightweightVisualCommand(pageType)} (仅在高价值页型或明显视觉风险时追加)`)
  }

  return [
    detail,
    `当前轻量主链只保留 ${getLightweightChainSummary()}。`,
    `请先运行 ${commands.join('；')} 校验当前页面。`,
    '若仓内仍依赖 legacy contract / preview-ready 元数据，请联系维护者迁移或补齐 legacy contract 资产，不要回退到 doctor / preflight / finalize-page。',
  ].join(' ')
}

export function getManifestUsageOrderLines() {
  return [
    `1. 先运行 \`${LIGHTWEIGHT_PAGEGEN_SURFACE[0]}\``,
    '2. 先读生成原则',
    '3. 再判页型；普通典型页走 `typical-page:generate`，数据可视化走 `typical-page:analytics`',
    '4. 命中已有页型后再命中默认 `nodeId` 和核心 P0',
    '5. 再从示例页开始改',
    `6. 最后运行 \`${LIGHTWEIGHT_PAGEGEN_SURFACE[3]}\`；高价值页面再按需补 \`${LIGHTWEIGHT_PAGEGEN_SURFACE[4]}\``,
  ]
}
