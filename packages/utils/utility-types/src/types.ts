/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'

// <global-d.ts-source>
export type AnyType = any
export type Dict<T> = Record<string, T>
export type AnyObject = Record<string, any>
export type AnyArray = any[]
export type UnknownObject = Record<string, unknown>
export type AnyFn = (...args: any[]) => any
export type AnyClass = new (...args: AnyType[]) => AnyType
export type AnyComponent = React.ComponentType<AnyType>
export type PipeFn<T, Extra = AnyObject> = (value: T, extra?: Extra) => T

export type ArrayToUnion<T extends any[]> = T[number]

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export type FnParameters<T extends AnyFn> = Parameters<T>[0]

export type Optionals<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type LiteralUnion<T extends U, U = string> =
  | T
  | (Pick<U, never> & { _IGNORE_ME?: never | undefined })

export type ValueOf<T> = T[keyof T]

export type MaybeAsync<T> = T | Promise<T>

export type Primitive = string | number | boolean
/** 非函数类型 */
export type NonFnValue = Primitive | AnyObject | AnyArray

/** 引用类型的字段路径 */
export type FieldPath = string | number | (string | number)[]

/** 获取器函数 */
export type GetterFn<T extends NonFnValue, TArgs extends any[] = any[]> = (...args: TArgs) => T
/** 获取器(函数或值) */
export type AnyGetter<TGetter extends GetterFn<AnyType, AnyArray>> =
  /** 如果 TGetter 是 GetterFn<infer T, infer TArgs> 类型，则返回 T | GetterFn<T, TArgs> */
  /** 否则返回 never */
  TGetter extends GetterFn<infer T, infer TArgs> ? T | GetterFn<T, TArgs> : never
/** 布尔值获取器函数 */
export type GetBoolFn = GetterFn<boolean>
/** 布尔值获取器 */
export type BoolGetter<TGetter extends GetBoolFn> = TGetter extends GetterFn<boolean, infer TArgs>
  ? boolean | GetterFn<boolean, TArgs>
  : never
// </global-d.ts-source>
