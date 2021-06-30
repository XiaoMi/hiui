export { default as cx } from 'classnames'

/**
 * 给组件选择器类添加上 hiui 版本控制
 *
 * @param cls 选择器类
 * @param componentPrefix 类前缀
 * @returns 带版本控制的选择器类
 */
export const getPrefixCls = (cls: string, componentPrefix = 'hix') => `${componentPrefix}-${cls}`
