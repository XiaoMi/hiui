import Path from 'path'
import { fileURLToPath } from 'url'
import FS from 'fs-extra'
import globAsync from 'fast-glob'
import docgen from 'react-docgen-typescript'

import { unified } from 'unified'
import remarkStringify from 'remark-stringify'
import stringWidth from 'string-width'
import remarkGfm from 'remark-gfm'
import { root, emphasis, tableCell, tableRow, table, text } from 'mdast-builder'

const __filename = fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

const rootDir = Path.join(__dirname, '../../../')

const sourcePath = Path.join(rootDir, 'packages/ui/select')

const outputPath = Path.join(__dirname, '..', 'components')

const tsConfigPath = Path.join(rootDir, 'tsconfig.json')

async function findComponentFiles() {
  const tsFiles = await globAsync('**/src/index.@(ts)', {
    cwd: sourcePath,
  })

  return tsFiles
}

function parseDocsInfo(filePaths) {
  const { parse } = docgen.withCustomConfig(tsConfigPath, {
    shouldRemoveUndefinedFromOptional: true,
    shouldExtractLiteralValuesFromEnum: true,
    propFilter: (prop, component) => {
      // 返回 true 表示保留

      if (['prefixCls', 'role'].includes(prop.name)) return false
      // if (['className', 'style'].includes(prop.name)) return true

      if (prop.declarations !== undefined && prop.declarations.length > 0) {
        // 排除 node_modules
        const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
          return !declaration.fileName.includes('node_modules')
        })

        return Boolean(hasPropAdditionalDescription)
      }

      return true
    },
  })

  return filePaths
    .flatMap((file) => {
      const absolutePath = Path.join(sourcePath, file)
      log('parseDocsInfo: ', absolutePath)

      let result = null

      try {
        result = parse(absolutePath)
      } catch (e) {
        console.log(e)
      }

      return result
    })
    .filter(Boolean)
}

function extractComponentInfo(docs) {
  return docs.reduce((acc, def) => {
    if (!Object.keys(def.props || {}).length) {
      return acc
    }

    function createUniqueName(displayName) {
      const existing = acc.filter(
        (prev) => String(prev.def.displayName).toLowerCase() === displayName.toLowerCase()
      )

      if (!existing.length) {
        return displayName
      }

      return `${displayName}${existing.length}`
    }

    const exportName = createUniqueName(def.displayName)
    const fileName = `${exportName}.md`

    acc.push({
      markdown: def.markdown,
      def,
      displayName: def.displayName,
      fileName,
      exportName,
      importPath: `../components/${fileName}`,
      // importPath: Path.join(outputPath, fileName),
    })
    return acc
  }, [])
}

/**
 * Write component info as JSON to disk
 */
function writeComponentInfoFiles(componentInfo) {
  for (const info of componentInfo) {
    const filePath = Path.join(outputPath, info.fileName)
    // const content = JSON.stringify(info.def)
    writeFileSync(filePath, info.markdown)
  }
}

async function writeFileSync(path, content) {
  FS.mkdirpSync(Path.dirname(path))
  FS.writeFileSync(path, content)
}

function log(...args) {
  console.info(`[props-docs]`, ...args)
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

const isEnumType = (type) => type.name === 'enum' && Array.isArray(type.value)
const isBooleanType = (type) => type.name === 'boolean'

const tableRenderer = (doc) => {
  log('table Render: ', doc.displayName)

  return [
    // heading(3, text(doc.displayName)),
    // text(doc.description),
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

function markdownRender(doc) {
  const remark = unified()
    .use(remarkGfm, { stringLength: stringWidth })
    .use(remarkStringify, { stringLength: stringWidth })

  const table = root(tableRenderer(doc))

  return remark.stringify(table)
}

async function main() {
  const componentFiles = await findComponentFiles()

  FS.removeSync(outputPath)
  if (componentFiles.length) {
    await FS.mkdirp(outputPath)
  }

  log('Parsing files for component types...')
  const parsedInfo = parseDocsInfo(componentFiles)

  log('Render markdown table...')
  parsedInfo.forEach((doc) => {
    doc.markdown = markdownRender(doc)
  })

  log('Extracting component info...')
  const componentInfo = extractComponentInfo(parsedInfo)
  // console.log(componentInfo)

  log('Writing component info files...')
  writeComponentInfoFiles(componentInfo)

  log(`Processed ${componentInfo.length} components`)
}

export default main

main().catch(console.error)

// const componentDocs = parse(Path.join(rootDir, 'packages/ui/input/src/Input.tsx'), {
//   savePropValueAsString: true,
// })

// console.log(reactMarkdownRender(componentDocs))
