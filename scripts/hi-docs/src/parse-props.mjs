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
  const parsedInfo = parseDocsInfo(pathInfo).filter((item) => item.displayName !== 'src')

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

const isEnumType = (type) => type.name === 'enum' && Array.isArray(type.value)
const isBooleanType = (type) => type.name === 'boolean'

const tableRenderer = (doc) => {
  log('Table Renderer: ', doc.displayName)

  return [
    tableAstBuilder(Object.values(doc.props), [
      {
        title: '参数',
        render: (val) =>
          val.required ? [text(val.name), text(' '), emphasis(text(`(${'required'})`))] : val.name,
      },
      {
        title: '说明',
        render: (val) => val.description,
      },
      {
        title: '类型',
        render: (val) => (val.type ? (isEnumType(val.type) ? val.type.raw : val.type.name) : '-'),
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
            if (
              typeof val.defaultValue.value === 'string' &&
              !val.defaultValue.value.startsWith('<')
            ) {
              return `"${val.defaultValue.value}"`
            }
            return val.defaultValue.value
          }
          return '-'
        },
      },
    ]),
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
