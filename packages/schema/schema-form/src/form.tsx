import React, { useMemo, useRef } from 'react'
import { cx } from '@hi-ui/classname'
import { useLatest } from 'ahooks'
import Form from '@hi-ui/form'
import type { FormProps } from '@hi-ui/form'
import { mergeProps, Schedular } from '@hi-ui/schema-utils'
import { useSubscription } from '@hi-ui/use-subscription'
import { useTickState } from '@hi-ui/schema-hooks'
import { DependencyCtx, type DependencyCtxType } from './dependency/ctx'
import type { DynamicGridHelperProps } from '@hi-ui/auto-grid'
import type { FieldConfigType, GroupConfigType, FormGroupType } from '@hi-ui/schema-core'
import type { UseFieldMapOpts } from '@hi-ui/schema-fields'
import type { GroupContainerProps } from '@hi-ui/group'
import type { ReadonlyRefObject } from '@hi-ui/schema-hooks'
import { SchemaFormCtx, type SchemaFormCtxType } from './ctx'
import { usePropsRef } from './hooks/use-props'
import { useFormRef, type EnhancedFormHelpers, type EnhancedFormRefType } from './ref'
import { FormControlRefType, useFormControlRef } from './ref-control'
import { SchemaFormRender } from './render'
import type { TransformedFormFields } from './item/mapper'
import type { FormItemWrapperProps } from './type'
import './index.scss'

export type { EnhancedFormRefType }

export type CustomFormContentType<TData extends AnyObject = AnyObject> = (
  formFields: TransformedFormFields,
  ctx: { formRef: EnhancedFormRefType<TData>; group: GroupConfigType }
) => React.ReactElement

// @doc-comment-start code-block
// ---
// title: SchemaFormProps
// api:
//   for: form.basic
//   order: 10
// ---
export type SchemaFormProps<TData extends AnyObject = AnyObject> = UseFieldMapOpts & {
  /** 表单字段配置 */
  fields: FieldConfigType<AnyObject, FormItemWrapperProps>[]
  /** 表单组配置 */
  groups?: GroupConfigType<FormGroupType>[]
  /** 表单初始值 */
  initialValues?: Partial<TData>
  /** 表单项值变更触发的回调 */
  onValuesChange?: (changedValues: Partial<TData>, allValues: Partial<TData>) => void
  /** 表单提交触发的回调 */
  onSubmit?: FormProps['onSubmit']
  /** 是否开启网格布局，默认开启 */
  grid?: boolean
  /** 表单控制实例 */
  formRef?: EnhancedFormRefType<TData>
  controlRef?: FormControlRefType
  /** 透传的表单容器样式 */
  className?: string

  /** 表单项列数，默认3 */
  column?: DynamicGridHelperProps['columnCount']
  /** 网格布局的包裹元素 */
  gridWrapperElRef?: DynamicGridHelperProps['wrapperElRef']

  /**
   * 是否开启表单项值严格比较更新，用以渲染性能优化，默认关闭
   * @desc 开启后，表单项值变更时，会进行严格比较，只有值发生变化时，才会触发更新
   * @desc 关闭后，任意表单项值变更时，会直接触发全部表单项更新
   * @desc 开启时，`onValuesChange`的`allValues`会从`formRef`中获取，否则会直接使用默认触发的`allValues`
   */
  strictValueCompare?: boolean

  /**
   * 自定义表单(组)内容
   * @desc 会在组间渲染时，被多次调用
   */
  renderFormContent?: CustomFormContentType<TData>
  /** 全量自定义表单内容 */
  children?: React.ReactElement

  /** 透传的表单配置 */
  formProps?: Omit<DeepPartial<FormProps>, 'className' | 'innerRef' | 'onValuesChange'>
  /** 透传的网格布局配置 */
  gridProps?: DeepPartial<DynamicGridHelperProps>
  /** 是否给全部【组】元素增加边框，默认开启 */
  borderedGroups?: GroupContainerProps['bordered']
  /** 透传的组容器配置 */
  collapseProps?: GroupContainerProps['collapseProps']
  /** 是否在表单全局开启只读模式 */
  readonly?: boolean
}
// @doc-comment-end code-block

export function SchemaForm<TData extends AnyObject = AnyObject>(props: SchemaFormProps<TData>) {
  const { propsRef } = usePropsRef(props)
  const { initialValues, strictValueCompare } = propsRef.current

  const formValue = useSubscription<TData>(initialValues as TData, {
    // form的值相对较少，setValue 开启严格比较，以提升变更检查的准确性
    strictCompareWhenSetValue: true,
  })
  const [tickState, setTickState] = useTickState()

  const formElRef = useRef<HTMLFormElement>(null)
  const controlRef = useFormControlRef()
  const { formRef, innerFormRef } = useFormRef({ formValue, setTickState })
  React.useImperativeHandle(props.formRef, () => formRef.current as EnhancedFormHelpers<TData>)
  React.useImperativeHandle(props.controlRef, () => controlRef.current)

  const handleValuesChange = (changedValues: Partial<TData>, allValues: Partial<TData>) => {
    // NOTE 严格比较时，内部仅在表单项自己的值变更时，才会触发自身更新
    // 此时实测初次变更时，默认传入的 allValues 仅包含变更的字段，导致Dependency联动失效
    // 因此需要【延迟时间】并【手动获取】
    if (strictValueCompare) {
      Schedular.nextMicro(() => {
        const allValues = formRef.current?.getFieldsValue() as Partial<TData>
        props.onValuesChange?.(changedValues, allValues)
        formValue.setValue(allValues as TData)
        setTickState()
      })
    } else {
      props.onValuesChange?.(changedValues, allValues)
      formValue.setValue(allValues as TData)
      setTickState()
    }
  }
  // prettier-ignore
  const handleValuesChangeRef = useLatest(handleValuesChange) as ReadonlyRefObject<typeof handleValuesChange>

  // 不要通过 mergeProps 合并 ref
  // 本质是 gridProps?.wrapperElRef || props.gridWrapperElRef || formElRef
  // NOTE ref套ref，目的是要把 gridWrapperElRef 通过 ctx 传递
  const gridWrapperElRef = useLatest(propsRef.current.gridWrapperElRef || formElRef)

  const formProps = mergeProps(propsRef.current.formProps, {
    className: cx('schema-form', props.className),
    onValuesChange: handleValuesChange,
  } as FormProps) as FormProps

  const formCtx = useMemo(() => {
    return {
      formValue,
      tickState,
      setTickState,
      formRef,
      controlRef,
      propsRef,
      formElRef,
      gridWrapperElRef: gridWrapperElRef as React.MutableRefObject<React.RefObject<HTMLElement>>,
      handleValuesChangeRef,
    }
  }, [
    formValue,
    tickState,
    setTickState,
    formRef,
    controlRef,
    propsRef,
    formElRef,
    gridWrapperElRef,
    handleValuesChangeRef,
  ])

  const DepCtx = DependencyCtx as React.Context<DependencyCtxType<TData>>
  const FormCtx = SchemaFormCtx as React.Context<SchemaFormCtxType<TData>>
  return (
    <DepCtx.Provider value={{ subscription: formValue }}>
      <FormCtx.Provider value={formCtx}>
        <Form {...formProps} innerRef={innerFormRef} ref={formElRef} data-readonly={props.readonly}>
          {propsRef.current.children || <SchemaFormRender />}
        </Form>
      </FormCtx.Provider>
    </DepCtx.Provider>
  )
}
