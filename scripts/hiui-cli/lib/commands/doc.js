const { resolveComponentDoc } = require('../docs')
const { outputJson, writeStdout, outputError } = require('../utils')

async function runDoc (componentName, options) {
  try {
    const { url, markdown, component } = await resolveComponentDoc(
      componentName,
      options.baseUrl,
      { timeout: options.timeout }
    )

    if (options.format === 'json') {
      outputJson({
        component,
        url,
        doc: markdown,
      })
      return
    }

    writeStdout(markdown)
  } catch (err) {
    if (err.code === 'COMPONENT_NOT_FOUND') {
      outputError(
        {
          code: err.code,
          message: err.message,
          suggestions: err.suggestions,
          url: err.url,
        },
        options.format
      )
      return
    }

    outputError(
      {
        code: 'FETCH_FAILED',
        message: err.message,
        url: err.url,
      },
      options.format
    )
  }
}

module.exports = {
  runDoc,
}
