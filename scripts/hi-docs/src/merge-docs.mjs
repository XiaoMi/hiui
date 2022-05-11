import Path from 'path'
import { heading, html, text } from 'mdast-builder'
import { markdownRender, outputPath, writeFileAsync, cleanCreateDir } from './utils/index.mjs'

export async function mergeDocs(components) {
  return await Promise.all(
    components.map(async (info) => {
      // 元信息合并
      let markdown = mergeStoriesIntoReadme(info.readme, info.stories)
      markdown = mergePropsIntoReadme(markdown, info.props)

      // 写入
      await writeDocs(info, markdown)
    })
  ).catch(console.error)

  // 1 DONE
  // 同步迁移
  // 示例 和 props 替换为注入钩子

  // 3
  // api 解析
  // api props 替换
  // 手动编写 props

  // 按组件文件写入
  // stories
  // index.mdx

  // changelog 提取 单独维护
  // README.zh-CN.md 自动生成
}

function mergeStoriesIntoReadme(readmeMarkdown, stories) {
  const storiesMarkdown = storiesRender(stories)
  return readmeMarkdown.replace('<!-- Inject Stories -->', storiesMarkdown)
}

function mergePropsIntoReadme(readmeMarkdown, props) {
  const propsMarkdown = propsRender(props)
  return readmeMarkdown.replace('<!-- Inject Props -->', propsMarkdown)
}

async function writeDocs(info, markdown) {
  // await cleanCreateDir(outputPath)

  const dist = Path.join(outputPath, info.name)

  await Promise.all([
    // 写入markdown
    writeFileAsync(Path.join(dist, 'index.mdx'), markdown),
    // 写入 stories
    ...info.stories.map(async (story) => {
      await writeFileAsync(Path.join(dist, `./stories/${story.name}.stories.tsx`), story.content)
    }),
    // 写入readme x
    // writeFileAsync(Path.join(outputDir, 'index.mdx'), markdown),
  ])
}

function storiesRender(stories) {
  const markdownConfig = stories.reduce((acc, storyInfo) => {
    const storyBlock = getStoryBlock(storyInfo)
    return acc.concat(storyBlock)
  }, [])

  return markdownRender(markdownConfig)
}

function getStoryBlock(story) {
  return [
    // CodeBlock mdx
    html(`<CodeBlock
  src="${Path.join('stories', story.filepath)}"
  title="${story.title}"
  description="${story.description}"
/>`),
  ]
}

function propsRender(props) {
  const markdownConfig = props.reduce((acc, info) => {
    const block = getPropsBlock(info)
    return acc.concat(block)
  }, [])

  return markdownRender(markdownConfig)
}

function getPropsBlock(info) {
  return [
    // Props mdx
    heading(3, text(`${info.displayName} Props`)),
    html(info.content),
  ]
}
