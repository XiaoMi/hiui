import React, { forwardRef, useImperativeHandle, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { FormProvider, useFormContext } from './context'
import { useForm } from './use-form'

const _role = 'form-label'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is FormLabel
 */
export const FormLabel = forwardRef<HTMLFormElement | null, FormLabelProps>(
  ({ prefixCls = _prefix, role = _role, className, children, label, align, ...rest }, ref) => {
    const formContext = useFormContext()

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <span>{label}</span>
        {children}
      </div>
    )
  }
)

export interface FormLabelProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * label 放置的位置
   * TODO: 拆成 2 个，一个表示对齐，另一个表示位置
   */
  labelPlacement: 'right' | 'left' | 'top'
  /**
   * 标记是否必填
   */
  required: boolean
  /**
   * 是否显示冒号
   */
  showColon: boolean
  /**
   * label 宽度，可使用任意 CSS 长度单位。优先级高于 Form 设置的 labelWidth
   */
  labelWidth: React.ReactText
  placement: 'horizontal' | 'vertical'
  /**
   * 校验规则，设置字段的校验逻辑
   */
  rules: object
  inline: boolean
}

if (__DEV__) {
  FormLabel.displayName = 'FormLabel'
}
