import Path from 'path'
import { html } from 'mdast-builder'
import { markdownRender, outputPath, writeFileAsync } from './utils/index.mjs'

export async function mergeDocs(components) {
  // 写入
  return await Promise.all(
    components.map(async (info) => {
      // 元信息合并
      const storiesMarkdown = storiesRender(info.stories)
      const readmeMarkdown = info.readme
      const markdown = injectStoryIntoReadMe(readmeMarkdown, storiesMarkdown)
      console.log(storiesMarkdown)
      await writeFileAsync(Path.join(outputPath, info.name + '.mdx'), markdown)
    })
  ).catch(console.error)

  // 按组件文件分
  // stories
  // index.mdx

  // 1
  // 同步迁移
  // 示例 和 props 替换为注入钩子

  // 3
  // api 解析
  // api props 替换
  // 手动编写 props

  // changelog 提取 单独维护

  // readme 自动生成
}

function storiesRender(stories) {
  const storyMarkdown = stories.reduce((acc, storyInfo) => {
    const storyBlock = getStoryBlock(storyInfo)
    return acc.concat(storyBlock)
  }, [])

  return markdownRender(storyMarkdown)
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

function injectStoryIntoReadMe(readme, storyMarkdown) {
  return readme.replace('<!-- Inject Stories -->', storyMarkdown)
}
