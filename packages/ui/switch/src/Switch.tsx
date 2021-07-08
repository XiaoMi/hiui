import React, { forwardRef, useEffect, useState, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'switch'
const _prefix = getPrefixCls(_role)

/**
* TODO: What is Switch
*/
export const Switch = forwardRef<HTMLSpanElement | null, SwitchProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      onChange,
      content,
      checked,
      defaultChecked,
      disabled,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    const [value, setValue] = useState(checked || defaultChecked || false)

    useEffect(() => {
      if (checked !== undefined) {
        setValue(checked)
      }
    }, [checked])

    const changeSwitch = useCallback(
      (e: React.MouseEvent | React.KeyboardEvent) => {
        if (!disabled) {
          if (onChange) {
            onChange(!value)
          }
          if (checked === undefined) {
            setValue(!value)
          }
        }
      },
      [disabled, onChange, checked, value]
    )

    const handleKeydown = useCallback(
      (e: React.KeyboardEvent) => {
        if ([13, 32].includes(e.keyCode)) {
          e.stopPropagation()
          e.preventDefault()
          changeSwitch(e)
        }
      },
      [changeSwitch]
    )


    return (
      <span
        ref={ref}
        role={role}
        className={cx(cls, {
          [`${cls}--closed`]: !value,
          [`${cls}--disabled`]: disabled,
        })}
        tabIndex={disabled ? -1 : 0}
        onClick={changeSwitch}
        onKeyDown={handleKeydown}
        {...rest}>
        {content && content.length === 2 && <span className={`${cls}__text`}>{value ? content[0] : content[1]}</span>}
      </span>
    )
  }
)

export interface SwitchProps {
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
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否选中
   */
  checked?: boolean
  /**
   * 是否默认选中
   */
  defaultChecked?: boolean

  /**
   * 值改变事件
   */
  onChange?: (checked: boolean) => void
  /**
   * 开关状态内容，数组第一项为关闭时显示的内容，第二项为开启时显示的
   */
  content?: [React.ReactNode, React.ReactNode]
}

if (__DEV__) {
  Switch.displayName = 'Switch'
}
