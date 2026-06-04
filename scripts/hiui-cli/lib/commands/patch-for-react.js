const path = require('path')
const { runPatchForReact } = require('../patch-for-react')
const { outputJson, writeStdout, outputError } = require('../utils')

function formatPatchReport (result) {
  const lines = []
  const mode = result.dryRun ? '（预览，未写入）' : ''

  lines.push(`React 19 兼容包 @hi-ui/patch-for-react${mode}`)
  lines.push(`项目目录: ${result.projectRoot}`)
  lines.push(`包管理器: ${result.packageManager}`)
  lines.push('')

  if (result.packageJson.skipped) {
    lines.push('package.json: 依赖已存在，无需修改')
  } else if (result.packageJson.changes.length) {
    lines.push('package.json 变更:')
    result.packageJson.changes.forEach((change) => {
      const from = change.from ? change.from : '(新增)'
      lines.push(`  - ${change.name} [${change.field}]: ${from} → ${change.to}`)
    })
  } else {
    lines.push('package.json: 无变更')
  }

  lines.push('')

  if (result.entry.alreadyPresent) {
    lines.push(`入口文件: ${result.entry.entryPath}`)
    lines.push('  已包含 import，跳过注入')
  } else if (result.entry.inserted) {
    const relative =
      path.relative(result.projectRoot, result.entry.entryPath) ||
      result.entry.entryPath
    lines.push(`入口文件: ${relative}`)
    lines.push(`  已在顶部添加: ${result.entry.importLine}`)
  }

  if (result.install) {
    lines.push('')
    lines.push(`已执行安装: ${result.install.command}`)
  } else if (!result.dryRun && !result.packageJson.skipped) {
    lines.push('')
    lines.push('请执行 npm install 或 yarn 安装依赖（已使用 --skip-install 跳过自动安装）')
  }

  if (!result.dryRun) {
    lines.push('')
    lines.push('说明: 请确保入口文件顶部 import 在其他业务 import 之前执行。')
  }

  return lines.join('\n')
}

function runPatchForReactCommand (options) {
  let result

  try {
    result = runPatchForReact(options)
  } catch (err) {
    if (
      err.code === 'PACKAGE_JSON_NOT_FOUND' ||
      err.code === 'ENTRY_NOT_FOUND' ||
      err.code === 'INSTALL_FAILED'
    ) {
      outputError(
        {
          code: err.code,
          message: err.message,
          ...(err.command ? { command: err.command } : {}),
        },
        options.format
      )
      return
    }
    throw err
  }

  if (options.format === 'json') {
    outputJson(result)
    return
  }

  writeStdout(formatPatchReport(result))
}

module.exports = {
  runPatchForReactCommand,
  formatPatchReport,
}
