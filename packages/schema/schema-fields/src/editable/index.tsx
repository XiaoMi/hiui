import React from 'react'
import { useMatchFieldClass } from '../ctx'
import type { UseFieldMapOpts } from '../ctx'
import type { ProFieldMapType } from '../index'
import { useReadonly } from './use-readonly'
import { isSimpleCase, SimpleCase } from './simple'
import { ReadonlyCase, type ReadonlyCaseProps, type UsedBy } from './readonly'
import { EditableCase, type EditableCaseProps } from './editable'

export { isReadonly, useReadonly, runDynamicEditable } from './use-readonly'

export type EditableFieldProps<T extends UsedBy = 'other'> = UseFieldMapOpts &
  Omit<EditableCaseProps, 'FieldClass'> &
  Pick<ReadonlyCaseProps<T>, 'usedBy'> & {
    /** 运行时的可编辑状态(可选),优先级最高 */
    runtimeEditable?: boolean
  }

export function EditableField<T extends UsedBy = 'other'>(props: EditableFieldProps<T>) {
  const { field, ctx, value, usedBy = 'other' } = props

  // 获取字段渲染器
  const FieldClass = useMatchFieldClass({
    name: 'EditableFieldWrapper',
    field,
    fieldMap: props.fieldMap as ProFieldMapType,
  })

  const readonly = useReadonly(field, props.runtimeEditable)

  // 简单字段且无自定义渲染，使用 SimpleCase
  if (isSimpleCase(field)) return <SimpleCase value={value} />

  const passedProps: EditableCaseProps = { field, ctx, value, FieldClass }
  if (readonly) return <ReadonlyCase {...passedProps} usedBy={usedBy} />
  else return <EditableCase {...passedProps} />
}

export {
  // export
  SimpleCase,
  ReadonlyCase,
  EditableCase,
  isSimpleCase,
}

export type {
  // export
  ReadonlyCaseProps,
  EditableCaseProps,
  UsedBy,
}

export * from './ctx'
export * from './type'
