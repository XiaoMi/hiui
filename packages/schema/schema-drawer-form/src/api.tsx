import React from 'react'
import { DrawerApi } from '@hi-ui/schema-drawer-extensions'
import { SchemaForm } from '@hi-ui/schema-form'
import { mergeProps } from '@hi-ui/schema-utils'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { DrawerApiProps } from '@hi-ui/schema-drawer-extensions'
import type { EnhancedFormRefType, SchemaFormProps } from '@hi-ui/schema-form'
import type { CheckChainValueType } from '@hi-ui/schema-utils'

type DrawerFormCtxType<TData extends AnyObject = AnyObject> = {
  formRef: EnhancedFormRefType<TData>
}

export type DrawerFormProps<TData extends AnyObject = AnyObject> = {
  fields: FieldConfigType[]
  initialValues?: SchemaFormProps<TData>['initialValues']
  title?: DrawerApiProps['title']
  width?: DrawerApiProps['width']
  showBack?: DrawerApiProps['showBack']
  column?: SchemaFormProps['column']
  labelPlacement?: NonNullable<SchemaFormProps['formProps']>['labelPlacement']
  labelWidth?: NonNullable<SchemaFormProps['formProps']>['labelWidth']
  onValuesChange?: SchemaFormProps<TData>['onValuesChange']
  onConfirm?: (values: TData, ctx: DrawerFormCtxType<TData>) => CheckChainValueType
  onCancel?: (ctx: DrawerFormCtxType<TData>) => CheckChainValueType
  formProps?: Omit<SchemaFormProps<TData>, 'fields'>
  fieldMap?: SchemaFormProps<TData>['fieldMap']
  drawerProps?: Omit<DrawerApiProps, 'content'>
}

export function openDrawerForm<TData extends AnyObject = AnyObject>(props: DrawerFormProps<TData>) {
  const formRef: EnhancedFormRefType<TData> = React.createRef()

  const formProps = mergeProps(
    {
      initialValues: props.initialValues,
      fieldMap: props.fieldMap,
      column: props.column ?? 1,
      onValuesChange: props.onValuesChange,
      formProps: {
        labelPlacement: props.labelPlacement ?? 'top',
        labelWidth: props.labelWidth ?? 120,
      },
    },
    props.formProps,
    {}
  ) as Omit<SchemaFormProps, 'fields'>

  const drawerId = DrawerApi.open({
    title: props.title,
    width: props.width,
    showBack: props.showBack,
    ...props.drawerProps,
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

  return function closeDrawerForm() {
    DrawerApi.close(drawerId)
  }
}
