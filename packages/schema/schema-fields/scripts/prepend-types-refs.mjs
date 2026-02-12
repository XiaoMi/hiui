// build:types 完成后
// 把 /// <reference types="..." /> 写回 lib/types/index.d.ts
// 因为 tsc 不会保留它们

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outFile = path.join(__dirname, '..', 'lib', 'types', 'index.d.ts')
const refs = `/// <reference types="@hi-ui/utility-types/global" />

`
// 这两行先不加了
// <reference types="@hi-ui/schema-types" />
// <reference types="@hi-ui/schema-editable-table/type" />

if (!fs.existsSync(outFile)) {
  console.warn('prepend-types-refs: lib/types/index.d.ts not found, skip')
  process.exit(0)
}

const content = fs.readFileSync(outFile, 'utf8')
if (content.startsWith('/// <reference types=')) {
  process.exit(0)
}
fs.writeFileSync(outFile, refs + content)
