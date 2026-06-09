import Path from 'path'
import { heading, html, text } from 'mdast-builder'
import { markdownRender, outputPath, writeFileAsync, cleanCreateDir } from './utils/index.mjs'

const siteBaseUrl = 'https://xiaomi.github.io/hiui/'

export async function mergeDocs(components) {
  // const pkgs = components
  //   .map((info) => {
  //     return getStoriesImport(info.stories)
  //   })
  //   .flat()

  // console.log(Array.from(new Set(pkgs)))

  await cleanCreateDir(outputPath)

  const mergedHiuiMarkdown = new Array(components.length)
  const componentMarkdownMap = new Map()

  await Promise.all(
    components.map(async (info, idx) => {
      // 元信息合并
      let markdown = info.readme
      markdown = mergePropsIntoReadme(markdown, info.props)
      const markdownMd = mergeStoriesCodeIntoReadme(info.name, markdown, info.stories)

      const mergedReadmeBlock = getReadmeBlockMarkdown(markdownMd)
      if (info.name !== 'hiui') {
        mergedHiuiMarkdown[idx] = mergedReadmeBlock
        componentMarkdownMap.set(info.name, mergedReadmeBlock)
      }

      markdown = transformJSX(markdown)
      markdown = mergeStoriesIntoReadme(info.name, markdown, info.stories)
      // 写入
      await writeDocs(info, markdown)
    })
  ).catch(console.error)

  await writeKnowledgeFiles(components, mergedHiuiMarkdown, componentMarkdownMap)

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

async function writeKnowledgeFiles(components, mergedHiuiMarkdown, componentMarkdownMap) {
  const knowledgePath = Path.join(outputPath, 'knowledge')
  const componentsPath = Path.join(knowledgePath, 'llms')
  const componentNames = Array.from(new Set(components.map((item) => item.name)))
    .filter((name) => name && name !== 'hiui')
    .sort()
  const componentLinks = componentNames.map((name) => `- ${siteBaseUrl}llms/${name}.md`)
  const sitemapLinks = [
    siteBaseUrl,
    `${siteBaseUrl}docs/quick-start`,
    `${siteBaseUrl}components`,
    ...componentNames.map((name) => `${siteBaseUrl}components/${name}/`),
  ]

  const llmsTxt = [
    '# HiUI LLM Index',
    '',
    `- Home: ${siteBaseUrl}`,
    `- Quick Start: ${siteBaseUrl}docs/quick-start`,
    `- Components: ${siteBaseUrl}components`,
    '',
    '## Component Docs',
    ...componentLinks,
    '',
    'Use this file as a short entry point for HiUI knowledge.',
    '',
  ].join('\n')

  const llmsFullHeader = [
    '# Ant Design Component Documentation',
    '',
    'This file contains usage examples and parameters for all components.',
    '',
    '',
  ].join('\n')
  const llmsFullTxt = llmsFullHeader + mergedHiuiMarkdown.filter(Boolean).join('\n\n')
  const sitemapXml = buildSitemapXml(sitemapLinks)

  const componentDocsWrites = componentNames.map((name) =>
    writeFileAsync(Path.join(componentsPath, `${name}.md`), componentMarkdownMap.get(name) || '')
  )

  await Promise.all([
    writeFileAsync(Path.join(knowledgePath, 'llms.txt'), llmsTxt),
    writeFileAsync(Path.join(knowledgePath, 'llms-full.txt'), llmsFullTxt),
    writeFileAsync(Path.join(knowledgePath, 'sitemap.xml'), sitemapXml),
    ...componentDocsWrites,
  ])
}

function buildSitemapXml(urls) {
  const uniqueUrls = Array.from(new Set(urls))
  const lines = uniqueUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`)

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...lines,
    '</urlset>',
    '',
  ].join('\n')
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

function getReadmeBlockMarkdown(markdown) {
  return markdown
    .replace(/ {2,}|\n\s*\/\*\*[\s\S]*?\*\/|\n\s*<h1>.*?<\/h1>/g, ' ')
    .replace(/## 何时使用[\s\S]*?## 使用示例/g, '## 使用示例')
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
