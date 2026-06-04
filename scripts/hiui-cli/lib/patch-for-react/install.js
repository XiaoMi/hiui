const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const { PATCH_PACKAGE } = require('./constants')

function detectPackageManager (projectRoot) {
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn'
  }
  if (fs.existsSync(path.join(projectRoot, 'package-lock.json'))) {
    return 'npm'
  }
  return 'npm'
}

function buildInstallCommand (manager, packages) {
  if (manager === 'yarn') {
    return { command: 'yarn', args: ['add', ...packages] }
  }

  if (manager === 'pnpm') {
    return { command: 'pnpm', args: ['add', ...packages] }
  }

  return { command: 'npm', args: ['install', ...packages, '--save'] }
}

function runInstall (projectRoot, options) {
  const manager = options.packageManager || detectPackageManager(projectRoot)
  const packages = [PATCH_PACKAGE]
  const { command, args } = buildInstallCommand(manager, packages)
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) {
    const error = new Error(
      `${command} install failed with exit code ${result.status || 1}`
    )
    error.code = 'INSTALL_FAILED'
    error.command = `${command} ${args.join(' ')}`
    throw error
  }

  return {
    packageManager: manager,
    command: `${command} ${args.join(' ')}`,
    packages,
  }
}

module.exports = {
  detectPackageManager,
  runInstall,
}
