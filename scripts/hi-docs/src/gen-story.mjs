import Path from 'path'
import globAsync from 'fast-glob'
import { log, outputPath, readFileAsync, rootDir, writeFileAsync } from './utils/index.mjs'

import { unified } from 'unified'
import remarkStringify from 'remark-stringify'
import stringWidth from 'string-width'
import remarkGfm from 'remark-gfm'
import { root, code } from 'mdast-builder'

const sourcePath = Path.join(rootDir, 'packages/ui')

async function findComponentStoryFiles() {
  const tsFiles = await globAsync('**/stories/*.stories.@(tsx)', {
    cwd: Path.join(sourcePath),
  })

  return tsFiles
}

const replaceStory = (content, componentName) => {
  content = content.replace('../src', `@hi-ui/${componentName.toLowerCase()}`)
  content = content.replace(/export\sconst\s(\w+)\s=/, (raw, $1) => `export default ${$1};\n${raw}`)

  return content
}

const getAnnotationInfo = (content) => {
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

  return { title: titleResult, desc: descResult }
}

async function groupStoriesByComponent(componentFiles) {
  const componentInfo = {}

  for await (const relativePath of componentFiles) {
    const [, componentName, storyName] = /\/?(.+)\/stories\/(.+)\.stories\.tsx$/.exec(relativePath)

    const content = await readFileAsync(relativePath, sourcePath)

    // const sortMap = {}

    if (storyName === 'index') {
      //   const regexp = /export\s+\*\s+from\s+'\.\/(.+)\.stories'/g
      //   const regexpIterator = content.matchAll(regexp)
      //   const arr = Array.from(regexpIterator)
      //   arr.forEach(([, name], index) => {
      //     sortMap[name] = index
      //   })
      continue
    }

    if (!componentInfo[componentName]) {
      componentInfo[componentName] = {}
    }

    componentInfo[componentName][storyName] = {
      // sort: sortMap[storyName],
      group: componentName,
      name: storyName,
      path: relativePath,
      content: replaceStory(content, componentName),
      ...getAnnotationInfo(content),
    }
  }

  // console.log('[ componentInfo ] >', componentInfo)
  return componentInfo
}

function storyRender(doc) {
  return [
    // heading(3, text(doc.displayName)),
    // text(doc.description),
    code('tsx', doc.content),
  ]
}

function markdownRender(doc) {
  const remark = unified()
    .use(remarkGfm, { stringLength: stringWidth })
    .use(remarkStringify, { stringLength: stringWidth })

  const table = root(storyRender(doc))

  return remark.stringify(table)
}

function writeComponentInfoFiles(componentInfo) {
  Object.keys(componentInfo).forEach((componentName) => {
    const stories = componentInfo[componentName]
    Object.keys(stories).forEach((key) => {
      const story = stories[key]
      const filePath = Path.join(outputPath, componentName, story.name + '.tsx')
      writeFileAsync(filePath, story.content)
    })
  })
}

async function main() {
  const componentFiles = await findComponentStoryFiles()
  // console.log(componentFiles)
  // 分组
  // 1. 按组件分组
  // 2. 以键值对形式：组件: stories
  // 读取
  // 1. 读取所有 story 内容
  // 2. 按顺序生成示例代码
  const parsedInfo = await groupStoriesByComponent(componentFiles)

  // 写入
  // Markdown渲染
  // Inject stories
  // 合并
  log('Render markdown table...')
  // console.log(parsedInfo)
  Object.keys(parsedInfo).forEach((componentName) => {
    // 遍历 stories 解析 markdown
    // 生成每个组件的 markdown 内容
    const stories = parsedInfo[componentName]
    Object.keys(stories).forEach((key) => {
      const story = stories[key]
      story.markdown = markdownRender(story)
    })
  })

  // 写入生成 markdown 文件
  writeComponentInfoFiles(parsedInfo)
  return parsedInfo
}

export default main

main().catch(console.error)
