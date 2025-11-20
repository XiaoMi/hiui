import { merge, object2Paths } from '@hi-ui/object-utils'
import { replaceStyle } from '@hi-ui/dom-utils'
import { DesignSystemProps, ThemeDataProps } from './types'

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

export const removeSystem = (prefix: string) => {
  createSystem(null, prefix)
}

export const createComponentsSystem = (
  components: ThemeDataProps['components'] | null,
  prefix: string
) => {
  if (!components) {
    return
  }

  Object.keys(components).forEach((componentName) => {
    const value = components[componentName]
    const elements = document.getElementsByClassName(`${prefix}-${componentName}`)

    if (!value) {
      injectCssComponent(componentName, prefix, '')
      Array.from(elements).forEach((element) => {
        element.classList.remove(`${prefix}-theme-custom`)
      })
      return
    }

    const cssContent = transformObjectToCSSVar(value, prefix)
    injectCssComponent(componentName, prefix, cssContent)

    Array.from(elements).forEach((element) => {
      element.classList.add(`${prefix}-theme-custom`)
    })
  })
}

export const removeComponentsSystem = (
  components: ThemeDataProps['components'] | null,
  prefix: string
) => {
  if (!components) {
    return
  }

  Object.keys(components).forEach((componentName) => {
    const elements = document.getElementsByClassName(`${prefix}-${componentName}`)
    Array.from(elements).forEach((element) => {
      element.classList.remove(`${prefix}-theme-custom`)
      injectCssComponent(componentName, prefix, '')
    })
  })
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

/**
 * 为组件注入样式
 * 例如：.hi-v5-theme-custom.hi-v5-button { --hi-v5-button-color: #000; }
 */
export const injectCssComponent = (componentName: string, prefix: string, cssContent: string) => {
  const cssText = `.${prefix}-theme-custom.${prefix}-${componentName} {${cssContent}}`

  replaceStyle(`${prefix}-${componentName}-theme-custom`, cssText, `${prefix}-${componentName}`)
}
