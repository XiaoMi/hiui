import process from 'node:process'
import {
  getLegacyLightweightChainSummary,
  getLegacyNewCommand,
  getLegacyRewriteCommand,
  getLightweightAnalyticsCommand,
  getLightweightChainSummary,
  getLightweightGenerateCommand,
  getLightweightVerifyCommand,
  getLightweightVisualCommand,
} from './lightweight-pagegen-guidance.mjs'

const LEGACY_COMMAND_GUIDANCE = {
  'typical-page:plan-page-task': {
    replacement: `${getLegacyLightweightChainSummary()}（legacy 主树默认走双入口）；标准 pagegen 项目继续使用 ${getLightweightChainSummary()}`,
    reason:
      '旧 typical-page 主链依赖 project contract / preflight / preview-ready 的重流程，不再是当前项目推荐生成路径。',
  },
  'typical-page:start-page': {
    replacement: `${getLegacyNewCommand()}；重写已有旧页时改用 ${getLegacyRewriteCommand()}`,
    reason: 'legacy 主树的公开入口已经收敛成 template-first 双入口，不再要求使用者手工理解 start-page scaffold。',
  },
  'typical-page:write-contract': {
    replacement: `${getLegacyNewCommand()}；若是已有旧页重构则改用 ${getLegacyRewriteCommand()}`,
    reason: 'legacy 主树默认不再把 write-contract 暴露成公开生成前提，而是直接走标准组件实例化。',
  },
  'typical-page:preflight': {
    replacement: `legacy 双入口会在内部执行必要轻验收；标准 pagegen 项目继续使用 ${getLightweightVerifyCommand()}`,
    reason: 'preflight 不再是 legacy 主树普通典型页的公开步骤。',
  },
  'typical-page:finalize-page': {
    replacement: `legacy 双入口直接返回 ready|blocked；标准 pagegen 项目则使用 ${getLightweightVerifyCommand()}，必要时再补 ${getLightweightVisualCommand()}`,
    reason: 'finalize-page 不再是默认公开收口步骤。',
  },
  'typical-page:preview-ready': {
    replacement: `legacy 双入口默认不暴露 preview-ready；标准 pagegen 项目只在高价值页型追加 ${getLightweightVisualCommand()}`,
    reason: 'preview-ready 不再作为普通典型页的公开主流程命令。',
  },
}

export function getLegacyPagegenGuidance(commandName) {
  return LEGACY_COMMAND_GUIDANCE[commandName] || null
}

export function emitLegacyPagegenDeprecationWarning(commandName) {
  if (process.env.HIUI_DESIGN_SUPPRESS_DEPRECATION_WARNING === '1') {
    return
  }

  const guidance = getLegacyPagegenGuidance(commandName)
  if (!guidance) {
    return
  }

  const lines = [
    `[hiui-design][deprecated] ${commandName} 属于旧 .local-context/hiui-design 页面生成主链。`,
    `[hiui-design][deprecated] ${guidance.reason}`,
    `[hiui-design][deprecated] 当前项目推荐改用：${guidance.replacement}`,
    '[hiui-design][deprecated] 该提示不影响 host-integration / rules-only 接入脚本；这里只针对旧页面生成主链入口。',
  ]

  process.stderr.write(`${lines.join('\n')}\n`)
}
