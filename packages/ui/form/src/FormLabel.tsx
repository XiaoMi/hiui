import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'
import { isNumeric } from '@hi-ui/type-assertion'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'form-label'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is FormLabel
 */
export const FormLabel = forwardRef<HTMLDivElement | null, FormLabelProps>((props, ref) => {
  const {
    // @ts-ignore
    labelWidth: labelWidthContext,
    // @ts-ignore
    labelPlacement,
    // @ts-ignore
    colon: colonContext,
    // @ts-ignore
    contentPosition: contentPositionContext,
  } = useFormContext()

  const {
    prefixCls = _prefix,
    role = _role,
    className,
    style: styleProp,
    children,
    label,
    // @ts-ignore
    field,
    required = false,
    // Item’s priority is higher than Form
    labelWidth: labelWidthProp = labelWidthContext,
    colon = colonContext,
    // @ts-ignore
    contentPosition = contentPositionContext,
    ...rest
  } = props

  const { labelWidth, controlWidth } = useMemo(() => {
    if (labelPlacement === 'top')
      return {
        labelWidth: '100%',
        controlWidth: '100%',
      }

    const labelWidth = isNumeric(labelWidthProp) ? Number(labelWidthProp) : labelWidthProp

    return {
      labelWidth,
      controlWidth: `calc(100% - ${labelWidth}px)`,
    }
  }, [labelPlacement, labelWidthProp])

  // 指定子元素位置
  const contentPositionMemo = useMemo(() => {
    switch (contentPosition) {
      case 'top':
        return 'flex-start'
      case 'bottom':
        return 'flex-end'
      default:
        return 'center'
    }
  }, [contentPosition])

  const colonMemo = useMemo(() => (colon ? ':' : null), [colon])

  const cls = cx(
    prefixCls,
    className,
    required && `${prefixCls}--required`,
    labelPlacement && `${prefixCls}--placement-${labelPlacement}`
    // error && `${prefixCls}--error`,
    // validating && `${prefixCls}--validating`
  )

  const style = { ...styleProp, alignItems: contentPositionMemo }

  return (
    <div ref={ref} role={role} className={cls} style={style} {...rest}>
      {label ? (
        <label className={`${prefixCls}__text`} style={{ width: labelWidth }}>
          {label}
          {colonMemo}
        </label>
      ) : (
        <span className={`${prefixCls}__indent`} style={{ width: labelWidth }} />
      )}
      <div className={`${prefixCls}__control`} style={{ width: controlWidth }}>
        {children}
      </div>
    </div>
  )
})

export interface FormLabelProps extends HiBaseHTMLProps<'div'> {
  /**
   * label 放置的位置
   */
  labelPlacement?: 'right' | 'left' | 'top'
  /**
   * 标记是否必填
   */
  required?: boolean
  /**
   * 是否显示冒号
   */
  colon?: boolean
  /**
   * label 宽度，可使用任意 CSS 长度单位。优先级高于 Form 设置的 labelWidth
   */
  labelWidth?: React.ReactText
  /**
   * label 文案
   */
  label?: React.ReactNode
}

if (__DEV__) {
  FormLabel.displayName = 'FormLabel'
}
