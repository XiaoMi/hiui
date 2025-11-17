import React, { forwardRef, useImperativeHandle, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__, invariant } from '@hi-ui/env'
import { FormProvider } from './context'
import { useForm, UseFormProps } from './use-form'
import { HiBaseHTMLProps, HiBaseSizeEnum, useGlobalContext } from '@hi-ui/core'
import { FormRuleModel, FormHelpers } from './types'

const _role = 'form'
const _prefix = getPrefixCls(_role)

// form 注册表
export const FORM_REGISTER_TABLE: Record<string, FormRuleModel> = {}

/**
 * 表单
 */
export const Form = forwardRef<HTMLFormElement | null, FormProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      innerRef,
      labelWidth,
      labelPlacement = 'right',
      placement = 'vertical',
      contentPosition = 'center',
      showRequiredOnValidateRequired = false,
      showColon,
      showValidateMessage = true,
      size: sizeProp,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize } = useGlobalContext()
    const size = sizeProp ?? globalSize

    const formContext = useForm({ ...rest, size })

    const { getRootProps } = formContext

    // @ts-ignore
    useImperativeHandle(innerRef, () => {
      return {
        validate: formContext.submitForm,
        reset: formContext.resetForm,
        validateField: formContext.validateFieldState,
        setFieldValue: formContext.setFieldValue,
        setFieldsValue: formContext.setFieldsValue,
        getFieldValue: formContext.getFieldValue,
        getFieldsValue: formContext.getFieldsValue,
        getFieldError: formContext.getFieldError,
        getFieldsError: formContext.getFieldsError,
        clearValidates: formContext.resetErrors,
        clearFieldValidate: formContext.resetFieldError,
      }
    })

    const providedValue = useMemo(() => {
      return {
        labelWidth,
        labelPlacement,
        showColon,
        contentPosition,
        showRequiredOnValidateRequired,
        showValidateMessage,
        ...formContext,
        prefixCls,
      }
    }, [
      labelWidth,
      labelPlacement,
      showColon,
      contentPosition,
      showRequiredOnValidateRequired,
      showValidateMessage,
      formContext,
      prefixCls,
    ])

    const cls = cx(prefixCls, className, placement && `${prefixCls}--placement-${placement}`)

    return (
      // @ts-ignore
      <FormProvider value={providedValue}>
        <form ref={ref} role={role} className={cls} {...getRootProps()}>
          {children}
        </form>
      </FormProvider>
    )
  }
)

export interface FormProps<Values = Record<string, any>>
  extends Omit<HiBaseHTMLProps<'form'>, 'onSubmit' | 'onReset'>,
    UseFormProps<Values> {
  /**
   * 提供辅助方法的内部引用
   */
  innerRef?: React.Ref<FormHelpers<Values>>
  /**
   * label 宽度，可用任意 CSS 长度单位
   */
  labelWidth?: React.ReactText
  /**
   * label 对齐的方式
   */
  labelPlacement?: 'left' | 'right' | 'top'
  /**
   * label 和表单控件的放置方式
   */
  placement?: 'vertical' | 'horizontal'
  /**
   * 在 vertical 放置时，label 相对表单控件垂直对齐的方式
   */
  contentPosition?: 'top' | 'center' | 'bottom'
  /**
   * 配置是否展示冒号
   */
  showColon?: boolean
  /**
   * FormItem 开启 filed 的 required 校验时，展示红色星号
   */
  showRequiredOnValidateRequired?: boolean
  /**
   * 是否显示校验提示
   * @default true
   */
  showValidateMessage?: boolean
  /**
   * 设置表单尺寸
   */
  size?: HiBaseSizeEnum
}

if (__DEV__) {
  Form.displayName = 'Form'
}

const formExtends = (model: FormRuleModel) => {
  // @ts-ignore
  if (typeof model.name === 'string') {
    // @ts-ignore
    FORM_REGISTER_TABLE[model.name] = model
  } else {
    invariant(false, 'The name should be unique string and not empty.')
  }
}

Object.assign(Form, { extends: formExtends })
