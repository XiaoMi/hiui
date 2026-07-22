import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readTargetPackageJson(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return null
  }

  const raw = await fs.readFile(packageJsonPath, 'utf8')
  return JSON.parse(raw)
}

async function detectPackageManager(projectRoot, pkg) {
  const packageManager = typeof pkg?.packageManager === 'string' ? pkg.packageManager : ''

  if (packageManager.startsWith('pnpm@')) return 'pnpm'
  if (packageManager.startsWith('yarn@')) return 'yarn'
  if (packageManager.startsWith('npm@')) return 'npm'
  if (packageManager.startsWith('bun@')) return 'bun'

  const lockfileManagers = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['package-lock.json', 'npm'],
    ['bun.lockb', 'bun'],
    ['bun.lock', 'bun'],
  ]

  for (const [filename, manager] of lockfileManagers) {
    if (await pathExists(path.join(projectRoot, filename))) {
      return manager
    }
  }

  return 'npm'
}

function getRunScriptArgs(manager, scriptName) {
  switch (manager) {
    case 'npm':
    case 'pnpm':
    case 'bun':
      return [manager, ['run', scriptName]]
    case 'yarn':
      return ['yarn', [scriptName]]
    default:
      return ['npm', ['run', scriptName]]
  }
}

function runPackageScript({ command, args, projectRoot }) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
  })

  if (result.error) {
    return {
      status: 'failed',
      exitCode: result.status ?? null,
      stdout: result.stdout ?? '',
      stderr: result.error.message,
      errorMessage: result.error.message,
    }
  }

  return {
    status: result.status === 0 ? 'passed' : 'failed',
    exitCode: result.status ?? null,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    errorMessage: '',
  }
}

export async function runProjectEngineeringGate({ projectRoot }) {
  const pkg = await readTargetPackageJson(projectRoot)
  if (!pkg) {
    return {
      status: 'warn',
      packageManager: 'npm',
      checks: [
        {
          id: 'package-json',
          label: 'package.json',
          blocking: false,
          status: 'missing',
          command: '',
          exitCode: null,
          stdout: '',
          stderr: '',
          errorMessage: `Missing package.json under ${projectRoot}`,
        },
      ],
    }
  }

  const scripts = pkg.scripts ?? {}
  const manager = await detectPackageManager(projectRoot, pkg)
  const checks = []

  for (const definition of [
    {
      id: 'build',
      label: 'build',
      blocking: true,
      missingStatus: 'missing',
    },
    {
      id: 'lint',
      label: 'lint',
      blocking: false,
      missingStatus: 'missing',
    },
  ]) {
    if (!scripts[definition.id]) {
      checks.push({
        ...definition,
        status: definition.missingStatus,
        command: '',
        exitCode: null,
        stdout: '',
        stderr: '',
        errorMessage: '',
      })
      continue
    }

    const [command, args] = getRunScriptArgs(manager, definition.id)
    const result = runPackageScript({ command, args, projectRoot })
    checks.push({
      ...definition,
      ...result,
      command: `${command} ${args.join(' ')}`,
    })
  }

  const blockingFailure = checks.some((item) => item.blocking && item.status === 'failed')
  if (blockingFailure) {
    return {
      status: 'failed',
      packageManager: manager,
      checks,
    }
  }

  const nonBlockingFailure = checks.some((item) => !item.blocking && item.status === 'failed')
  const missingChecks = checks.some((item) => item.status === 'missing')

  return {
    status: nonBlockingFailure || missingChecks ? 'warn' : 'passed',
    packageManager: manager,
    checks,
  }
}
