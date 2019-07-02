const path = require('path')
const fs = require('fs')
const {
  createSPAServer,
  renderUrlsToString,
  getRelativePathFromUrl,
  writeFile
} = require('@bougiel/puppeteer-prerenderer')

const dist = path.resolve(__dirname, '../dist')
const port = 4200
const baseRoute = '/hiui'

const server = createSPAServer({
  dist,
  port,
  base: baseRoute,
  onCreated: renderUrls
})

async function renderUrls() {
  renderUrlsToString({
    urls: getUrls(),
    onItemRendered: render,
    onFinished() {
      server.close()
      process.exit(0)
    }
  })
}

async function render(content, url) {
  const dir = getRelativePathFromUrl(url).replace(baseRoute, '')
  writeFile(path.join(dist, dir), content)
}

/**
 * get all prerender needed urls.
 * @returns {string[]}
 */
function getUrls() {
  const urls = [...getComponentUrls(), ...getTemplateUrls(), ...getExtraUrls()]
  const zh = urls.map(v => `http://localhost:${port}/hiui/zh-CN/${v}`)
  const en = urls.map(v => `http://localhost:${port}/hiui/en-US/${v}`)
  return [...zh, ...en]
}

/**
 * get components dir pages.
 * @returns {string[]}
 */
function getComponentUrls() {
  const compPath = path.resolve(__dirname, '../docs/zh-CN/components')
  return fs.readdirSync(compPath).map(v => `docs/${v.replace('.mdx', '')}`)
}

/**
 * get templates dir pages.
 * @returns {string[]}
 */
function getTemplateUrls() {
  const tempPath = path.resolve(__dirname, '../docs/zh-CN/templates')
  return fs.readdirSync(tempPath).map(v => `templates/${v.replace('.md', '')}`)
}

function getDesignUrls() {
  const desPath = path.resolve(__dirname, '../docs/zh-CN/designs')
  return fs.readdirSync(desPath).map(v => `designs/${v.replace('.mdx', '')}`)
}

/**
 * get non-regular pages
 * @returns {string[]}
 */
function getExtraUrls() {
  return ['', 'docs/quick-start', 'docs/template', 'docs/theme', 'docs/i18n', 'docs/changelog']
}
