const { fetchText } = require('./fetch')
const {
  getLlmsIndexUrl,
  getComponentDocUrl,
  normalizeBaseUrl,
} = require('./constants')
const { parseComponentListFromIndex } = require('./parse')
const { suggestComponents, toComponentSlug } = require('./utils')

let componentListCache = null

async function fetchComponentList (baseUrl, options = {}) {
  if (!options.refresh && componentListCache) {
    return componentListCache
  }

  const url = getLlmsIndexUrl(baseUrl)
  const text = await fetchText(url, options)
  componentListCache = parseComponentListFromIndex(text)
  return componentListCache
}

async function fetchComponentDoc (componentName, baseUrl, options = {}) {
  const url = getComponentDocUrl(componentName, baseUrl)
  const markdown = await fetchText(url, options)
  return { url, markdown, component: componentName }
}

async function resolveComponentDoc (inputName, baseUrl, options = {}) {
  const slug = toComponentSlug(inputName)
  const url = getComponentDocUrl(slug, baseUrl)

  try {
    const markdown = await fetchText(url, options)
    return { url, markdown, component: slug }
  } catch (err) {
    if (err.statusCode !== 404) {
      throw err
    }

    const list = await fetchComponentList(baseUrl, options)
    const suggestions = suggestComponents(slug, list)
    const error = new Error(`Component "${inputName}" not found`)
    error.code = 'COMPONENT_NOT_FOUND'
    error.suggestions = suggestions
    error.url = url
    throw error
  }
}

function clearCache () {
  componentListCache = null
}

module.exports = {
  fetchComponentList,
  fetchComponentDoc,
  resolveComponentDoc,
  clearCache,
  normalizeBaseUrl,
}
