import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'

const _prefix = getPrefixCls('switch')

/**
 * 开关
 */
export const Switch = forwardRef<HTMLDivElement | null, SwitchProps>(
  (
    {
      prefixCls = _prefix,
      className,
      size: sizeProp,
      onChange,
      content,
      checked: checkedProp,
      defaultChecked = false,
      disabled = false,
      onClick,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize } = useGlobalContext()
    let size = sizeProp ?? globalSize ?? 'md'
    if (size === 'xs') {
      size = 'sm'
    }

    const [checked, tryChangeChecked] = useUncontrolledState(defaultChecked, checkedProp, onChange)

    const changeSwitch = useCallback(() => {
      if (disabled) return
      tryChangeChecked((prev) => !prev)
    }, [disabled, tryChangeChecked])

    const handleKeydown = useCallback(
      (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if ([13, 32].includes(evt.keyCode)) {
          evt.preventDefault()
          evt.stopPropagation()

          changeSwitch()
        }
      },
      [changeSwitch]
    )

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--${checked ? 'open' : 'closed'}`,
      disabled && `${prefixCls}--disabled`,
      size && `${prefixCls}--size-${size}`
    )

    return (
      <div
        ref={ref}
        role="switch"
        className={cls}
        tabIndex={disabled ? -1 : 0}
        onClick={mockDefaultHandlers(onClick, changeSwitch)}
        onKeyDown={mockDefaultHandlers(onKeyDown, handleKeydown)}
        {...rest}
      >
        {Array.isArray(content) && content.length === 2 ? (
          <span className={`${prefixCls}__text`}>{checked ? content[0] : content[1]}</span>
        ) : null}
        <span className={`${prefixCls}__handle`} />
      </div>
    )
  }
)

export interface SwitchProps extends HiBaseHTMLProps<'div'> {
  /**
   * 开关大小
   */
  size?: 'sm' | 'md' | 'lg'
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
   * 开关状态内容，数组第一项为关闭时显示的内容，第二项为开启时显示的
   */
  content?: [React.ReactNode, React.ReactNode]
  /**
   * 状态改变时的回调
   */
  onChange?: (checked: boolean) => void
}

if (__DEV__) {
  Switch.displayName = 'Switch'
}
