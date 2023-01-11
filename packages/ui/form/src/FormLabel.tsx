import React, { forwardRef, ReactNode, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'
import { isNumeric } from '@hi-ui/type-assertion'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'

const _role = 'form-label'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is FormLabel
 */
export const FormLabel = forwardRef<HTMLDivElement | null, FormLabelProps>((props, ref) => {
  const i18n = useLocaleContext()

  const {
    labelWidth: labelWidthContext,
    labelPlacement: labelPlacementContext,
    showColon: showColonContext,
    contentPosition: contentPositionContext,
  } = useFormContext()

  const {
    prefixCls = _prefix,
    role = _role,
    className,
    style: styleProp,
    children,
    label,
    required = false,
    // Item’s priority is higher than Form
    labelWidth: labelWidthProp = labelWidthContext,
    showColon = showColonContext,
    contentPosition = contentPositionContext,
    labelPlacement = labelPlacementContext,
    formMessage,
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

  const colon = showColon ? i18n.get('form.colon') : null

  const cls = cx(
    prefixCls,
    className,
    required && `${prefixCls}--required`,
    labelPlacement && `${prefixCls}--placement-${labelPlacement}`
    // error && `${prefixCls}--error`,
    // validating && `${prefixCls}--validating`
  )

  const style = { ...styleProp }

  return (
    <div ref={ref} role={role} className={cls} style={style} {...rest}>
      <div className={`${prefixCls}__content`} style={{ alignItems: contentPositionMemo }}>
        {label ? (
          <label className={`${prefixCls}__content__text`} style={{ width: labelWidth }}>
            {label}
            {colon}
          </label>
        ) : (
          <span className={`${prefixCls}__content__indent`} style={{ width: labelWidth }} />
        )}
        <div className={`${prefixCls}__content__control`} style={{ width: controlWidth }}>
          {children}
        </div>
      </div>
      <div style={{ paddingLeft: `calc(100% - ${controlWidth})` }}>{formMessage}</div>
    </div>
  )
})

export interface FormLabelProps extends HiBaseHTMLProps<'div'> {
  /**
   * label 放置的位置
   */
  labelPlacement?: 'right' | 'left' | 'top'
  /**
   * 是否显示必填信号。这里不做校验处理，若需校验请使用 rules 进行设置
   */
  required?: boolean
  /**
   * 是否显示冒号
   */
  showColon?: boolean
  /**
   * label 宽度，可使用任意 CSS 长度单位。优先级高于 Form 设置的 labelWidth
   */
  labelWidth?: React.ReactText
  /**
   * label 文案
   */
  label?: React.ReactNode
  /**
   * 在 vertical 放置时，label 相对表单控件垂直对齐的方式，优先级低于 Form
   */
  contentPosition?: 'top' | 'center' | 'bottom'
  /**
   * 提示信息
   */
  formMessage?: ReactNode
}

if (__DEV__) {
  FormLabel.displayName = 'FormLabel'
}
