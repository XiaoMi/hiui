import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { parseArgs } from './shared.mjs'
import { runGenerate } from './generate.mjs'

const ANALYTICS_PAGE_TYPE = 'data-visualization'

function buildAnalyticsPageTypeError(pageType) {
  return `typical-page:analytics 只支持 ${ANALYTICS_PAGE_TYPE} 页型。收到 --page-type=${pageType || '(empty)'}。若当前任务不是数据可视化页面，请改用 typical-page:generate。`
}

export function normalizeAnalyticsArgs(args = {}) {
  const pageType = String(args['page-type'] || '').trim()

  if (pageType && pageType !== ANALYTICS_PAGE_TYPE) {
    throw new Error(buildAnalyticsPageTypeError(pageType))
  }

  return {
    ...args,
    'page-type': ANALYTICS_PAGE_TYPE,
  }
}

export async function runAnalytics(args = {}) {
  return runGenerate(normalizeAnalyticsArgs(args), {
    commandName: 'typical-page:analytics',
  })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  await runAnalytics(args)
}

const isDirectExecution = (() => {
  if (!process.argv[1]) {
    return false
  }

  try {
    return fs.realpathSync(path.resolve(process.argv[1])) === fs.realpathSync(new URL(import.meta.url))
  } catch {
    return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  }
})()

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
