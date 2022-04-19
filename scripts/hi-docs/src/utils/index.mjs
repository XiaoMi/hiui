import Path from 'path'
import FS from 'fs-extra'
import URL from 'url'

export const __filename = URL.fileURLToPath(import.meta.url)

export const __dirname = Path.dirname(__filename)

export const rootDir = Path.join(__dirname, '../../../../')
export const outputPath = Path.join(__dirname, '..', 'components')

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
