import Path from 'path'
import globAsync from 'fast-glob'
import { readFileAsync, rootDir, writeFileAsync, __dirname } from './utils/index.mjs'
import { findUI } from './find-ui.mjs'

migrate().catch(console.log)

const sourcePath = Path.join(rootDir, 'packages/ui')
export async function migrate() {
  const baseURL = Path.join(__dirname, '../../v3-docs')
  const componentPkgFiles = await findComponentPkgFiles(baseURL)
  await getComponentInfo(componentPkgFiles, baseURL)
  console.log(componentPkgFiles.length)

  const componentInfo = await findUI(sourcePath)
  console.log(componentInfo.length)

  const unsolvedComponentFiles = componentInfo.filter((item) => {
    return !componentPkgFiles.includes(item.name + '.mdx')
  })

  // console.log(unsolvedComponentFiles, unsolvedComponentFiles.length)

  function toHump(name) {
    return name
      .replace(/-(\w)/g, function (all, letter) {
        return letter.toUpperCase()
      })
      .replace(/^(\w)/, function (all, letter) {
        return letter.toUpperCase()
      })
  }

  await Promise.all(
    unsolvedComponentFiles.map(async (info) => {
      await writeFileAsync(
        Path.join(info.dir, 'hi-docs.config.mdx'),
        `# ${toHump(info.name)} 组件中文名

组件中文介绍

## 何时使用

组件使用场景中文介绍

## 使用示例

<!-- Inject Stories -->

## Props

<!-- Inject Props -->
`
      )
    })
  )

  return componentInfo
}

async function findComponentPkgFiles(baseURL) {
  const tsFiles = await globAsync('*.@(mdx)', {
    cwd: baseURL,
  })

  return tsFiles
}

async function getComponentInfo(componentPkgFiles, baseURL) {
  return await Promise.all(
    componentPkgFiles.map(async (pkgFile) => {
      const componentName = pkgFile.split('.')[0]
      const content = await readFileAsync(pkgFile, baseURL)

      // content = content.replace(/## 基础[\s.]+## Props/m, '')
      // console.log(content)

      const contents = content.split('\n')
      // console.log(contents)
      let start = -1
      let end = -1
      contents.some((row, index) => {
        start = index
        return row.startsWith('## 何时使用')
      })
      contents.some((row, index) => {
        end = index
        return row.startsWith('## Props')
      })

      const results = []

      if (start === -1 || end === -1) {
        // console.log('[ componentName ] >', componentName)
      } else {
        let index = start
        while (++index < contents.length) {
          if (contents[index].startsWith('##')) {
            // console.log(componentName, contents[index])
            start = index
            break
          }
        }

        contents.forEach((item, index) => {
          if (index < start || index === end) {
            results.push(item)
          }

          if (index === start - 1) {
            results.push('## 使用示例')
            results.push('')
            results.push('<!-- Inject Stories -->')
            results.push('')
          }
          if (index === end) {
            results.push('')
            results.push('<!-- Inject Props -->')
            results.push('')
          }
        })

        index = end
        while (++index < contents.length) {
          if (contents[index].startsWith('##')) {
            // console.log(componentName, contents[index])
            end = index
            for (let i = end; i < contents.length; i++) {
              results.push(contents[i])
            }
            break
          }
        }
      }

      await writeFileAsync(
        Path.join(rootDir, 'packages/ui', componentName, 'hi-docs.config.mdx'),
        results.join('\n')
      )

      return {
        name: componentName,
        content: content,
      }
    })
  ).catch(console.error)
}
