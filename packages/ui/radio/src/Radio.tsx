import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLFieldProps, useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { useRadio, UseRadioProps } from './use-radio'
import { useRadioGroupContext } from './context'
import { isNullish } from '@hi-ui/type-assertion'
import { callAllFuncs } from '@hi-ui/func-utils'

const RADIO_PREFIX = getPrefixCls('radio')

/**
 * 单选
 */
export const Radio = forwardRef<HTMLLabelElement | null, RadioProps>(
  (
    {
      prefixCls = RADIO_PREFIX,
      role = 'radio',
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      ...rest
    },
    ref
  ) => {
    const groupContext = useRadioGroupContext()
    const {
      disabled: disabledContext,
      isChecked: isCheckedContext,
      name: nameContext,
      onChange: onChangeContext,
      type = 'default',
      // From the use, Radio can be separated from RadioGroup.
    } = groupContext || {}

    const {
      checked: checkedProp,
      value: valueProp,
      // Group's priority is lower than its own.
      disabled = disabledContext,
      name = nameContext,
      onChange: onChangeProp,
    } = rest

    // Group's priority is higher than its own.
    const checked =
      isCheckedContext && !isNullish(valueProp) ? isCheckedContext(valueProp) : checkedProp

    const onChange =
      onChangeContext && !isNullish(valueProp)
        ? callAllFuncs((evt: React.ChangeEvent<HTMLInputElement>) => {
            if (evt.target.checked) {
              onChangeContext(valueProp)
            }
          }, onChangeProp)
        : onChangeProp

    const { rootProps, getInputProps } = useRadio({
      ...rest,
      disabled,
      name,
      checked,
      onChange,
    })

    const inputProps = getInputProps()

    const globalContext = useGlobalContext()
    const { radio: radioConfig } = globalContext
    const { classNames, styles } = useMergeSemantic<
      RadioSemanticClassNames,
      RadioSemanticStyles,
      RadioProps
    >({
      classNamesList: [radioConfig?.classNames, classNamesProp],
      stylesList: [radioConfig?.styles, stylesProp],
      info: { props: { ...rest, checked, disabled } },
    })

    const cls = cx(prefixCls, className, classNames?.root, `${prefixCls}--type-${type}`)

    return (
      <label
        ref={ref}
        role={role}
        className={cls}
        style={{ ...style, ...styles?.root }}
        {...rootProps}
      >
        <input {...inputProps} tabIndex={0} className={cx(`${prefixCls}__input`)} />
        <span
          className={cx(`${prefixCls}__controller`, classNames?.controller)}
          style={styles?.controller}
        />
        {children ? (
          <span className={cx(`${prefixCls}__label`, classNames?.label)} style={styles?.label}>
            {children}
          </span>
        ) : null}
      </label>
    )
  }
)

export type RadioSemanticName = 'root' | 'controller' | 'label'
export type RadioSemanticClassNames = SemanticClassNamesType<RadioProps, RadioSemanticName>
export type RadioSemanticStyles = SemanticStylesType<RadioProps, RadioSemanticName>
export type RadioSemantic = ComponentSemantic<RadioSemanticClassNames, RadioSemanticStyles>

export interface RadioProps extends HiBaseHTMLFieldProps<'label'>, RadioSemantic, UseRadioProps {}

if (__DEV__) {
  Radio.displayName = 'Radio'
}
