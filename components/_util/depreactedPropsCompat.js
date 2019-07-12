import React from 'react'

/**
 * compat old api
 * 参数为一个二维数组，里面的一维数组的第一个参数为新 prop，第二个参数为旧 prop，第三个参数为转换函数，
 * 回调值为旧 prop 传入的值。使用示例参考 Stepper 组件
 * @export
 * @param {[[string, string, Function], [string, string, Function]]} compatPair
 * @returns
 */
export const depreactedPropsCompat = (compatPair) => {
  return (WrappedComponent) => {
    return (props) => {
      const compatProps = { ...props }
      compatPair.forEach(([newProp, oldProp, convert]) => {
        if (props[oldProp] !== undefined && props[newProp] === undefined) {
          compatProps[newProp] = convert
            ? convert(props[oldProp])
            : props[oldProp]
        }
      })
      return React.createElement(WrappedComponent, compatProps)
    }
  }
}
