import { readFileAsync } from './utils/index.mjs'

export async function parseReadMe(componentPaths) {
  return await Promise.all(
    componentPaths.map(async (pathInfo) => {
      const readme = await getComponentReadMe(pathInfo.dir)

      // @Meta readme
      return { ...pathInfo, readme }
    })
  ).catch(console.error)
}

async function getComponentReadMe(baseURL) {
  const content = await readFileAsync('hi-docs.config.mdx', baseURL)
  return content
}
