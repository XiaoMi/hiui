import React, { forwardRef, useState, useCallback, useRef, useMemo, isValidElement } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { CloseCircleFilled } from '@hi-ui/icons'
import { HiBaseHTMLFieldProps } from '@hi-ui/core'

const _prefix = getPrefixCls('input')

/**
 * TODO: What is Input
 */
export const Input = forwardRef<HTMLInputElement | null, InputProps>(
  (
    {
      prefixCls = _prefix,
      role = 'input',
      className,
      style,
      autoFocus = false,
      disabled = false,
      readOnly = false,
      name,
      maxLength,
      type = 'text',
      size = 'md',
      // appearance = 'outline',
      appearance = 'filled',
      floatLabel,
      placeholder,
      prepend,
      append,
      prefix,
      suffix,
      defaultValue = '',
      value: valueProp,
      onChange,
      onFocus,
      onBlur,
      clearableTrigger = 'hover',
      clearable = false,
      trimValueOnBlur = false,
      invalid = false,
      ...rest
    },
    ref
  ) => {
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

    const inputRef = useRef<HTMLInputElement>(null)

    const proxyOnChange = useCallback(
      (value: string, evt: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => {
        if (!onChange) return
        onChangeMock(onChange, evt, inputRef.current, value)
      },
      [onChange]
    )

    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, proxyOnChange)

    const handleChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = evt.target.value
        tryChangeValue(nextValue, evt)
      },
      [tryChangeValue]
    )

    const [focused, setFocused] = useState(autoFocus)

    const handleFocus = useCallback(
      (evt: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true)
        onFocus?.(evt)
      },
      [onFocus]
    )

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false)

        if (trimValueOnBlur) {
          const nextValue = event.target.value
          tryChangeValue(nextValue.trim(), event)
        }
        onBlur?.(event)
      },
      [onBlur, tryChangeValue, trimValueOnBlur]
    )

    const focus = useCallback(() => {
      inputRef.current?.focus()
    }, [])

    const handleReset = useCallback(
      (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
        tryChangeValue('', evt)
        focus()
      },
      [tryChangeValue, focus]
    )

    const nativeInputProps = useMemo(
      () => ({
        name,
        disabled,
        readOnly,
        autoFocus,
        placeholder,
        maxLength,
      }),
      [disabled, readOnly, autoFocus, placeholder, maxLength, name]
    )

    const [hover, setHover] = useState(false)
    // 在开启 clearable 下展示 清除内容按钮，可点击进行内容清楚
    const showClearableIcon = clearable && !!value && !disabled

    const cls = cx(
      className,
      `${prefixCls}__outer`,
      prepend && `${prefixCls}__outer--prepend`,
      prepend && unsetPrepend && `${prefixCls}__outer--prepend-unset`,
      append && `${prefixCls}__outer--append`,
      append && unsetAppend && `${prefixCls}__outer--append-unset`,
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}--size-${size}`
    )

    return (
      <div role={role} className={cls} style={style}>
        {prepend ? <div className={`${prefixCls}__prepend`}>{prepend}</div> : null}
        <div
          className={cx(
            `${prefixCls}__inner`,
            prefix && `${prefixCls}__inner--prefix`,
            suffix && `${prefixCls}__inner--suffix`,
            // TODO: bem规范统一
            focused && `focused`,
            disabled && 'disabled',
            readOnly && 'readonly',
            invalid && 'invalid'
          )}
          onMouseOver={(e) => {
            setHover(true)
          }}
          onMouseLeave={(e) => {
            setHover(false)
          }}
        >
          {prefix ? <span className={`${prefixCls}__prefix`}>{prefix}</span> : null}

          <input
            ref={useMergeRefs(ref, inputRef)}
            className={cx(
              prefixCls,
              focused && `focused`,
              disabled && 'disabled',
              readOnly && 'readonly'
            )}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
            {...nativeInputProps}
          />

          {suffix || showClearableIcon ? (
            <span className={`${prefixCls}__suffix`}>
              {showClearableIcon ? (
                <span
                  className={cx(
                    `${prefixCls}__clear`,
                    (clearableTrigger === 'always' || hover) && 'active'
                  )}
                  role="button"
                  tabIndex={-1}
                  onClick={handleReset}
                >
                  <CloseCircleFilled />
                </span>
              ) : null}
              {suffix}
            </span>
          ) : null}
        </div>
        {append ? <div className={`${prefixCls}__append`}>{append}</div> : null}
      </div>
    )
  }
)

export interface InputProps extends HiBaseHTMLFieldProps<'input'> {
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
   * 输入框字段名称
   */
  name?: string
  /**
   * 设置输入框的值
   */
  value?: string
  /**
   * 设置输入框的默认值
   */
  defaultValue?: string
  /**
   * 设置输入框类型，支持原生 input 的 type 属性所有值
   */
  type?: 'text' | 'number' | string
  /**
   * 输入最大长度
   */
  maxLength?: number
  /**
   * 输入框前置外部标签
   */
  prepend?: React.ReactNode
  /**
   * 输入框后置外部标签
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
   * 再失焦时触发对值的 trim onChange 给用户
   */
  trimValueOnBlur?: boolean
  /**
   * 清除按钮展示的触发形态
   */
  clearableTrigger?: 'always' | 'hover'
  /**
   * 开启动画浮动提示
   */
  floatLabel?: React.ReactNode
  /**
   * 输入框占位符
   */
  placeholder?: string
  /**
   * 设置展现形式
   * 其中 `underline` 内部使用，不对外提供支持（风格去线型化：由线性过渡到面性）
   */
  appearance?: 'outline' | 'unset' | 'filled' | 'underline'
  /**
   * 设置输入框尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 值改变时的回调
   */
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
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
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
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
    onChange(event as React.ChangeEvent<HTMLInputElement>)
    // 重置为之前值
    target.value = originalTargetValue
    return
  }

  onChange(event as React.ChangeEvent<HTMLInputElement>)
}
