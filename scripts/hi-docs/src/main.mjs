import Path from 'path'
import { findUI } from './find-ui.mjs'
import { mergeDocs } from './merge-docs.mjs'
import { parseReadMe } from './parse-readme.mjs'
import { parseStories } from './parse-stories.mjs'
import { log, rootDir } from './utils/index.mjs'

const sourcePath = Path.join(rootDir, 'packages/ui')

export async function main() {
  const componentPaths = await findUI(sourcePath)
  log(`Success in finding components. total: ${componentPaths.length}.`)

  let componentInfo = await parseReadMe(componentPaths)
  log(`Success in parsing all README.md files.`)

  componentInfo = await parseStories(componentInfo)
  log(`Success in parsing all component stories.`)

  await mergeDocs(componentInfo)
  // console.log(componentInfo)
  return componentInfo
}

main().catch(console.error)
