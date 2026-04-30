import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CheckOutlined } from '@hi-ui/icons'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { isUndef } from '@hi-ui/type-assertion'
import { StepperDataItem } from './types'

const _role = 'stepper-item'
const _prefix = getPrefixCls(_role)

export const StepperItem = forwardRef<HTMLDivElement | null, StepperItemProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      type = 'default',
      title,
      content,
      icon,
      step,
      current,
      ...rest
    },
    ref
  ) => {
    const active = step === current
    const done = step < current
    const pending = step > current

    const cls = cx(
      prefixCls,
      className,
      classNamesProp?.item,
      active && `${prefixCls}--active`,
      done && `${prefixCls}--done`,
      pending && `${prefixCls}--pending`
    )

    return (
      <div
        ref={ref}
        role={role}
        className={cls}
        style={{ ...style, ...stylesProp?.item }}
        {...rest}
      >
        <div
          className={cx(`${prefixCls}-status`, classNamesProp?.itemStatus)}
          style={stylesProp?.itemStatus}
        >
          {renderIcon({
            prefixCls: `${prefixCls}-status`,
            icon: icon,
            type,
            step,
            done,
          })}
        </div>
        <div
          className={cx(`${prefixCls}-tip`, classNamesProp?.itemTip)}
          style={stylesProp?.itemTip}
        >
          {isUndef(title) ? null : (
            <div
              className={cx(`${prefixCls}-tip__title`, classNamesProp?.itemTipTitle)}
              style={stylesProp?.itemTipTitle}
            >
              <div>{title}</div>
            </div>
          )}
          {isUndef(content) ? null : (
            <div
              className={cx(`${prefixCls}-tip__content`, classNamesProp?.itemTipContent)}
              style={stylesProp?.itemTipContent}
            >
              {content}
            </div>
          )}
        </div>
      </div>
    )
  }
)

export interface StepperItemProps extends HiBaseHTMLProps<'div'>, StepperDataItem {
  /**
   * 当前步骤位置索引
   */
  step: number
  /**
   * 当前正在处理中的 stepper 步骤索引
   */
  current: number
  /**
   * 默认展示 icon 类型
   */
  type?: 'dot' | 'default'
  /**
   * 语义化 classNames（由 Stepper 传入，对应 item / itemStatus / itemTip / itemTipTitle / itemTipContent）
   */
  classNames?: {
    item?: string
    itemStatus?: string
    itemTip?: string
    itemTipTitle?: string
    itemTipContent?: string
  }
  /**
   * 语义化 styles（由 Stepper 传入）
   */
  styles?: {
    item?: React.CSSProperties
    itemStatus?: React.CSSProperties
    itemTip?: React.CSSProperties
    itemTipTitle?: React.CSSProperties
    itemTipContent?: React.CSSProperties
  }
}

if (__DEV__) {
  StepperItem.displayName = 'StepperItem'
}

const renderIcon = ({
  prefixCls,
  icon,
  type,
  done,
  step,
}: {
  prefixCls: string
  icon?: React.ReactNode
  type?: 'dot' | 'default'
  done: boolean
  step: number
}) => {
  if (icon) {
    return <div className={`${prefixCls}__icon`}>{icon}</div>
  }

  if (type === 'dot') {
    return <div className={`${prefixCls}__dot`} />
  }

  return <div className={`${prefixCls}__step`}>{done ? <CheckOutlined /> : step}</div>
}
