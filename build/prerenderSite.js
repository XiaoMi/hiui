const path = require('path')
const fs = require('fs-extra')

const dist = path.resolve(__dirname, '../dist')
const tempContent = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const main = () => {
  const allPaths = getAllPaths()
  allPaths.forEach(relativePath => {
    const absolutePath = path.join(dist, relativePath, 'index.html')
    fs.ensureFileSync(absolutePath)
    fs.writeFileSync(absolutePath, tempContent)
  })
}

main()

/**
 * get all prerender needed urls.
 * @returns {string[]}
 */
function getAllPaths () {
  const urls = [...getComponentPaths(), ...getDesignPaths(), ...getTemplatePaths(), ...getExtraPaths()]
  const zh = urls.map(v => `/zh-CN/${v}`)
  const en = urls.map(v => `/en-US/${v}`)
  return [...zh, ...en]
}

/**
 * get components dir pages.
 * @returns {string[]}
 */
function getComponentPaths () {
  const compPath = path.resolve(__dirname, '../docs/zh-CN/components')
  return fs.readdirSync(compPath).map(v => `docs/${v.replace('.mdx', '')}`)
}

/**
 * get designs dir pages.
 * @returns {string[]}
 */
function getDesignPaths () {
  const compPath = path.resolve(__dirname, '../docs/zh-CN/designs')
  return fs.readdirSync(compPath).map(v => `designs/${v.replace('.mdx', '')}`)
}

/**
 * get templates dir pages.
 * @returns {string[]}
 */
function getTemplatePaths () {
  const tempPath = path.resolve(__dirname, '../docs/zh-CN/templates')
  return fs.readdirSync(tempPath).map(v => `templates/${v.replace('.md', '')}`)
}

/**
 * get non-regular pages
 * @returns {string[]}
 */
function getExtraPaths () {
  return ['', 'docs/quick-start', 'docs/template', 'docs/theme', 'docs/i18n', 'docs/changelog']
}
