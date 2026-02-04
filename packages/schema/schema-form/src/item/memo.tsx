import React from 'react'
import { isEqual, pick } from 'lodash-es'
import type {
  FieldConfigType,
  FieldRendererType,
  ProFieldRenderFormItemCtx,
} from '@hi-ui/schema-core'
import type { EnhancedFormRefType, SchemaFormProps } from '../form'

// TODO 待完善类型定义
export type FormBindingProps = {
  value: unknown
  onChange: (value: unknown) => void
  onBlur: (value: unknown) => void
  invalid?: boolean | string
}

type FormBindingWrapperProps = FormBindingProps & {
  field: FieldConfigType<AnyType>
  render: Required<FieldRendererType>['renderFormItem']
  strictValueCompare: SchemaFormProps['strictValueCompare']
  rawData: AnyObject
  formRef: EnhancedFormRefType
}

export const MemoFormBinding = React.memo(
  function FormBindingWrapper(props: FormBindingWrapperProps) {
    const formBinding = pick(props, ['value', 'onChange', 'onBlur', 'invalid'])
    const el = props.render(null, {
      field: props.field,
      formBinding,
      rawData: props.rawData,
      formRef: props.formRef,
    } as ProFieldRenderFormItemCtx)

    return <>{el}</>
  },
  (prev, next) => {
    return formItemPropsAreEqual(prev, next)
  }
)

type FormBindingPropsLike = Pick<
  FormBindingWrapperProps,
  'field' | 'strictValueCompare' | 'invalid' | 'value'
>

export function formItemPropsAreEqual<T extends FormBindingPropsLike>(prev: T, next: T) {
  // 明确标记 expensive 的组件，无论何时都不由外部触发重渲染
  if (prev.field.control?.expensive) return true

  // 字段定义发生变更，直接重渲染
  if (prev.field !== next.field) return false

  // 不开启严格比较，不进行比较，直接重渲染
  if (!next.strictValueCompare) return false

  // 后面的是严格比较的逻辑，坑也在后面分别描述：

  // ③ 如果 invalid 发生变化，则不进行比较，直接更新
  // invalid 是表单项的校验信息，渲染在表单项的消息框内
  if (!isEqual(prev.invalid, next.invalid)) return false

  // ②主动标记的更新，不进行比较，直接更新
  if (prev.field?.payload?.shouldUpdate) return false

  // ①默认只比较表单绑定相关的属性
  return isEqual(prev.value, next.value)
}
