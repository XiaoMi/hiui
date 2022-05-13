import Path from 'path'
import globAsync from 'fast-glob'

export async function findUI(baseURL) {
  const componentPkgFiles = await findComponentPkgFiles(baseURL)

  const componentInfo = getComponentInfo(componentPkgFiles, baseURL)

  return componentInfo
}

async function findComponentPkgFiles(baseURL) {
  const tsFiles = await globAsync('*/package.@(json)', {
    cwd: baseURL,
    ignore: ['**/node_modules/**'],
  })

  // console.log(tsFiles)
  return tsFiles.filter(
    (v) =>
      !['icon-button', 'locale-context', 'picker', 'tag-input', 'toast'].some((privateName) => {
        return v.startsWith(privateName + '/')
      })
  )
  // return tsFiles
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
