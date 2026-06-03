const { resolveComponentDoc } = require('../docs')
const {
  parsePropsFromMarkdown,
  formatPropsAsText,
} = require('../parse')
const { outputJson, writeStdout, outputError } = require('../utils')

async function runInfo (componentName, options) {
  try {
    const { url, markdown, component } = await resolveComponentDoc(
      componentName,
      options.baseUrl,
      { timeout: options.timeout }
    )

    const parsed = parsePropsFromMarkdown(markdown)

    if (options.format === 'json') {
      outputJson({
        component,
        url,
        description: parsed.description,
        props: parsed.groups,
      })
      return
    }

    const titleMatch = markdown.match(/^#\s+(.+)$/m)
    const heading = titleMatch ? titleMatch[1].trim() : component

    writeStdout(`# ${heading}`)
    writeStdout('')
    writeStdout(formatPropsAsText(parsed))
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
  runInfo,
}
