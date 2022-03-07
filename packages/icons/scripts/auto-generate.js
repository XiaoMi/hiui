const Path = require('path')
const Fs = require('fs')

const Config = {
  reserveFillColorType: ['colorful'],
}

const getAllSvgComponentFileInfo = () => {
  const result = []
  const recursion = (dir) => {
    const list = Fs.readdirSync(dir)
    list.forEach((item) => {
      const fullPath = Path.join(dir, item)
      const stats = Fs.statSync(fullPath)
      if (stats.isDirectory()) {
        recursion(fullPath)
      } else {
        // 获取到svg文件
        if (item.endsWith('.svg')) {
          const dirs = dir.trim().split(Path.sep)
          const fileName = item.replace('.svg', '')
          const type = dirs[dirs.length - 1]
          const belong = dirs[dirs.length - 2]
          // 处理插件带来的数字后缀影响
          const pureName = fileName.split(' ')[0].trim()
          result.push({
            path: fullPath,
            name: pureName,
            type,
            belong,
            withTypeName: `${pureName}-${type}`,
            generateFileRelativePath: `${belong}/${pureName}-${type}`,
          })
        }
      }
    })
  }

  recursion(Path.join(__dirname, '../icon-resources'))

  return result
}

const disposeSvgSourceFile = (file, info) => {
  const removeXmlDeclaration = (source) => {
    return source.replace(/<\?xml.*?\?>/g, '').trim()
  }
  const removeDoctypeDeclaration = (source) => {
    return source.replace(/<\!DOCTYPE.*?>/g, '').trim()
  }

  const removeSvgClass = (source) => {
    return source.replace(/(?<=<svg.*?)class=\".*?\"(?=.*?>)/g, '')
  }

  const removeSvgSize = (source) => {
    return source
      .replace(/(?<=<svg.*?)width=\".*?\"(?=.*?>)/g, '')
      .replace(/(?<=<svg.*?)height=\".*?\"(?=.*?>)/g, '')
  }

  const removePathFill = (source) => {
    return source.replace(/(?<=<.*?)fill=\".*?\"(?=.*?>)/g, '')
  }

  const insertReactProps = (source) => {
    return source.replace(/<svg/g, '<svg className={cls} ref={ref} role="icon" {...rest} ')
  }

  const pureSvg = removeDoctypeDeclaration(removeXmlDeclaration(file))

  const removeUselessProperty = removeSvgSize(removeSvgClass(pureSvg))

  const resultSvg = Config.reserveFillColorType.includes(info.type)
    ? removeUselessProperty
    : removePathFill(removeUselessProperty)

  return insertReactProps(resultSvg)
}

const transformToUpperCamelCase = (name) => {
  const words = String(name).split(/\-/g)
  return words.map((item) => item[0].toUpperCase() + item.slice(1)).join('')
}

const generateComponentTsxContent = (svg, name) => {
  const componentName = transformToUpperCamelCase(name)

  return `
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-${name}')

export const ${componentName} = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      ${svg}
    )
  }
)

if (__DEV__) {
  ${componentName}.displayName = '${componentName}'
}
  `
}

const generateIconGroupData = (componentInfo) => {
  const targetDataFile = Path.join(__dirname, '../stories/group.ts')
  const collector = new Map()
  const allNeedImportComponents = []
  const types = new Set()

  componentInfo.forEach(({ withTypeName, belong, type }) => {
    if (!collector.has(belong)) {
      collector.set(belong, [])
    }

    const componentName = transformToUpperCamelCase(withTypeName)
    allNeedImportComponents.push(componentName)
    collector.get(belong).push({
      componentName,
      type: type,
      name: withTypeName,
    })
    types.add(type)
  })

  const belongs = Array.from(collector.keys())
  const getDataString = ({ type, componentName, name }) =>
    `\n{type:'${type}',component:${componentName}, name:'${name}', tagName:'${componentName}' }`
  const content = `
  export interface IconDescription{
    type:${Array.from(types)
      .map((type) => `'${type}'`)
      .join('|')},
    component:FunctionComponent,
    name:string,
    tagName:string
  }
  export interface IconGroupInfo{
    ${belongs.map((belong) => `${belong}: IconDescription[]`).join('\n')}
  }
  export const ComponentGroup:IconGroupInfo = {
    ${belongs
      .map((belong) => `${belong}: [${collector.get(belong).map(getDataString).join(',')}]`)
      .join(',\n')}
  }`
  const allImportStatement = `import { FunctionComponent } from 'react'
  import {${allNeedImportComponents.join(',')}} from '../'`
  Fs.writeFileSync(targetDataFile, allImportStatement + content)
}

const componentFileInfo = getAllSvgComponentFileInfo()

console.log(`Auto generate: total ${componentFileInfo.length}`)
componentFileInfo.forEach((info) => {
  const { withTypeName, path, generateFileRelativePath } = info
  const svg = disposeSvgSourceFile(Fs.readFileSync(path).toString(), info)
  const targetFilePath = Path.join(
    __dirname,
    '../src/components',
    generateFileRelativePath + '.tsx'
  )
  // 保证文件夹存在
  if (!Fs.existsSync(Path.dirname(targetFilePath))) {
    Fs.mkdirSync(Path.dirname(targetFilePath))
  }
  Fs.writeFileSync(targetFilePath, generateComponentTsxContent(svg, withTypeName))
  console.log(`Auto generate: ${withTypeName}`)
})

// 留存，避免再次使用
// const indexTsContent = `import './styles/index.scss'
//
// export * from './@types/props'
//
// import { IconSummation } from './icon-summation'
//
// export const {
//   ${componentFileInfo.map((item) => transformToUpperCamelCase(item.withTypeName)).join(',\n')}
// } = IconSummation
//
// // 暂不确定导出形式
// // export { IconSummation }
// `

const indexTsContent = `import './styles/index.scss'

export * from './@types/props'

export * from './icon-summation'
`

Fs.writeFileSync(Path.join(__dirname, '../src/index.ts'), indexTsContent)

// 留存，避免再次使用
// const iconSummationTsContent = `
// ${componentFileInfo
//   .map(({ withTypeName, generateFileRelativePath }) => {
//     return `import { ${transformToUpperCamelCase(
//       withTypeName
//     )} } from './components/${generateFileRelativePath}'`
//   })
//   .join('\n')}
//
// const IconSummation = {
// ${componentFileInfo.map((item) => transformToUpperCamelCase(item.withTypeName)).join(',\n')}
// }
// export { IconSummation }
// `

const iconSummationTsContent = `
${componentFileInfo
  .map(({ withTypeName, generateFileRelativePath }) => {
    return `export { ${transformToUpperCamelCase(
      withTypeName
    )} } from './components/${generateFileRelativePath}'`
  })
  .join('\n')}
`

Fs.writeFileSync(Path.join(__dirname, '../src/icon-summation.ts'), iconSummationTsContent)

// 生成icon 分组数据
generateIconGroupData(componentFileInfo)
