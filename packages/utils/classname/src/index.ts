export { default as cx } from 'classnames'

export const getPrefixCls = (cls: string, componentPrefix = 'hi-v4') => `${componentPrefix}-${cls}`
