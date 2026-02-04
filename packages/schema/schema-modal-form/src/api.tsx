import React from 'react'
import { ModalApi } from '@hi-ui/schema-modal-extensions'
import { SchemaForm } from '@hi-ui/schema-form'
import { mergeProps } from '@hi-ui/schema-utils'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { ModalApiProps } from '@hi-ui/schema-modal-extensions'
import type { EnhancedFormRefType, SchemaFormProps } from '@hi-ui/schema-form'
import type { CheckChainValueType } from '@hi-ui/schema-utils'

type ModalFormCtxType<TData extends AnyObject = AnyObject> = {
  formRef: EnhancedFormRefType<TData>
}

export type ModalFormProps<TData extends AnyObject = AnyObject> = {
  fields: FieldConfigType[]
  initialValues?: SchemaFormProps<TData>['initialValues']
  title?: ModalApiProps['title']
  type?: ModalApiProps['type']
  width?: ModalApiProps['width']
  column?: SchemaFormProps['column']
  labelPlacement?: NonNullable<SchemaFormProps['formProps']>['labelPlacement']
  labelWidth?: NonNullable<SchemaFormProps['formProps']>['labelWidth']
  onValuesChange?: SchemaFormProps<TData>['onValuesChange']
  onConfirm?: (values: TData, ctx: ModalFormCtxType<TData>) => CheckChainValueType
  onCancel?: (ctx: ModalFormCtxType<TData>) => CheckChainValueType
  formProps?: Omit<SchemaFormProps<TData>, 'fields'>
  fieldMap?: SchemaFormProps<TData>['fieldMap']
  modalProps?: Omit<ModalApiProps, 'content'>
}

export function openModalForm<TData extends AnyObject = AnyObject>(props: ModalFormProps<TData>) {
  const formRef: EnhancedFormRefType<TData> = React.createRef()

  const formProps = mergeProps(
    {
      initialValues: props.initialValues,
      fieldMap: props.fieldMap,
      column: props.column ?? 1,
      onValuesChange: props.onValuesChange,
      formProps: {
        labelPlacement: props.labelPlacement,
        labelWidth: props.labelWidth ?? 80,
      },
    },
    props.formProps,
    {}
  ) as Omit<SchemaFormProps, 'fields'>

  const modalId = ModalApi.open({
    title: props.title,
    width: props.width,
    type: props.type,
    ...props.modalProps,
    async onConfirm() {
      const data = await formRef.current?.validate()
      if (!data) return false

      return props.onConfirm?.(data, { formRef })
    },
    async onCancel() {
      return props.onCancel?.({ formRef })
    },
    content: (
      <SchemaForm fields={props.fields} {...formProps} formRef={formRef as EnhancedFormRefType} />
    ),
  })

  return function closeModalForm() {
    ModalApi.close(modalId)
  }
}
