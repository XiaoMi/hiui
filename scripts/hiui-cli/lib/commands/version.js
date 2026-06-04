const { getCliVersionInfo } = require('../version')
const { outputJson, writeStdout } = require('../utils')

function runVersion (options) {
  const info = getCliVersionInfo()

  if (options.format === 'json') {
    outputJson(info)
    return
  }

  writeStdout(info.version)
}

module.exports = {
  runVersion,
}
