const path = require('path')
const { runMigrate } = require('../migrate')
const { outputJson, writeStdout, outputError } = require('../utils')

function formatMigrateReport (result) {
  const lines = []
  const mode = result.dryRun ? '（预览，未写入）' : ''

  lines.push(`HiUI V${result.from} → V${result.to} 迁移${mode}`)
  lines.push(`项目目录: ${result.rootDir}`)
  lines.push(`目标版本: ${result.version}`)
  lines.push('')

  if (result.packageJson.length) {
    lines.push(`已更新 package.json (${result.packageJson.length} 个):`)
    result.packageJson.forEach((item) => {
      const relative = path.relative(result.rootDir, item.file) || item.file
      lines.push(`  - ${relative}`)
      item.changes.forEach((change) => {
        const field = change.field ? ` [${change.field}]` : ''
        lines.push(`      ${change.name}: ${change.from} → ${change.to}${field}`)
      })
    })
    lines.push('')
  } else {
    lines.push('package.json: 未发现需要升级的 @hi-ui/* 依赖')
    lines.push('')
  }

  if (result.classNames.updatedFiles.length) {
    lines.push(
      `已替换样式类名 .hi-v${result.from} → .hi-v${result.to} (${result.classNames.totalReplacements} 处, ${result.classNames.updatedFiles.length} 个文件):`
    )
    result.classNames.updatedFiles.forEach((item) => {
      const relative = path.relative(result.rootDir, item.file) || item.file
      lines.push(`  - ${relative} (${item.replacements})`)
    })
  } else {
    lines.push('样式类名: 未发现 .hi-v4')
  }

  if (!result.dryRun) {
    lines.push('')
    lines.push('请执行 npm install 或 yarn 安装新版本依赖。')
  }

  return lines.join('\n')
}

function runMigrateCommand (options) {
  let result

  try {
    result = runMigrate({
      from: options.from,
      to: options.to,
      path: options.path,
      dryRun: options.dryRun,
      upgradeDeps: !options.classOnly,
      replaceClass: !options.depsOnly,
    })
  } catch (err) {
    if (err.code === 'UNSUPPORTED_MIGRATION') {
      outputError(
        { code: err.code, message: err.message },
        options.format
      )
      return
    }
    throw err
  }

  const hasChanges =
    result.packageJson.length > 0 || result.classNames.updatedFiles.length > 0

  if (options.format === 'json') {
    outputJson({
      ...result,
      hasChanges,
    })
    return
  }

  writeStdout(formatMigrateReport(result))

  if (!hasChanges && !result.dryRun) {
    process.exitCode = 0
  }
}

module.exports = {
  runMigrateCommand,
  formatMigrateReport,
}
