import React, { forwardRef } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { useCounter, CounterProps } from '@hi-ui/counter'

const _role = 'input'
const _prefix = getPrefixCls('number-input')

/**
 * 数字输入框
 */
export const NumberInput = forwardRef<HTMLDivElement | null, NumberInputProps>(
  ({ prefixCls = _prefix, role = _role, prefix, suffix, styles, classNames, ...rest }, ref) => {
    const { rootProps, getInputProps, getMinusButtonProps, getPlusButtonProps } = useCounter({
      prefixCls,
      role,
      ...rest,
    })

    return (
      <div ref={ref} {...rootProps}>
        {prefix ? (
          <span className={`${prefixCls}__prefix ${classNames?.prefix}`} style={styles?.prefix}>
            {prefix}
          </span>
        ) : null}
        <input
          {...getInputProps()}
          className={`${prefixCls}__input ${classNames?.input}`}
          style={styles?.input}
        />
        {suffix ? (
          <span className={`${prefixCls}__suffix ${classNames?.suffix}`} style={styles?.suffix}>
            {suffix}
          </span>
        ) : null}
        <div className={`${prefixCls}__handler ${classNames?.handler}`} style={styles?.handler}>
          <button {...getPlusButtonProps()}>
            <UpOutlined />
          </button>
          <button {...getMinusButtonProps()}>
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
