// build:esm / build:bundle:esm / build:types 完成后运行
// 扫描 lib/group-context/bridge，在包根目录生成扁平别名（form.js、bundle.js 等）
// 便于与 changeset publish 一致、无需 publishConfig.directory
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

/**
 * 扫描 bridge 目录，返回同时存在 .js 与 .d.ts 的 basename 列表（排除 index）
 * @param {string} bridgeDir
 * @returns {string[]}
 */
function scanBridgeDir(bridgeDir) {
  const names = []
  const entries = fs.readdirSync(bridgeDir, { withFileTypes: true })
  for (const ent of entries) {
    if (!ent.isFile()) continue
    const base = path.basename(ent.name, path.extname(ent.name))
    if (base === 'index') continue
    const jsPath = path.join(bridgeDir, `${base}.js`)
    const dtsPath = path.join(bridgeDir, `${base}.d.ts`)
    if (fs.existsSync(jsPath) && fs.existsSync(dtsPath)) {
      names.push(base)
    }
  }
  return names
}

function writeAlias(outDir, name, fromSubpath) {
  const jsFile = path.join(outDir, `${name}.js`)
  const dtsFile = path.join(outDir, `${name}.d.ts`)
  fs.writeFileSync(jsFile, `export * from '${fromSubpath}.js'\n`, 'utf8')
  fs.writeFileSync(dtsFile, `export * from '${fromSubpath}';\n`, 'utf8')
}

const bridgeDir = path.join(root, 'lib', 'group-context', 'bridge')
const bundleJs = path.join(root, 'lib', 'group-context', 'bundle.js')
const bundleDts = path.join(root, 'lib', 'group-context', 'bundle.d.ts')
// 别名输出到包根目录，与 package.json 同级，便于直接 npm pack / changeset publish
const outDir = root

if (!fs.existsSync(bridgeDir)) {
  console.warn('build-alias: lib/group-context/bridge not found, run build:esm first')
  process.exit(1)
}

const bridgeNames = scanBridgeDir(bridgeDir)
if (bridgeNames.length === 0) {
  console.warn('build-alias: no bridge entries found (expect .js + .d.ts pairs, exclude index)')
  process.exit(1)
}

let count = 0
for (const name of bridgeNames) {
  writeAlias(outDir, name, `./lib/group-context/bridge/${name}`)
  count += 1
}

if (fs.existsSync(bundleJs) && fs.existsSync(bundleDts)) {
  writeAlias(outDir, 'bundle', './lib/group-context/bundle')
  count += 1
}

console.log('build-alias: wrote', count, 'alias files to package root (esm + types)')
