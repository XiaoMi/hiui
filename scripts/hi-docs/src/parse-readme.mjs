import { readFileAsync } from './utils/index.mjs'

export async function parseReadMe(componentPaths) {
  return await Promise.all(
    componentPaths.map(async (pathInfo) => {
      const readme = await getComponentReadMe(pathInfo.dir)
      const result = /#\s(.+)/.exec(readme)
      let title = ''
      if (result && result[1]) {
        title = result[1]
      }

      // @Meta readme
      return { ...pathInfo, readme, title }
    })
  ).catch(console.error)
}

async function getComponentReadMe(baseURL) {
  const content = await readFileAsync('hi-docs.config.mdx', baseURL)
  return content
}
