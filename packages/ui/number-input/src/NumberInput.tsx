import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { useCounter, CounterProps } from '@hi-ui/counter'
import { useGlobalContext } from '@hi-ui/core'

const _role = 'input'
const _prefix = getPrefixCls('number-input')

/**
 * 数字输入框
 */
export const NumberInput = forwardRef<HTMLDivElement | null, NumberInputProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      prefix,
      suffix,
      styles,
      classNames,
      size: sizeProp,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize } = useGlobalContext()
    const size = sizeProp ?? globalSize

    const { rootProps, getInputProps, getMinusButtonProps, getPlusButtonProps } = useCounter({
      prefixCls,
      role,
      size,
      ...rest,
    })

    return (
      <div ref={ref} {...rootProps}>
        {prefix ? (
          <span className={cx(`${prefixCls}__prefix`, classNames?.prefix)} style={styles?.prefix}>
            {prefix}
          </span>
        ) : null}
        <input
          {...getInputProps()}
          className={cx(`${prefixCls}__input`, classNames?.input)}
          style={styles?.input}
        />
        {suffix ? (
          <span className={cx(`${prefixCls}__suffix`, classNames?.suffix)} style={styles?.suffix}>
            {suffix}
          </span>
        ) : null}
        <div className={cx(`${prefixCls}__handler`, classNames?.handler)} style={styles?.handler}>
          <button {...getPlusButtonProps()} type="button">
            <UpOutlined />
          </button>
          <button {...getMinusButtonProps()} type="button">
            <DownOutlined />
          </button>
        </div>
      </div>
    )
  }
)

export interface NumberInputProps extends CounterProps {
  prefix?: React.ReactNode
  placeholder?: string
  suffix?: React.ReactNode
  styles?: {
    input?: React.CSSProperties
    prefix?: React.CSSProperties
    suffix?: React.CSSProperties
    handler?: React.CSSProperties
  }
  classNames?: {
    input?: string
    prefix?: string
    suffix?: string
    handler?: string
  }
}

if (__DEV__) {
  NumberInput.displayName = 'NumberInput'
}
