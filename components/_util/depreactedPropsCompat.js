import React from 'react'

const isDevelopment = /development/gi.test(process.env.NODE_ENV)

/**
 * compat old api
 * 参数为一个二维数组，里面的一维数组的第一个参数为新 prop，第二个参数为旧 prop，第三个参数为转换函数，
 * 回调值为旧 prop 传入的值。使用示例参考 Stepper 组件
 * @export
 * @param {[[string, string, Function], [string, string, Function]]} compatPair
 * @returns
 */
export const depreactedPropsCompat = (compatPair) => (WrappedComponent) => {
  const WrapperComponent = (props) => {
    const compatProps = { ...props }
    const componentName =
      WrappedComponent.displayName ||
      WrappedComponent.name ||
      'unknown component'
    compatPair.forEach(([newProp, oldProp, convert]) => {
      if (props[oldProp] !== undefined && props[newProp] === undefined) {
        isDevelopment &&
          console.warn(
            `${componentName}'s prop "${oldProp}" will be depreacted in next version! use ${newProp} instead.`
          )
        compatProps[newProp] = convert
          ? convert(props[oldProp])
          : props[oldProp]
      }
    })
    return <WrappedComponent {...compatProps} />
  }
  for (const staticProp in WrappedComponent) {
    WrapperComponent[staticProp] = WrappedComponent[staticProp]
  }
  return WrapperComponent
}
