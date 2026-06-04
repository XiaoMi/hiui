const { fetchComponentList } = require('../docs')
const { outputJson, writeStdout } = require('../utils')

async function runList (options) {
  const components = await fetchComponentList(options.baseUrl, {
    timeout: options.timeout,
    refresh: options.refresh,
  })

  if (options.format === 'json') {
    outputJson({
      baseUrl: options.baseUrl,
      count: components.length,
      components: components.map((name) => ({
        name,
        docUrl: require('../constants').getComponentDocUrl(name, options.baseUrl),
      })),
    })
    return
  }

  components.forEach((name) => {
    writeStdout(name)
  })
}

module.exports = {
  runList,
}
