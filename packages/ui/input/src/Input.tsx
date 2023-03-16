import React, { forwardRef, useState, useCallback, useRef, useMemo, isValidElement } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { CloseCircleFilled } from '@hi-ui/icons'
import { HiBaseHTMLFieldProps } from '@hi-ui/core'
import { useInput } from './use-input'
import { InputAppearanceEnum, InputTypeEnum } from './types'

const _prefix = getPrefixCls('input')

/**
 * 输入框
 *
 * @TODO:
 * 1. size api 确认
 * 2. 修改类名结构
 * 3. 支持带数字展示
 * 4. InputGroup 模式支持
 * 5. 手动聚焦支持额外配置
 */
export const Input = forwardRef<HTMLInputElement | null, InputProps>(
  (
    {
      prefixCls = _prefix,
      role = 'input',
      className,
      style,
      size = 'md',
      appearance = 'line',
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
    })

    const focus = useCallback(() => {
      inputElementRef.current?.focus()
    }, [])

    const [hover, setHover] = useState(false)
    // 在开启 clearable 下展示 清除内容按钮，可点击进行内容清楚
    const showClearableIcon = clearable && !!value && !disabled

    const mergedRef = useMergeRefs(ref, inputElementRef)

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--size-${size}`,
      `${prefixCls}--appearance-${appearance}`
    )

    const outerCls = cx(
      `${prefixCls}__outer`,
      prepend && `${prefixCls}__outer--prepend`,
      prepend && unsetPrepend && `${prefixCls}__outer--prepend-unset`,
      append && `${prefixCls}__outer--append`,
      append && unsetAppend && `${prefixCls}__outer--append-unset`
    )

    return (
      <div role={role} className={cls} style={style} ref={containerRef}>
        <div className={outerCls}>
          {prepend ? <div className={`${prefixCls}__prepend`}>{prepend}</div> : null}
          <div
            className={cx(
              `${prefixCls}__inner`,
              prefix && `${prefixCls}__inner--prefix`,
              suffix && `${prefixCls}__inner--suffix`,
              focused && `${prefixCls}__inner--focused`,
              disabled && `${prefixCls}__inner--disabled`,
              readOnly && `${prefixCls}__inner--readonly`,
              invalid && `${prefixCls}__inner--invalid`
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
              ref={mergedRef}
              className={`${prefixCls}__text`}
              {...getInputProps()}
              {...rest}
            />

            {suffix || showClearableIcon ? (
              <span className={`${prefixCls}__suffix`}>
                {showClearableIcon ? (
                  <span
                    ref={clearElementRef}
                    className={cx(
                      `${prefixCls}__clear`,
                      (clearableTrigger === 'always' || hover) && `${prefixCls}__clear--active`
                    )}
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
          {append ? <div className={`${prefixCls}__append`}>{append}</div> : null}
        </div>
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
   * 设置尺寸
   */
  size?: 'sm' | 'md' | 'lg'
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
