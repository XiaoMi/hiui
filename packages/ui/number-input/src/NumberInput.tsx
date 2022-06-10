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
export const NumberInput = forwardRef<HTMLDivElement | null, CounterProps>(
  ({ prefixCls = _prefix, role = _role, ...rest }, ref) => {
    const { rootProps, getInputProps, getMinusButtonProps, getPlusButtonProps } = useCounter({
      prefixCls,
      role,
      ...rest,
    })

    return (
      <div ref={ref} {...rootProps}>
        <input {...getInputProps()} />
        <div className={`${prefixCls}__suffix`}>
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

export interface NumberInputProps extends CounterProps {}

if (__DEV__) {
  NumberInput.displayName = 'NumberInput'
}
