import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { LeftOutlined, RightOutlined } from '@hi-ui/icons'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'pagination'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is PagerButton
 */
export const PagerButton = forwardRef<HTMLButtonElement | null, PagerButtonProps>(
  (
    { prefixCls = _prefix, onChange, type = 'prev', current = 1, disabled = false, onClick },
    ref
  ) => {
    const handleChange = useCallback(() => {
      if (onChange && !disabled) {
        onChange(type === 'prev' ? current - 1 : current + 1)
      }
    }, [current, onChange, type, disabled])

    const handleKeyPress = useCallback(
      (evt) => {
        if (evt.key === 'Enter' && !disabled) {
          evt.preventDefault()
          handleChange()
        }
      },
      [handleChange, disabled]
    )

    const cls = cx(`${prefixCls}__btn`, disabled && `${prefixCls}__btn--disabled`)

    return (
      <li
        className={cls}
        onClick={(evt) => {
          handleChange()
          onClick?.(evt)
        }}
        onKeyPress={handleKeyPress}
      >
        <button ref={ref} disabled={disabled}>
          {type === 'prev' ? <LeftOutlined /> : <RightOutlined />}
        </button>
      </li>
    )
  }
)

export interface PagerButtonProps extends HiBaseHTMLProps<'li'> {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 当前页码
   */
  current?: number
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 点击事件
   */
  onChange?: (page: number) => void
  /**
   * 类型
   */
  type: 'prev' | 'next'
}

if (__DEV__) {
  PagerButton.displayName = 'PagerButton'
}
