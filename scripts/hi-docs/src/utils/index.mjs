import Path from 'path'
import FS from 'fs-extra'
import URL from 'url'
import { root } from 'mdast-builder'
import { unified } from 'unified'
import stringWidth from 'string-width'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'

export const __filename = URL.fileURLToPath(import.meta.url)

export const __dirname = Path.dirname(__filename)

export const rootDir = Path.join(__dirname, '../../../../')
export const outputPath = Path.join(__dirname, '../../lib')

export const log = (...args) => {
  console.info(`[hi-docs]`, ...args)
}

export const writeFileAsync = async (path, content) => {
  await FS.mkdirp(Path.dirname(path))
  await FS.writeFile(path, content)
}

export const readFileAsync = async (path, basePath) => {
  if (basePath) {
    path = Path.join(basePath, path)
  }
  return await (await FS.readFile(path)).toString('utf-8')
}

export const cleanCreateDir = async (dir) => {
  await FS.remove(dir)
  await FS.mkdirp(dir)
}

export const markdownRender = (markdown) => {
  const remark = unified()
    .use(remarkGfm, { stringLength: stringWidth })
    .use(remarkStringify, { stringLength: stringWidth })

  return remark.stringify(root(markdown))
}
