import { mergeProps } from './merge'

export type PipeGetter<T, Extra = AnyObject> =
  | T
  | (PipeFn<T, Extra> & {
      /** 函数时，会把之前对象式的值塞进去 */
      _payload?: Partial<T & AnyObject>
    })

export function getPipeGetterValue<T extends AnyObject, Extra = AnyObject>(
  dft: T,
  getter?: PipeGetter<T, Extra>,
  /** 指 getter 所需的额外信息，通常是所在的上下文 */
  extra?: Extra
) {
  if (!getter) return dft
  if (typeof getter === 'object') return mergeProps(dft, getter)
  else return getter(mergeProps(dft, getter._payload as T), extra)
}

/**
 * 读取 Getter 的值
 * @param getter 形如 value | (...args: any[]) => value 的配置项
 * @param dft 默认值
 * @param params Getter函数所需的参数
 */
export function getGetterValue<
  // 泛型参数列表
  T extends NonFnValue,
  TParams extends Parameters<AnyFn>
>(
  // 参数列表
  getter: AnyGetter<(...params: TParams) => T> | undefined,
  dft: T,
  params: TParams
): T {
  try {
    if (getter === undefined) return dft
    // 函数则执行
    if (typeof getter === 'function') return getter(...params)
    // 类型相同则返回，忽略默认值
    if (typeof dft === typeof getter) return getter

    // 都没匹配到，则保底返回默认值
    return dft // 理论应该走不到这里
  } catch (error) {
    console.log('getGetterValue', error)
    return dft
  }
}
