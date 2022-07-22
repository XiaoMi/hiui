import { merge, object2Paths } from '@hi-ui/object-utils'
import { replaceStyle } from '@hi-ui/dom-utils'
import { DesignSystemProps } from './types'

/**
 * 构建 design system token 并生效
 */
export const createSystem = (props: DesignSystemProps | null, prefix: string) => {
  if (props === null) {
    injectCssRoot(prefix, '')
    return
  }

  const cssContent = transformObjectToCSSVar(props, prefix)
  injectCssRoot(prefix, cssContent)
}

/**
 * 设置继承默认主题的配置
 */
export const extendsTheme = (...overrides: (DesignSystemProps | undefined)[]) => {
  return overrides.reduce((acc: DesignSystemProps, cur) => merge(acc, cur), {})
}

const transformObjectToCSSVar = (props: Record<string, any>, prefix: string) => {
  const objectPaths = object2Paths(props)

  const cssList = objectPaths.map((paths) => {
    const value = paths.pop()
    return `--${prefix}-${paths.join('-')}: ${value};`
  })

  return cssList.join('\n')
}

// 注入全局
export const injectCssRoot = (prefix: string, cssContent: string) => {
  const cssText = `:root {${cssContent}}`

  replaceStyle(`${prefix}-theme-custom`, cssText, 'root')
}
