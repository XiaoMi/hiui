import React from 'react'
import type { FieldConfigType } from '@hi-ui/schema-core'
import { ProText } from './fields/semantic/text'
import type { ProFieldMapType } from '.'

const FieldMapCtx = React.createContext<ProFieldMapType>(null as unknown as ProFieldMapType)

export function FieldMapProvider(
  props: React.PropsWithChildren<{ fields: Partial<ProFieldMapType> }>
) {
  const { children, fields } = props
  return <FieldMapCtx.Provider value={fields as ProFieldMapType}>{children}</FieldMapCtx.Provider>
}

export type UseFieldMapOpts = {
  /** 自定义字段渲染器映射配置 */
  fieldMap?: Partial<ProFieldMapType>
}

export function useFieldMap(opts: UseFieldMapOpts = {}) {
  const ctx = React.useContext(FieldMapCtx)
  const { fieldMap } = opts

  if (fieldMap) return fieldMap as ProFieldMapType

  if (!ctx) {
    console.warn(`SchemaComponents: 未找到 FieldsContext，将使用默认的 Text 渲染器`)
    return { text: ProText } as ProFieldMapType
  }
  return ctx
}

export type MatchFieldClassOpts = UseFieldMapOpts & {
  name?: string
  field: FieldConfigType
  fieldMap: ProFieldMapType // 必传，此处已经必须有明确的 fieldMap
}

export function matchFieldClass(opts: MatchFieldClassOpts) {
  const { field, fieldMap } = opts

  const matchedFieldClass = fieldMap[field.valueType as keyof ProFieldMapType]
  const FieldClass = matchedFieldClass || ProText
  if (!matchedFieldClass && field.valueType !== 'custom') {
    const _name = opts.name || 'matchFieldClass'
    const _type = field.valueType
    console.warn(`${_name}: 未找到 ValueType "${_type}" 对应的渲染器，将使用默认的 Text 渲染器\n`)
  }

  return FieldClass
}

export type UseMatchFieldClassOpts = Omit<MatchFieldClassOpts, 'fieldMap'> & {
  fieldMap?: ProFieldMapType // 非必传，也可由内部上下文提供
}

export function useMatchFieldClass(opts: UseMatchFieldClassOpts) {
  // 获取字段渲染器
  const fieldMap = useFieldMap(opts)
  return matchFieldClass({ ...opts, fieldMap })
}
