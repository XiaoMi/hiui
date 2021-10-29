const globAsync = require('fast-glob')
const Path = require('path')
const FS = require('fs-extra')

const docgen = require('react-docgen-typescript')

const rootDir = Path.join(__dirname, '../../../')

const sourcePath = Path.join(rootDir, 'packages/components')
const outputPath = Path.join(__dirname, '..', 'components')

const tsConfigPath = Path.join(rootDir, 'tsconfig.json')

async function findComponentFiles() {
  const tsFiles = await globAsync('**/src/**/*.@(ts)', {
    cwd: sourcePath,
  })

  return tsFiles
}

function parseDocsInfo(filePaths) {
  const { parse } = docgen.withCustomConfig(tsConfigPath, {
    shouldRemoveUndefinedFromOptional: true,
    // propFilter: (prop, component) => {
    //   const isHook = component.name.startsWith("use-")

    //   const isTypeScriptNative = prop.parent?.fileName.includes("node_modules/typescript") ?? false

    //   return (
    //     (isHook && !isTypeScriptNative) || true
    //   )
    // },
  })

  return filePaths.flatMap((file) => {
    const absolutePath = Path.join(sourcePath, file)
    return parse(absolutePath)
  })
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
    const fileName = `${exportName}.json`

    acc.push({
      def,
      displayName: def.displayName,
      fileName,
      exportName,
      importPath: `../components/${fileName}`,
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
    const content = JSON.stringify(info.def)
    writeFileSync(filePath, content)
  }
}

async function writeFileSync(path, content) {
  FS.mkdirpSync(Path.dirname(path))
  FS.writeFileSync(path, content)
}

function log(...args) {
  console.info(`[props-docs]`, ...args)
}

const unified = require('unified')
const remarkStringify = require('remark-stringify')
const stringWidth = require('string-width')
const {
  root,
  emphasis,
  heading,
  tableCell,
  tableRow,
  table,
  text,
  Children,
} = require('mdast-builder')

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

const tableRenderer = (doc) => {
  return [
    heading(3, text(doc.displayName)),
    text(doc.description),
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
        render: (val) => (isEnumType(val.type) ? val.type.raw : val.type.name),
      },
      {
        title: '可选值',
        render: (val) =>
          isEnumType(val.type) ? val.type.value.map((e) => e.value).join(', ') : '',
      },
      {
        title: '默认值',
        render: (val) => (val.defaultValue ? val.defaultValue.value : '-'),
      },
    ]),
  ]
}

function markdownRender(docs) {
  return unified()
    .use(remarkStringify, { stringLength: stringWidth })
    .stringify(root(docs.map((v) => tableRenderer(v))))
}

async function main() {
  const componentFiles = await findComponentFiles()

  if (componentFiles.length) {
    await FS.mkdirp(outputPath)
  }

  log('Parsing files for component types...')
  const parsedInfo = parseDocsInfo(componentFiles)

  log('Render markdown table...')
  markdownRender(parsedInfo)

  log('Extracting component info...')
  const componentInfo = extractComponentInfo(parsedInfo)

  log('Writing component info files...')
  writeComponentInfoFiles(componentInfo)

  log(`Processed ${componentInfo.length} components`)
}

module.exports = main

if (require.main === module) {
  // run main function if called via cli
  main().catch(console.error)
}
