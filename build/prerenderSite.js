const path = require('path')
const fs = require('fs')
const {
  createSPAServer,
  Renderer,
  getRelativePathFromUrl,
  writeFile
} = require('@bougiel/puppeteer-prerenderer')

const dist = path.resolve(__dirname, '../dist')
const port = 4200

const server = createSPAServer({
  path: dist,
  port,
  base: '/hiui',
  callback: renderUrls
})

async function renderUrls () {
  const renderer = new Renderer()
  await renderer.init()
  for (const url of getUrls()) {
    await render(url, renderer)
  }
  server.close()
  console.log(`render completed.`)
  process.exit(0)
}

async function render (url, renderer) {
  const content = await renderer.renderToString(url)
  const dir = getRelativePathFromUrl(url).replace('/hiui', '')
  writeFile(path.join(dist, dir), content)
  console.log(`rendered ${url}`)
}

function getUrls () {
  const urls = [...getComponentUrls(), ...getTemplateUrls(), ...getExtraUrls()]
  const zh = urls.map(v => `http://localhost:${port}/hiui/zh-CN/${v}`)
  const en = urls.map(v => `http://localhost:${port}/hiui/en-US/${v}`)
  return [...zh, ...en]
}

function getComponentUrls () {
  const compPath = path.resolve(__dirname, '../docs/zh-CN/components')
  return fs.readdirSync(compPath).map(v => `docs/${v.replace('.md', '')}`)
}

function getTemplateUrls () {
  const tempPath = path.resolve(__dirname, '../docs/zh-CN/templates')
  return fs.readdirSync(tempPath).map(v => `templates/${v.replace('.md', '')}`)
}

function getExtraUrls () {
  return [
    'docs/quick-start',
    'docs/template',
    'docs/theme',
    'docs/i18n',
    'docs/changelog'
  ]
}
