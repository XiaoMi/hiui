import Path from 'path'
import { log } from './utils/index.mjs'
import docgen from 'react-docgen-typescript'
import { unified } from 'unified'
import remarkStringify from 'remark-stringify'
import stringWidth from 'string-width'
import remarkGfm from 'remark-gfm'
import { root, emphasis, tableCell, tableRow, table, text } from 'mdast-builder'

export async function parseProps(componentPaths) {
  const componentInfo = await Promise.all(
    componentPaths.map(async (pathInfo) => {
      const props = await getComponentProps(pathInfo)
      return { ...pathInfo, props }
    })
  ).catch(console.error)

  return componentInfo
}

function getComponentProps(pathInfo) {
  log('Parsing files for component types...')
  const parsedInfo = parseDocsInfo(pathInfo)
    .filter((item) => item.displayName !== 'src')
    .filter((item) => {
      // 内部使用暴露，对外屏蔽文档
      if (
        ['DefaultPagination', 'ShrinkPagination', 'PopContent'].some((name) =>
          item.displayName.includes(name)
        )
      ) {
        return false
      }

      // 屏蔽 MockInput 内部组件
      if (item.displayName.startsWith('Mock')) return false
      // useHook 方式不产生文档，除了 Tree
      if (item.displayName.startsWith('use')) return item.displayName.includes('Tree')
      return true
    })

  log('Render component markdown table...')
  parsedInfo.forEach((doc) => {
    doc.content = markdownRender(doc)
  })

  log('Extracting component props...')
  const componentProps = extractComponentProps(parsedInfo)
  return componentProps
}

function parseDocsInfo(pathInfo) {
  const tsConfigPath = Path.join(pathInfo.dir, 'tsconfig.json')

  const { parse } = docgen.withCustomConfig(tsConfigPath, {
    shouldRemoveUndefinedFromOptional: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldExtractValuesFromUnion: true,
    // 使用同 Array.prototype.filter
    propFilter: (prop, component) => {
      if (['prefixCls', 'role'].includes(prop.name)) return false
      // if (['className', 'style'].includes(prop.name)) return true

      // 排除 node_modules
      if (prop.declarations !== undefined && prop.declarations.length > 0) {
        const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
          return !declaration.fileName.includes('node_modules')
        })

        return Boolean(hasPropAdditionalDescription)
      }

      return true
    },
  })

  const componentFilePath = Path.join(pathInfo.dir, './src/index.ts')
  log('ParseDocsInfo: ', componentFilePath)

  let result = null

  try {
    result = parse(componentFilePath)
  } catch (e) {
    console.log(e)
  }

  return result
}

function extractComponentProps(docs) {
  return docs.reduce((acc, def) => {
    if (!Object.keys(def.props || {}).length) {
      return acc
    }

    function createUniqueName(displayName) {
      const existing = acc.filter(
        (prev) => String(prev.displayName).toLowerCase() === displayName.toLowerCase()
      )

      if (!existing.length) {
        return displayName
      }

      return `${displayName}${existing.length}`
    }

    const uniqueName = createUniqueName(def.displayName)

    acc.push({
      // def,
      name: uniqueName,
      content: def.content,
      displayName: def.displayName,
    })

    return acc
  }, [])
}

function markdownRender(doc) {
  const remark = unified()
    .use(remarkGfm, { stringLength: stringWidth })
    .use(remarkStringify, { stringLength: stringWidth })

  const table = root(tableRenderer(doc))
  return remark.stringify(table)
}

const isEnumType = (type) =>
  type.name === 'enum' &&
  Array.isArray(type.value) &&
  // 规范化枚举命名
  (type.raw.includes(' | ') || type.raw.includes('Enum'))

const isBooleanType = (type) => type.name === 'boolean' || type.raw === 'boolean'

const isPrivate = (val) =>
  val.description &&
  (val.description.includes('暂不对外暴露') || val.description.includes('@private'))

const tableRenderer = (doc) => {
  log('Table Renderer: ', doc.displayName)

  return [
    tableAstBuilder(
      Object.values(doc.props).filter((prop) => !isPrivate(prop)),
      [
        {
          title: '参数',
          render: (val) =>
            val.required
              ? [text(val.name), text(' '), emphasis(text(`(${'required'})`))]
              : val.name,
        },
        {
          title: '说明',
          render: (val) => val.description,
        },
        {
          title: '类型',
          render: (val) => (val.type ? (val.type.raw ? val.type.raw : val.type.name) : '-'),
          // render: (val) => (val.type ? (isEnumType(val.type) ? val.type.raw : val.type.name) : '-'),
        },
        {
          title: '可选值',
          render: (val) => {
            if (!val.type) return '-'
            if (isEnumType(val.type)) return val.type.value.map((e) => e.value).join(' | ')
            if (isBooleanType(val.type)) return 'true | false'
            return '-'
          },
        },
        {
          title: '默认值',
          render: (val) => {
            if (val.defaultValue) {
              // 移除类型定义
              if (
                typeof val.defaultValue.value === 'string' &&
                val.defaultValue.value.endsWith(' as []')
              ) {
                return val.defaultValue.value.slice(0, -6)
              }

              // 纯字符串类型
              if (
                typeof val.defaultValue.value === 'string' &&
                // JSX
                !val.defaultValue.value.startsWith('<') &&
                // Function
                !val.defaultValue.value.startsWith('(')
              ) {
                return `"${val.defaultValue.value}"`
              }

              return val.defaultValue.value
            }
            return '-'
          },
        },
      ]
    ),
  ]
}

const isChildren = (content) =>
  !['number', 'string', 'boolean', 'undefined'].includes(typeof content) && content !== null

const tableCellContentToNode = (content = '') =>
  isChildren(content) ? content : text(`${content}`)

function tableAstBuilder(dataSource, columns) {
  return table(
    columns.map((vo) => vo.alignType),
    [
      columns.map((vo) => tableCell(tableCellContentToNode(vo.title))),
      ...dataSource.map((item, index) =>
        columns.map((vo) => tableCell(tableCellContentToNode(vo.render(item, index, dataSource))))
      ),
    ].map((vo) => tableRow(vo))
  )
}
