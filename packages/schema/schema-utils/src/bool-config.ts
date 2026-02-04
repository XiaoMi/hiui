import { mergeProps } from './merge'

export type BoolConfig<T extends AnyObject> = boolean | T | undefined
export type ExtractBoolConfig<T> = Extract<T extends BoolConfig<infer P> ? P : T, T>

// (boolean | object) => object
export function getBoolConfig<T extends AnyObject>(
  config: BoolConfig<T>,
  dft: T,
  extra?: {
    /** 是否合并默认值 */
    mergeDft?: boolean
  }
): T | undefined {
  // 未定义或者false，返回空
  if (!config) return undefined

  // 布尔值，直接返回默认值
  if (typeof config === 'boolean') return dft

  // 根据配置决定是否要合并默认值
  const { mergeDft = false } = extra ?? {}
  return mergeDft ? mergeProps(dft, config) : config
}

// (boolean | () => boolean) => boolean
export function getBoolGetterValue<TArgs extends AnyArray>(
  getter: BoolGetter<(...args: TArgs) => boolean> | undefined,
  dft: boolean,
  params: TArgs
) {
  try {
    if (getter === undefined) return dft
    if (typeof getter === 'boolean') return getter

    return getter(...params)
  } catch (error) {
    console.log('getBoolGetterValue', error)
    return dft
  }
}
