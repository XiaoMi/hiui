import Path from 'path'
import globAsync from 'fast-glob'

export async function findUI(baseURL) {
  const componentPkgFiles = await findComponentPkgFiles(baseURL)

  const componentInfo = getComponentInfo(componentPkgFiles, baseURL)

  return componentInfo
}

const helpfulPrivatePkgs = ['popper', 'file-select', 'portal', 'spinner', 'highlighter']
const othersPrivatePkgs = ['icon-button', 'locale-context', 'picker', 'tag-input', 'toast']

async function findComponentPkgFiles(baseURL) {
  const tsFiles = await globAsync('*/package.@(json)', {
    cwd: baseURL,
    ignore: ['**/node_modules/**'],
  })

  // console.log(tsFiles)
  return tsFiles.filter(
    (v) =>
      !helpfulPrivatePkgs.concat(othersPrivatePkgs).some((privateName) => {
        return v.startsWith(privateName + '/')
      })
  )
  // return tsFiles.filter((v) => v.includes('alert'))
}

function getComponentInfo(componentPkgFiles, baseURL) {
  return componentPkgFiles.map((pkgFile) => {
    const componentName = pkgFile.split('/')[0]
    const pkgFilepath = Path.join(baseURL, pkgFile)

    // @Meta Component
    return {
      dir: Path.dirname(pkgFilepath),
      name: componentName,
    }
  })
}
