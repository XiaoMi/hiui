/**
 *
 * compat old api
 * @export
 * @param {[[string, string], [string, string]]} compatPair
 * @returns
 */
export function depreactedPropsCompat (compatPair) {
  return function (target) {
    const origin = class extends target {}
    origin.prototype.constructor = function (props) {
      const compatedProps = { ...props }
      compatPair.forEach(([newProp, oldProp]) => {
        if (
          compatedProps[oldProp] !== undefined &&
          compatedProps[newProp] === undefined
        ) {
          compatedProps[newProp] = compatedProps[oldProp]
        }
      })
    }
    return origin
  }
}
