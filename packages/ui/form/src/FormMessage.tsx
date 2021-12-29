import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'

const _role = 'form-message'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is FormMessage
 */
export const FormMessage = forwardRef<HTMLSpanElement | null, FormMessageProps>(
  ({ prefixCls = _prefix, role = _role, className, children, field, ...rest }, ref) => {
    const { getFieldError } = useFormContext()

    // field 支持数组，递归去设置或者获取对象中的属性值
    // 如何变成映射的 key，特殊处理化
    const message: any = field ? getFieldError(field) : null

    const cls = cx(prefixCls, className, message && `${prefixCls}--show`)

    return (
      <span ref={ref} role={role} className={cls} {...rest}>
        {/* @ts-ignore */}
        {message}
      </span>
    )
  }
)

export interface FormMessageProps {
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
   * 	字段名
   */
  field?: string
}

if (__DEV__) {
  FormMessage.displayName = 'FormMessage'
}
