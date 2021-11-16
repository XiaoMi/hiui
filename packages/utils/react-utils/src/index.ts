/**
 * 合并默认值
 */
export const withDefaultProps = <U extends Record<string, any>, T extends Record<string, any>>(
  props: U | undefined,
  defaultProps?: T
) => {
  if (!defaultProps) return props || {}

  const mergedProps = { ...props }
  let propName

  for (propName in defaultProps) {
    if (mergedProps[propName] === undefined) {
      // @ts-ignore
      mergedProps[propName] = defaultProps[propName]
    }
  }

  return mergedProps
}
