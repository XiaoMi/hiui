const { Command } = require('commander')
const { DEFAULT_BASE_URL } = require('./constants')
const { toComponentSlug } = require('./utils')
const { runList } = require('./commands/list')
const { runDoc } = require('./commands/doc')
const { runInfo } = require('./commands/info')
const { runMigrateCommand } = require('./commands/migrate')

const pkg = require('../package.json')

function createProgram () {
  const program = new Command()

  program
    .name('hiui')
    .description(
      'HiUI CLI for AI agents — query component documentation and props from HiUI llms endpoints'
    )
    .version(pkg.version)
    .option(
      '--base-url <url>',
      'HiUI docs base URL',
      process.env.HIUI_DOCS_BASE_URL || DEFAULT_BASE_URL
    )
    .option('--format <type>', 'Output format: text | json', 'text')
    .option('--timeout <ms>', 'HTTP timeout in milliseconds', '30000')

  program
    .command('list')
    .description('List all available HiUI components')
    .option('--refresh', 'Refresh component list cache')
    .action(async function () {
      const opts = getSharedOptions(this)
      await runList({ ...opts, refresh: !!this.opts().refresh })
    })

  program
    .command('doc <component>')
    .description('Fetch full markdown documentation for a component')
    .action(async function (component) {
      const opts = getSharedOptions(this)
      await runDoc(component, opts)
    })

  program
    .command('info <component>')
    .description('Fetch component props API from documentation')
    .action(async function (component) {
      const opts = getSharedOptions(this)
      await runInfo(component, opts)
    })

  program
    .command('url <component>')
    .description('Print the llms documentation URL for a component')
    .action(function (component) {
      const opts = getSharedOptions(this)
      const { getComponentDocUrl } = require('./constants')
      const slug = toComponentSlug(component)
      const url = getComponentDocUrl(slug, opts.baseUrl)

      if (opts.format === 'json') {
        const { outputJson } = require('./utils')
        outputJson({ component: slug, url })
        return
      }

      const { writeStdout } = require('./utils')
      writeStdout(url)
    })

  program
    .command('migrate <from> <to>')
    .description(
      'Migrate HiUI project between major versions (e.g. hiui migrate 4 5)'
    )
    .option('--path <dir>', 'Project root directory', '.')
    .option('--dry-run', 'Preview changes without writing files')
    .option('--deps-only', 'Only upgrade package.json dependencies')
    .option('--class-only', 'Only replace legacy class name prefixes in project files')
    .action(function (from, to) {
      const opts = getSharedOptions(this)
      const cmdOpts = this.opts()
      runMigrateCommand({
        from,
        to,
        path: cmdOpts.path,
        dryRun: !!cmdOpts.dryRun,
        depsOnly: !!cmdOpts.depsOnly,
        classOnly: !!cmdOpts.classOnly,
        format: opts.format,
      })
    })

  return program
}

function getSharedOptions (command) {
  const root = command.parent || command
  const opts = root.opts()
  const format = opts.format === 'json' ? 'json' : 'text'

  return {
    baseUrl: opts.baseUrl,
    format,
    timeout: Number(opts.timeout) || 30000,
  }
}

function runCli (argv) {
  const program = createProgram()
  program.parse(argv || process.argv)
}

if (require.main === module) {
  runCli()
}

module.exports = {
  createProgram,
  runCli,
}
