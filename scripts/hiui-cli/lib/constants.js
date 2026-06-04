const DEFAULT_BASE_URL = 'https://xiaomi.github.io/hiui'

const LLMS_INDEX_PATH = '/llms.txt'
const LLMS_DOC_PATH = '/llms'

function getLlmsIndexUrl (baseUrl) {
  return `${normalizeBaseUrl(baseUrl)}${LLMS_INDEX_PATH}`
}

function getComponentDocUrl (componentName, baseUrl) {
  return `${normalizeBaseUrl(baseUrl)}${LLMS_DOC_PATH}/${componentName}.md`
}

function normalizeBaseUrl (baseUrl) {
  return String(baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')
}

module.exports = {
  DEFAULT_BASE_URL,
  LLMS_INDEX_PATH,
  LLMS_DOC_PATH,
  getLlmsIndexUrl,
  getComponentDocUrl,
  normalizeBaseUrl,
}
