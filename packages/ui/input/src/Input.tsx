import React, { forwardRef, useState, useCallback, useRef, useMemo, isValidElement } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { CloseCircleFilled } from '@hi-ui/icons'
import { HiBaseHTMLFieldProps, HiBaseSizeEnum, useGlobalContext } from '@hi-ui/core'
import { useInput } from './use-input'
import { InputAppearanceEnum, InputTypeEnum } from './types'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const _prefix = getPrefixCls('input')

/**
 * 输入框
 */
export const Input = forwardRef<HTMLInputElement | null, InputProps>(
  (
    {
      prefixCls = _prefix,
      role = 'input',
      className,
      style,
      size: sizeProp,
      appearance = 'line',
      label,
      prepend,
      append,
      prefix,
      suffix,
      clearableTrigger = 'hover',
      clearable = false,
      invalid = false,
      // use-input
      name,
      autoFocus,
      disabled,
      readOnly,
      maxLength,
      placeholder,
      defaultValue,
      value: valueProp,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      trimValueOnBlur,
      onClear,
      type,
      containerRef,
      waitCompositionEnd,
      styles: stylesProp,
      classNames: classNamesProp,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize, input: inputConfig } = useGlobalContext()
    const size = sizeProp ?? globalSize ?? 'md'

    // @TODO: 临时方案，后面迁移至 InputGroup
    const [unsetPrepend, unsetAppend] = useMemo(() => {
      const shouldUnset = [false, false]
      // @ts-ignore
      if (isValidElement(prepend) && ['Select', 'Button'].includes(prepend.type.HiName)) {
        shouldUnset[0] = true
      }

      // @ts-ignore
      if (isValidElement(append) && ['Select', 'Button'].includes(append.type.HiName)) {
        shouldUnset[1] = true
      }
      return shouldUnset
    }, [prepend, append])

    const inputElementRef = useRef<HTMLInputElement>(null)

    const proxyOnChange = useCallback(
      (value: string, evt: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => {
        if (!onChange) return
        onChangeMock(onChange, evt, inputElementRef.current, value)
      },
      [onChange]
    )

    const clearElementRef = useRef<HTMLDivElement>(null)

    const { tryChangeValue, focused, value, getInputProps } = useInput({
      clearElementRef,
      inputElementRef,
      name,
      autoFocus,
      disabled,
      readOnly,
      maxLength,
      placeholder,
      defaultValue,
      value: valueProp,
      onChange: proxyOnChange,
      onFocus,
      onBlur,
      onKeyDown,
      trimValueOnBlur,
      type,
      waitCompositionEnd,
    })

    const focus = useCallback(() => {
      inputElementRef.current?.focus()
    }, [])

    const [hover, setHover] = useState(false)
    // 在开启 clearable 下展示 清除内容按钮，可点击进行内容清楚
    const showClearableIcon = clearable && !!value && !disabled

    // 合并语义化类名和样式
    const { classNames, styles } = useMergeSemantic<
      InputSemanticClassNames,
      InputSemanticStyles,
      InputProps
    >({
      classNamesList: [inputConfig?.classNames, classNamesProp],
      stylesList: [inputConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          size,
          appearance,
          disabled,
          readOnly,
          invalid,
          clearable,
        } as InputProps,
      },
    })

    const mergedRef = useMergeRefs(ref, inputElementRef)

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--size-${size}`,
      `${prefixCls}--appearance-${appearance}`,
      value && `${prefixCls}--has-value`
    )

    const outerCls = cx(
      `${prefixCls}__outer`,
      prepend && `${prefixCls}__outer--prepend`,
      prepend && unsetPrepend && `${prefixCls}__outer--prepend-unset`,
      append && `${prefixCls}__outer--append`,
      append && unsetAppend && `${prefixCls}__outer--append-unset`
    )

    return (
      <div
        role={role}
        className={cx(cls, classNames?.root)}
        style={{ ...style, ...styles?.root }}
        ref={containerRef}
      >
        <div className={cx(outerCls, classNames?.outer)} style={styles?.outer}>
          {prepend ? (
            <div
              className={cx(`${prefixCls}__prepend`, classNames?.prepend)}
              style={styles?.prepend}
            >
              {prepend}
            </div>
          ) : null}
          <div
            className={cx(
              `${prefixCls}__inner`,
              prefix && `${prefixCls}__inner--prefix`,
              suffix && `${prefixCls}__inner--suffix`,
              focused && `${prefixCls}__inner--focused`,
              disabled && `${prefixCls}__inner--disabled`,
              readOnly && `${prefixCls}__inner--readonly`,
              invalid && `${prefixCls}__inner--invalid`,
              classNames?.inner
            )}
            style={styles?.inner}
            onMouseOver={(e) => {
              setHover(true)
            }}
            onMouseLeave={(e) => {
              setHover(false)
            }}
          >
            {prefix ? (
              <span
                className={cx(`${prefixCls}__prefix`, classNames?.prefix)}
                style={styles?.prefix}
              >
                {prefix}
              </span>
            ) : null}

            {appearance === 'contained' && label ? (
              <span className={`${prefixCls}__label`}>
                {label}
                {value && '：'}
              </span>
            ) : null}

            <input
              ref={mergedRef}
              className={cx(`${prefixCls}__text`, classNames?.input)}
              style={styles?.input}
              {...getInputProps()}
              {...rest}
            />

            {suffix || showClearableIcon ? (
              <span
                className={cx(`${prefixCls}__suffix`, classNames?.suffix)}
                style={styles?.suffix}
              >
                {showClearableIcon ? (
                  <span
                    ref={clearElementRef}
                    className={cx(
                      `${prefixCls}__clear`,
                      (clearableTrigger === 'always' || hover) && `${prefixCls}__clear--active`,
                      classNames?.clear
                    )}
                    style={styles?.clear}
                    role="button"
                    tabIndex={-1}
                    onClick={(evt: React.MouseEvent<HTMLElement>) => {
                      tryChangeValue('', evt)
                      onClear?.()
                      focus()
                    }}
                  >
                    <CloseCircleFilled />
                  </span>
                ) : null}
                {suffix}
              </span>
            ) : null}
          </div>
          {append ? (
            <div className={cx(`${prefixCls}__append`, classNames?.append)} style={styles?.append}>
              {append}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
)

// 定义语义化名称
export type InputSemanticName =
  | 'root'
  | 'outer'
  | 'inner'
  | 'input'
  | 'prefix'
  | 'suffix'
  | 'prepend'
  | 'append'
  | 'clear'
export type InputSemanticClassNames = SemanticClassNamesType<InputProps, InputSemanticName>
export type InputSemanticStyles = SemanticStylesType<InputProps, InputSemanticName>
export type InputSemantic = ComponentSemantic<InputSemanticClassNames, InputSemanticStyles>

export interface InputProps extends HiBaseHTMLFieldProps<'input'>, InputSemantic {
  /**
   * 开启输入框只读
   */
  readOnly?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 开启输入框自动聚焦
   */
  autoFocus?: boolean
  /**
   * 设置输入框的值
   */
  value?: string
  /**
   * 设置输入框的默认值
   */
  defaultValue?: string
  /**
   * 设置输入框类型
   */
  type?: InputTypeEnum
  /**
   * 输入最大长度
   */
  maxLength?: number
  /**
   * 输入框前置外部内容
   */
  prepend?: React.ReactNode
  /**
   * 输入框后置外部内容
   */
  append?: React.ReactNode
  /**
   * 输入框前置内容
   */
  prefix?: React.ReactNode
  /**
   * 输入框后置内容
   */
  suffix?: React.ReactNode
  /**
   * 是否可清空，通过点击右侧清除按钮
   */
  clearable?: boolean
  /**
   * 开启失焦时触发对值的 trim，将触发 onChange 给用户
   */
  trimValueOnBlur?: boolean
  /**
   * 清除按钮展示的触发形态
   */
  clearableTrigger?: 'always' | 'hover'
  /**
   * 输入框占位符
   */
  placeholder?: string
  /**
   * 设置展现形式
   * 其中 `underline` 内部使用，不对外提供支持（风格去线型化：由线性过渡到面性）
   */
  appearance?: InputAppearanceEnum
  /**
   * 设置输入框 label 内容，仅在 appearance 为 contained 时生效
   */
  label?: React.ReactNode
  /**
   * 设置尺寸
   */
  size?: HiBaseSizeEnum
  /**
   * 值改变时的回调
   */
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>, value: string) => void
  /**
   * 点击清空时回调。暂不对外暴露
   * @private
   */
  onClear?: () => void
  /**
   * 外部包裹容器元素的 ref。暂不对外暴露
   * @private
   */
  containerRef?: React.Ref<HTMLDivElement>
  /**
   * 是否等待文本段落组成完成
   */
  waitCompositionEnd?: boolean
}

if (__DEV__) {
  Input.displayName = 'Input'
}

/**
 * 模拟伪装目标事件 target
 *
 * @param target
 * @param evt
 * @param onChange
 * @param targetValue
 * @returns
 */
export function onChangeMock(
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void,
  evt: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
  target: HTMLInputElement | null,
  targetValue: string
) {
  let event = evt

  // 点击 clearIcon 或者 失焦 trim 时，都会代理 onChange 的事件对象 target 指向 input.target
  if (evt.type !== 'change') {
    if (!target) return

    const originalTargetValue = target.value
    event = Object.create(evt)

    event.target = target
    event.currentTarget = target
    target.value = targetValue
    onChange(event as React.ChangeEvent<HTMLInputElement>, targetValue)
    // 重置为之前值
    target.value = originalTargetValue
    return
  }

  onChange(event as React.ChangeEvent<HTMLInputElement>, targetValue)
}
