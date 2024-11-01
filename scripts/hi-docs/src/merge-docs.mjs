import Path from 'path'
import { heading, html, text } from 'mdast-builder'
import {
  markdownRender,
  outputPath,
  writeFileAsync,
  appendFileAsync,
  cleanCreateDir,
} from './utils/index.mjs'

export async function mergeDocs(components) {
  // const pkgs = components
  //   .map((info) => {
  //     return getStoriesImport(info.stories)
  //   })
  //   .flat()

  // console.log(Array.from(new Set(pkgs)))

  return await Promise.all(
    components.map(async (info) => {
      // 元信息合并
      let markdown = info.readme
      markdown = mergePropsIntoReadme(markdown, info.props)
      const markdownMd = mergeStoriesCodeIntoReadme(info.name, markdown, info.stories)
      // await writeReadmeAsync(info, markdownMd)
      await appendReadmeAsync(info, markdownMd)
      markdown = transformJSX(markdown)
      markdown = mergeStoriesIntoReadme(info.name, markdown, info.stories)
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

function getStoriesImport(stories) {
  const pkgs = stories
    .map((story) => {
      const reg = story.content.matchAll(/import\s.+\sfrom\s(.+)/g)
      const pkgs = Array.from(reg).map((item) => item[1])
      return pkgs
    })
    .flat()

  const uniqPkgs = Array.from(new Set(pkgs)).filter((item) => {
    if (item === `'react'`) return false
    // if (['@hi-ui'].some((v) => item.includes(v))) return false
    return true
  })
  return uniqPkgs
}

function mergeStoriesIntoReadme(name, readmeMarkdown, stories) {
  const storiesMarkdown = storiesRender(name, stories)
  return readmeMarkdown.replace('<!-- Inject Stories -->', storiesMarkdown)
}

function mergePropsIntoReadme(readmeMarkdown, props) {
  const propsMarkdown = propsRender(props)

  return readmeMarkdown.replace('<!-- Inject Props -->', propsMarkdown)
}

function mergeStoriesCodeIntoReadme(name, readmeMarkdown, stories) {
  // console.log('mergeStories~~~~', info.name, info.stories)

  const storiesMarkdown = storiesReadmeRender(name, stories)
  return readmeMarkdown.replace('<!-- Inject Stories -->', storiesMarkdown)
}

// 转成 CodeBlock 支持的 mdx 语法格式，避免识别为 JSX
const transformJSX = (str) => {
  return str
    .replace(/(\w)>/g, (_, $1) => `${$1}\\>`)
    .replace(/\/>/g, '/\\>')
    .replace(/\\</g, '<')
}

async function writeDocs(info, markdown) {
  // await cleanCreateDir(outputPath)

  // const dist = Path.join(outputPath, info.name)

  await Promise.all([
    // 写入markdown
    writeFileAsync(Path.join(outputPath, `./components/${info.name}.mdx`), markdown),
    // 写入 stories
    ...info.stories.map(async (story) => {
      await writeFileAsync(
        Path.join(outputPath, `./stories/${info.name}/${story.name}.stories.tsx`),
        story.content
      )
    }),
    // 写入readme x
    // writeFileAsync(Path.join(outputDir, 'index.mdx'), markdown),
  ])
}

async function writeReadmeAsync(info, markdown) {
  await cleanCreateDir(outputPath)
  await Promise.all([
    // 写入markdown
    // writeFileAsync(Path.join(outputPath, `./readme/${info.name}.md`), markdown),
    writeFileAsync(Path.join(outputPath, 'readme', `${info.name}.md`), markdown),
  ])
}

async function appendReadmeAsync(info, markdown) {
  markdown =
    '\n\n###@###\n\n' +
    markdown
      .replace(/ {2,}|\n\s*\/\*\*[\s\S]*?\*\/|\n\s*<h1>.*?<\/h1>/g, ' ')
      .replace('## Props', `###@###\n\n# ${info.title}\n\n## Props`)
      .replace(/## 何时使用[\s\S]*?## 使用示例/g, '## 使用示例')
  await Promise.all([appendFileAsync(Path.join(outputPath, 'hiui.md'), info.name, markdown)])
}

function storiesRender(name, stories) {
  const markdownConfig = stories.reduce((acc, storyInfo) => {
    const storyBlock = getStoryBlock(name, storyInfo)
    return acc.concat(storyBlock)
  }, [])

  return markdownRender(markdownConfig)
}

function storiesReadmeRender(name, stories) {
  const markdownConfig = stories.reduce((acc, storyInfo) => {
    const storyBlock = getReadmeStoryBlock(name, storyInfo)
    return acc.concat(storyBlock)
  }, [])

  return markdownRender(markdownConfig)
}

function getStoryBlock(name, story) {
  return [
    // CodeBlock mdx
    heading(3, text(story.title)),
    story.description ? text(story.description) : false,
    html(`<CodeBlock
  src="${Path.join('../stories', name, story.filepath)}"
  title="${story.title}"
  description="${story.description}"
/>`),
  ].filter(Boolean)
}

function getReadmeStoryBlock(name, story) {
  const storyBlock = '\n```tsx\n' + story.content + '\n```\n'
  return [
    // CodeBlock mdx
    heading(3, text(story.title)),
    story.description ? text(story.description) : false,
    html(storyBlock),
  ].filter(Boolean)
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
