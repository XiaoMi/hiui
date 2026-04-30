import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { useCounter, CounterProps } from '@hi-ui/counter'
import { useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

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
      classNames: classNamesProp,
      styles: stylesProp,
      size: sizeProp,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize, numberInput: numberInputConfig } = useGlobalContext()
    const size = sizeProp ?? globalSize

    const { classNames, styles } = useMergeSemantic<
      NumberInputSemanticClassNames,
      NumberInputSemanticStyles,
      NumberInputProps
    >({
      classNamesList: [numberInputConfig?.classNames, classNamesProp],
      stylesList: [numberInputConfig?.styles, stylesProp],
      info: { props: { ...rest, prefix, suffix, size } },
    })

    const { rootProps, getInputProps, getMinusButtonProps, getPlusButtonProps } = useCounter({
      prefixCls,
      role,
      size,
      classNames: { root: classNames?.root, input: classNames?.input },
      styles: { root: styles?.root, input: styles?.input },
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

export type NumberInputSemanticName = 'root' | 'prefix' | 'input' | 'suffix' | 'handler'
export type NumberInputSemanticClassNames = SemanticClassNamesType<
  NumberInputProps,
  NumberInputSemanticName
>
export type NumberInputSemanticStyles = SemanticStylesType<
  NumberInputProps,
  NumberInputSemanticName
>
export type NumberInputSemantic = ComponentSemantic<
  NumberInputSemanticClassNames,
  NumberInputSemanticStyles
>

export interface NumberInputProps
  extends Omit<CounterProps, 'classNames' | 'styles'>,
    NumberInputSemantic {
  prefix?: React.ReactNode
  placeholder?: string
  suffix?: React.ReactNode
}

if (__DEV__) {
  NumberInput.displayName = 'NumberInput'
}
