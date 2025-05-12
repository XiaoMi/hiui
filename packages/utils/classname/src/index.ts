export { default as cx } from 'classnames'

/**
 * 给组件选择器类添加上 hiui 版本控制
 *
 * @param cls 选择器类
 * @param componentPrefix 类前缀
 * @returns 带版本控制的选择器类
 */
export const getPrefixCls = (cls: string, componentPrefix = 'hi-v4') => `${componentPrefix}-${cls}`

/**
 * 给 css 变量名添加上 hiui 版本控制
 *
 * @param name 变量语义名
 * @param componentPrefix 类前缀
 * @returns 带版本控制的变量名
 */
export const getPrefixStyleVar = (name: string, componentPrefix = '--hi-v4') =>
  `${componentPrefix}-${name}`
