import { useRef } from 'react'

// 仅保留用作内部引用判断，无其他意义
const dftRef = { _current: null }

export type ReadonlyRefObject<T> = {
  readonly current: T
}

export function useReadonlyRef<T>(factory: () => T) {
  return useMutableRef(factory) as ReadonlyRefObject<T>
}

export type MutableRefObject<T> = {
  current: T
}

/**
 * 可修改的 ref 引用
 * @desc 与原始 useRef 的差别有二
 * @desc 其一是初始值需接收工厂函数生成，工厂函数仅会在初始渲染时执行一次
 * @desc 其二是返回值类型中不会有 null
 */
export function useMutableRef<T>(factory: () => T) {
  const ref = useRef<T>(dftRef as T) // 必定会被覆盖

  // 仅在初始渲染时执行 factory
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore 仅允许此处赋值
  if (ref.current === dftRef) ref.current = factory()

  return ref as MutableRefObject<T>
}
