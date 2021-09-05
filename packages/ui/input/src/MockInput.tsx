import React, { forwardRef, useCallback, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CloseCircleFilled } from '@hi-ui/icons'
import type { HiBaseDataItem, HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'mock-input'
const _prefix = getPrefixCls(_role)

const NOOP_VALUE = ''
const NOOP_ARRAY = [] as []

/**
 * 支持自定义渲染输入框内容，暂时仅供内部 Picker 类组件使用，不对外提供
 */
export const MockInput = forwardRef<HTMLDivElement | null, MockInputProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      data = NOOP_ARRAY,
      defaultValue = NOOP_VALUE,
      value: valueProp,
      onChange,
      placeholder,
      disabled = false,
      clearable = false,
      clearableTrigger = 'hover',
      displayRender,
      suffix,
      onMouseOver,
      onMouseLeave,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const displayValue = useMemo(() => {
      if (value === '') return null

      const displayItem = data.find((item) => item.id === value)
      if (!displayItem) return null

      if (displayRender) {
        return displayRender(displayItem)
      }

      return displayItem.title
    }, [data, value, displayRender])

    const handleClear = useCallback(
      (evt) => {
        if (disabled) return

        evt.stopPropagation()
        tryChangeValue(NOOP_VALUE)
      },
      [tryChangeValue, disabled]
    )

    const [hover, setHover] = useState(false)
    const trySetHover = useCallback(
      (hovered: boolean) => {
        if (disabled) return
        setHover(hovered)
      },
      [disabled]
    )

    const hasValue = !!displayValue

    // 在开启 clearable 下展示 清除内容按钮，可点击进行内容清除
    const showClearableIcon = clearable && hasValue && !disabled

    const cls = cx(prefixCls, className, disabled && 'disabled')

    return (
      <div
        ref={ref}
        role={role}
        className={cls}
        onMouseOver={(evt) => {
          trySetHover(true)
          onMouseOver?.(evt)
        }}
        onMouseLeave={(evt) => {
          trySetHover(false)
          onMouseLeave?.(evt)
        }}
        {...rest}
      >
        {hasValue ? (
          <span className={`${prefixCls}__value`}>{displayValue}</span>
        ) : (
          <span className={`${prefixCls}__placeholder`}>{placeholder}</span>
        )}
        {suffix || showClearableIcon ? (
          <span className={`${prefixCls}__suffix`}>
            {showClearableIcon ? (
              <span
                role="button"
                tabIndex={-1}
                className={cx(
                  `${prefixCls}__clear`,
                  (clearableTrigger === 'always' || hover) && 'active'
                )}
                onClick={handleClear}
              >
                <CloseCircleFilled />
              </span>
            ) : (
              suffix
            )}
          </span>
        ) : null}
      </div>
    )
  }
)

export type MockInputProps = HiBaseHTMLProps<
  'div',
  {
    /**
     * 设置当前多选值
     */
    value?: React.ReactText
    /**
     * 设置当前多选值默认值
     */
    defaultValue?: React.ReactText
    /**
     * 多选值改变时的回调
     */
    onChange?: (values: React.ReactText) => void
    /**
     * 是否可清空
     */
    clearable?: boolean
    /**
     * 清除按钮展示的触发形态
     */
    clearableTrigger?: 'always' | 'hover'
    /**
     * 是否禁止使用
     */
    disabled?: boolean
    /**
     * 自定义选择后触发器所展示的内容
     */
    displayRender?: (item: HiBaseDataItem) => React.ReactNode
    /**
     * 输入框占位符
     */
    placeholder?: string
    /**
     * 输入框后置内容
     */
    suffix?: React.ReactNode
    /**
     * 点击 Input 时触发回调
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
    /**
     * 展示数据源
     */
    data?: HiBaseDataItem[]
  }
>

if (__DEV__) {
  MockInput.displayName = 'MockInput'
}
