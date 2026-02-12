// build:esm / build:bundle:esm / build:types 完成后运行
// 在包根生成
// fields/* ==> basic、enhance、semantic
// components/* ==> image-preview、upload-bridge
// bundle.js(.d.ts) ==> bundle.js(.d.ts)
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const CATEGORIES = ['basic', 'enhance', 'semantic']
// 与 src/index.tsx 中 export 的 components 对齐
const COMPONENTS = ['image-preview', 'upload-bridge']

function scanFieldToCategory(fieldsDir) {
  const fieldToCategory = {}
  for (const category of CATEGORIES) {
    const categoryPath = path.join(fieldsDir, category)
    if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) continue
    const names = fs.readdirSync(categoryPath, { withFileTypes: true })
    for (const ent of names) {
      if (!ent.isDirectory()) continue
      const indexJs = path.join(categoryPath, ent.name, 'index.js')
      if (fs.existsSync(indexJs)) fieldToCategory[ent.name] = category
    }
  }
  return fieldToCategory
}

const fieldsDir = path.join(root, 'lib', 'fields')
const bundleJs = path.join(root, 'lib', 'bundle.js')
const bundleDts = path.join(root, 'lib', 'bundle.d.ts')
const outDir = root
const fieldsOutDir = path.join(outDir, 'fields')
const componentsOutDir = path.join(outDir, 'components')

if (!fs.existsSync(fieldsDir)) {
  console.warn('build-alias: lib/fields not found, run build:esm first')
  process.exit(1)
}

const fieldToCategory = scanFieldToCategory(fieldsDir)
if (Object.keys(fieldToCategory).length === 0) {
  console.warn('build-alias: no fields found under lib/fields/{basic,enhance,semantic}')
  process.exit(1)
}

fs.mkdirSync(fieldsOutDir, { recursive: true })

let count = 0
for (const [name, category] of Object.entries(fieldToCategory)) {
  const fromJs = `../lib/fields/${category}/${name}/index.js`
  const fromDts = `../lib/fields/${category}/${name}`
  const jsFile = path.join(fieldsOutDir, `${name}.js`)
  const dtsFile = path.join(fieldsOutDir, `${name}.d.ts`)
  fs.writeFileSync(jsFile, `export * from '${fromJs}'\n`, 'utf8')
  fs.writeFileSync(dtsFile, `export * from '${fromDts}';\n`, 'utf8')
  count += 1
}

// components：与 fields 同级，放 image-preview、upload-bridge
const libComponentsDir = path.join(root, 'lib', 'components')
if (fs.existsSync(libComponentsDir)) {
  fs.mkdirSync(componentsOutDir, { recursive: true })
  for (const name of COMPONENTS) {
    const indexJs = path.join(libComponentsDir, name, 'index.js')
    const indexDts = path.join(libComponentsDir, name, 'index.d.ts')
    if (fs.existsSync(indexJs) && fs.existsSync(indexDts)) {
      const jsFile = path.join(componentsOutDir, `${name}.js`)
      const dtsFile = path.join(componentsOutDir, `${name}.d.ts`)
      fs.writeFileSync(jsFile, `export * from '../lib/components/${name}/index.js'\n`, 'utf8')
      fs.writeFileSync(dtsFile, `export * from '../lib/components/${name}';\n`, 'utf8')
      count += 1
    }
  }
}

if (fs.existsSync(bundleJs) && fs.existsSync(bundleDts)) {
  const bundleJsOut = path.join(outDir, 'bundle.js')
  const bundleDtsOut = path.join(outDir, 'bundle.d.ts')
  fs.writeFileSync(bundleJsOut, `export * from './lib/bundle.js'\n`, 'utf8')
  fs.writeFileSync(bundleDtsOut, `export * from './lib/bundle';\n`, 'utf8')
  count += 1
}

console.log(
  'build-alias: wrote',
  count,
  'alias targets to package root (fields/* + components/* + bundle)'
)
