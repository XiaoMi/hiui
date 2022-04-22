import Path from 'path'
import globAsync from 'fast-glob'
import { readFileAsync } from './utils/index.mjs'

export async function parseStories(componentPaths) {
  const componentInfo = await Promise.all(
    componentPaths.map(async (pathInfo) => {
      const stories = await getComponentStories(pathInfo)
      return { ...pathInfo, stories }
    })
  ).catch(console.error)

  return componentInfo
}

async function getComponentStories({ dir: baseURL, name: componentName }) {
  const storiesBaseURL = Path.join(baseURL, 'stories')

  // 读取
  let storyFiles = await findComponentStoryFiles(storiesBaseURL)
  // 处理顺序
  storyFiles = storyFiles.filter((filepath) => !filepath.includes('index.stories'))
  // 处理替换
  const stories = await getStoriesByComponent(storyFiles, storiesBaseURL, componentName)
  // 返回
  return stories
}

async function findComponentStoryFiles(baseUrl) {
  const tsFiles = await globAsync('*.stories.@(tsx)', {
    cwd: baseUrl,
  })

  return tsFiles
}

async function getStoriesByComponent(storyFiles, basePath, componentName) {
  return Promise.all(
    storyFiles.map(async (filepath, index) => {
      const [, storyName] = /(\w+)\.stories\.tsx$/.exec(filepath)
      const content = await readFileAsync(filepath, basePath)

      // @Meta Story
      return {
        filepath: filepath,
        name: storyName,
        content: replaceStory(content, componentName),
        ...getAnnotationInfo(content),
      }
    })
  )
}

function replaceStory(content, componentName) {
  content = content.replace('../src', `@hi-ui/${componentName.toLowerCase()}`)
  content = content.replace(/export\sconst\s(\w+)\s=/, (raw, $1) => `export default ${$1};\n${raw}`)

  return content
}

function getAnnotationInfo(content) {
  // /**
  //  * @title 基础用法
  //  * @desc 无间隔水平排列
  //  */
  let titleResult = /\s+\*\s@title\s+(.+)\n/.exec(content)
  if (titleResult) {
    titleResult = titleResult[1]
  }

  let descResult = /\s+\*\s@desc\s+(\w+)/.exec(content)
  if (descResult) {
    descResult = descResult[1]
  }

  return { title: titleResult, description: descResult }
}
