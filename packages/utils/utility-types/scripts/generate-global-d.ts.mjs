/**
 * 从 src/types.ts 派生 global.d.ts（declare global 形式），单源维护
 * types.ts 中需用 // <global-d.ts-source> 与 // </global-d.ts-source> 包裹待导出块
 * 运行：node scripts/generate-global-d.ts.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const typesPath = path.join(root, 'src', 'types.ts')
const outPath = path.join(root, 'global.d.ts')

const content = fs.readFileSync(typesPath, 'utf8')
const startMarker = '// <global-d.ts-source>'
const endMarker = '// </global-d.ts-source>'
const startIdx = content.indexOf(startMarker)
const endIdx = content.indexOf(endMarker)
if (startIdx === -1) throw new Error(`Missing ${startMarker} in types.ts`)
if (endIdx === -1) throw new Error(`Missing ${endMarker} in types.ts`)
const block = content.slice(startIdx + startMarker.length, endIdx).trim()

const lines = block.split('\n')
const inner = []
for (const line of lines) {
  if (/^\s*export type\s+/.test(line)) {
    inner.push(line.replace(/^\s*export type\s+/, '  type '))
  } else if (line.trim() === '') {
    inner.push('')
  } else if (line.trim().startsWith('//')) {
    inner.push('  ' + line)
  } else {
    // 续行相对 declare global 多缩进一级，统一补 2 格
    inner.push('  ' + line)
  }
}

const header = `/// <reference types="react" />
/** Generated from src/types.ts. Use either this (global) or main entry (import), not both in same project. */

declare global {
`
const footer = `}

export {}
`

const output = header + inner.join('\n') + '\n' + footer

fs.writeFileSync(outPath, output, 'utf8')
console.log('Generated global.d.ts from src/types.ts')
