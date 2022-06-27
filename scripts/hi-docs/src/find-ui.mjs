import Path from 'path'
import globAsync from 'fast-glob'

export async function findUI(baseURL) {
  const componentPkgFiles = await findComponentPkgFiles(baseURL)

  const componentInfo = getComponentInfo(componentPkgFiles, baseURL)

  return componentInfo
}

// TODO: 迁移至 hi-docs 配置项（考虑是否通用化）
const helpfulPrivatePkgs = [
  'popper',
  'file-select',
  'portal',
  'spinner',
  'highlighter',
  'virtual-list',
]
const othersPrivatePkgs = ['icon-button', 'locale-context', 'picker', 'tag-input', 'toast']

async function findComponentPkgFiles(baseURL) {
  const tsFiles = await globAsync('**/*/hi-docs.config.@(mdx)', {
    cwd: baseURL,
    ignore: ['**/node_modules/**'],
  })

  return tsFiles.filter(
    (v) =>
      !helpfulPrivatePkgs.concat(othersPrivatePkgs).some((privateName) => {
        return v.startsWith(privateName + '/')
      })
  )
  // return tsFiles.filter((v) => ['form', 'select'].some((n) => v.includes(n)))
}

function getComponentInfo(componentPkgFiles, baseURL) {
  return componentPkgFiles.map((pkgFile) => {
    const pkgPaths = pkgFile.split('/')
    const componentName = pkgPaths[pkgPaths.length - 2]
    const pkgFilepath = Path.join(baseURL, pkgFile)

    // @Meta Component
    return {
      dir: Path.dirname(pkgFilepath),
      name: componentName,
    }
  })
}
