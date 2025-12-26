const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

/**
 * 创建 style 标签
 * 创建的 style 标签以 componentName 来做区分，判断是否存在，存在则替换，不存在则创建
 */
const createStyle = (css: string, componentName: string, prefixCls: string) => {
  if (!css || !isBrowser) return

  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')

  head.appendChild(style)
  style.appendChild(document.createTextNode(css))

  const existingStyle = document.querySelector(
    `style[data-${prefixCls}-component-name="${componentName}"]`
  )

  if (existingStyle) {
    existingStyle.remove()
  }

  if (componentName && prefixCls) {
    style.setAttribute(`data-${prefixCls}-component-name`, componentName)
  }
}

/**
 * 注入组件样式
 * 如果 GlobalConfig.prefixCls 存在，则替换 style 标签中的 hi-v5 为 GlobalConfig.prefixCls
 */
const styleInject = ({
  css,
  componentName,
  GlobalConfig,
  defaultPrefixCls,
}: {
  css: string
  componentName: string
  GlobalConfig: any
  defaultPrefixCls: string
}) => {
  if (!css || !isBrowser) return

  createStyle(css, componentName, GlobalConfig.prefixCls)

  setTimeout(() => {
    if (GlobalConfig.prefixCls && componentName) {
      css = css.replace(new RegExp(defaultPrefixCls, 'g'), GlobalConfig.prefixCls)
      createStyle(css, componentName, GlobalConfig.prefixCls)
    }
  })
}

export default styleInject
export { styleInject, createStyle }
