import React, { forwardRef, useCallback, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CloseCircleFilled } from '@hi-ui/icons'
import type { HiBaseAppearanceEnum, HiBaseDataItem, HiBaseHTMLFieldProps } from '@hi-ui/core'
import { isArray } from '@hi-ui/type-assertion'
import { useLatestCallback } from '@hi-ui/use-latest'

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
      focused = false,
      invalid = false,
      readOnly = false,
      size = 'md',
      appearance = 'line',
      clearableTrigger = 'hover',
      displayRender,
      prefix,
      suffix: suffixProp,
      onMouseOver,
      onMouseLeave,
      onClear,
      label,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const displayItem = useMemo(() => {
      if (value === '') return null

      const displayItem = data.find((item) => item.id === value) || { id: value, title: value }

      return displayItem || null
    }, [value, data])

    const displayValue = useMemo(() => {
      if (!displayItem) return ''

      if (displayRender) {
        return displayRender(displayItem)
      }

      return displayItem.title
    }, [displayItem, displayRender])

    const onClearLatest = useLatestCallback(onClear)
    const handleClear = useCallback(
      (evt) => {
        if (disabled) return

        evt.stopPropagation()

        tryChangeValue(NOOP_VALUE, displayItem)
        onClearLatest?.()
      },
      [tryChangeValue, disabled, displayItem, onClearLatest]
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
    const suffix = isArray(suffixProp) ? suffixProp : [suffixProp]

    // 在开启 clearable 下展示 清除内容按钮，可点击进行内容清除
    const showClearableIcon = useMemo(() => {
      return clearable && hasValue && !disabled && (clearableTrigger === 'always' || hover)
    }, [clearable, hasValue, disabled, clearableTrigger, hover])

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}--size-${size}`,
      hasValue && `${prefixCls}--has-value`,
      focused && `focused`,
      disabled && 'disabled',
      readOnly && 'readonly',
      invalid && 'invalid'
    )

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
        {prefix ? <span className={`${prefixCls}__prefix`}>{prefix}</span> : null}
        {appearance === 'contained' ? (
          <span className={`${prefixCls}__label`}>
            {label}
            {hasValue && '：'}
          </span>
        ) : null}
        {hasValue ? (
          <span className={`${prefixCls}__value`}>{displayValue}</span>
        ) : (
          appearance !== 'contained' && (
            <span className={`${prefixCls}__placeholder`}>{placeholder}</span>
          )
        )}
        {suffix[1] ? <span className={`${prefixCls}__secondary-suffix`}>{suffix[1]}</span> : null}
        {suffix[0] || showClearableIcon ? (
          <span className={`${prefixCls}__suffix`}>
            {showClearableIcon ? (
              <span
                role="button"
                tabIndex={-1}
                className={cx(`${prefixCls}__clear`, 'active')}
                onClick={handleClear}
              >
                <CloseCircleFilled />
              </span>
            ) : (
              suffix[0]
            )}
          </span>
        ) : null}
      </div>
    )
  }
)

export interface MockInputDataItem extends HiBaseDataItem {
  /**
   * 节点 id
   */
  id: React.ReactText
  /**
   * 节点标题
   */
  title: React.ReactNode
}

export type MockInputProps = HiBaseHTMLFieldProps<
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
    onChange?: (value: React.ReactText, item: any) => void
    /**
     * 是否可清空
     */
    clearable?: boolean
    /**
     * 清除按钮展示的触发形态
     */
    clearableTrigger?: 'always' | 'hover'
    /**
     * 点击关闭按钮时触发
     */
    onClear?: () => void
    /**
     * 是否禁止使用
     */
    disabled?: boolean
    /**
     * 自定义选择后触发器所展示的内容
     */
    displayRender?: (item: MockInputDataItem) => React.ReactNode
    /**
     * 输入框占位符
     */
    placeholder?: string
    /**
     * 输入框前置内容
     */
    prefix?: React.ReactNode
    /**
     * 输入框后置内容
     */
    suffix?: React.ReactNode | React.ReactNode[]
    /**
     * 点击 Input 时触发回调
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
    /**
     * 展示数据源
     */
    data?: MockInputDataItem[]
    /**
     * 是否聚焦
     */
    focused?: boolean
    /**
     * 开启输入框只读
     */
    readOnly?: boolean
    /**
     * 设置展现形式
     */
    appearance?: HiBaseAppearanceEnum | 'contained'
    /**
     * 设置输入框 label 内容，仅在 appearance 为 contained 时生效
     */
    label?: React.ReactNode
    /**
     * 设置输入框尺寸
     */
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }
>

if (__DEV__) {
  MockInput.displayName = 'MockInput'
}
