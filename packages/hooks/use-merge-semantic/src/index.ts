import React, { useMemo } from 'react'
import { cx } from '@hi-ui/classname'

/**
 * 合并语义化类名和样式
 *
 * @param classNamesList 语义化类名列表
 * @param stylesList 语义化样式列表
 * @param info 组件信息
 * @returns 语义化类名和样式
 */
export const useMergeSemantic = <
  ClassNamesType extends AnyObject = AnyObject,
  StylesType extends AnyObject = AnyObject,
  Props extends AnyObject = AnyObject
>({
  classNamesList,
  stylesList,
  info,
}: UseMergeSemanticProps<ClassNamesType, StylesType, Props>) => {
  const classNames = useMemo(() => {
    // 处理函数和过滤 undefined
    const resolvedClassNames = classNamesList
      .map((className) => {
        if (typeof className === 'function') {
          return className(info)
        }
        return className
      })
      .filter(Boolean)

    // 合并所有对象，对于相同 key 的类名用 cx 合并
    const merged: Partial<Record<string, string>> = {}
    resolvedClassNames.forEach((obj) => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
          const value = obj[key]
          if (value !== undefined && value !== null) {
            if (key in merged && !merged[key]?.includes(value)) {
              // 如果已存在，且类名列表中不包含 value，用 cx 合并类名
              merged[key] = cx(merged[key], value) as string
            } else {
              merged[key] = typeof value === 'string' ? value : String(value)
            }
          }
        })
      }
    })

    return merged as UnwrapResolvable<ClassNamesType>
  }, [classNamesList, info])

  const styles = useMemo(() => {
    // 处理函数和过滤 undefined
    const resolvedStyles = stylesList
      .map((style) => {
        if (typeof style === 'function') {
          return style(info)
        }
        return style
      })
      .filter(Boolean)

    // 合并所有样式对象（深度合并）
    const merged: Partial<Record<string, React.CSSProperties>> = {}
    resolvedStyles.forEach((obj) => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
          const value = obj[key]
          if (value !== undefined && value !== null) {
            if (key in merged) {
              // 如果已存在，深度合并样式对象
              merged[key] = { ...merged[key], ...value } as React.CSSProperties
            } else {
              merged[key] = value as React.CSSProperties
            }
          }
        })
      }
    })

    return merged as UnwrapResolvable<StylesType>
  }, [stylesList, info])

  return { classNames, styles }
}

export interface UseMergeSemanticProps<
  ClassNamesType extends AnyObject,
  StylesType extends AnyObject,
  Props extends AnyObject
> {
  classNamesList: MaybeFn<ClassNamesType, Props>[]
  stylesList: MaybeFn<StylesType, Props>[]
  info: { props: Props }
}

export type UseMergeSemanticReturn = ReturnType<typeof useMergeSemantic>

type MaybeFn<T, P> = T | ((info: { props: P }) => T) | undefined

type AnyObject = Record<PropertyKey, any>

type Resolvable<T, P extends AnyObject> = T | ((info: { props: P }) => T)

type UnwrapResolvable<T> = T extends (info: any) => infer R
  ? R extends Readonly<infer U>
    ? U
    : R
  : T extends Readonly<infer U>
  ? U
  : T

/**
 * 语义化类名
 */
export type SemanticClassNames<Name extends string> = Partial<Record<Name, string>>

/**
 * 语义化样式
 */
export type SemanticStyles<Name extends string> = Partial<Record<Name, React.CSSProperties>>

export type SemanticClassNamesType<
  Props extends AnyObject,
  SemanticName extends string
> = Resolvable<Readonly<SemanticClassNames<SemanticName>>, Props>

export type SemanticStylesType<Props extends AnyObject, SemanticName extends string> = Resolvable<
  Readonly<SemanticStyles<SemanticName>>,
  Props
>

export interface ComponentSemantic<
  SemanticClassNamesType extends AnyObject,
  SemanticStylesType extends AnyObject
> {
  classNames?: SemanticClassNamesType
  styles?: SemanticStylesType
}
