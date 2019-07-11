import React from 'react'

/**
 *
 * compat old api
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
