import { isNil } from 'lodash-es'
import { isThenable } from './predicate'
import type { BeCheckedPromiseType } from './check-result'

export type CheckChainValueType = BeCheckedPromiseType<boolean>

type CtxType = {
  beforeCheck?: () => void
  onPassed?: () => void
  onBlocked?: () => void
}

/**
 * 执行 promise 链检测
 * @desc 被检测的值非 promise 时，认为【通过检测】
 * @desc 被检测的值为 promise 时，执行 promise 链检测
 * @desc promise 返回值为 true 时，认为【通过检测】，false 时认为【未通过检测】
 * @desc promise 未返回或返回 nil 时，认为【通过检测】
 * @desc promise 链检测出现错误时，认为【未通过检测】
 */
export function execPromiseCheckChain(promise: CheckChainValueType, ctx?: CtxType) {
  const onPassed = () => {
    ctx?.onPassed?.()
    return true
  }
  const onBlocked = () => {
    ctx?.onBlocked?.()
    return false
  }

  // 不是 promise，认为通过检测
  if (!isThenable(promise)) return Promise.resolve(onPassed())
  else {
    // promise 链检测前
    ctx?.beforeCheck?.()
    return (
      promise
        .then((result) => {
          // 未返回或返回Nil，认为通过检测
          if (isNil(result)) return onPassed()
          else {
            if (result) return onPassed()
            else return onBlocked()
          }
        })
        // promise 链出现错误，认为未通过检测
        .catch((error) => {
          console.log('execPromiseBlockChain', error)
          return onBlocked()
        })
    )
  }
}
