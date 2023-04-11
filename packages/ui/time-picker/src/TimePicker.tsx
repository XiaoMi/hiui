import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import {
  TimePickerStep,
  TimePickerType,
  TimePickerFormat,
  TimePickerPanelType,
  TimePickerFilterProps,
  TimePickerValue,
} from './@types'
import { Input, InputRef } from './Input'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { PopperOverlayProps, Popper } from '@hi-ui/popper'
import { CloseCircleFilled, TimeOutlined } from '@hi-ui/icons'
import { PopContent } from './PopContent'
import { valueChecker } from './utils/valueChecker'
import { useFilter } from './hooks/useFilter'
import { Button } from '@hi-ui/button'
import { getNowString } from './utils/getNowString'
import DayJs from 'dayjs'

const _role = 'time-picker'
export const timePickerPrefix = getPrefixCls(_role)

const DefaultValue = ['', ''] as TimePickerValue[]
const DefaultDisabledFunc = () => []
const DefaultPlaceholder = ['', '']

const getValueMatchString = (
  value?: TimePickerValue[] | TimePickerValue,
  format: TimePickerFormat = 'HH:mm:ss'
) => {
  if (!value) {
    return undefined
  }
  const result = Array.isArray(value) ? value : [value]
  return result.map((item) => (typeof item === 'string' ? item : DayJs(item).format(format)))
}

export const TimePicker = forwardRef<HTMLDivElement | null, TimePickerProps>(
  (
    {
      prefixCls = timePickerPrefix,
      role = _role,
      className,
      value: controlledValue,
      // itemHeight = 24,
      // fullDisplayItemNumber = 7,
      hourStep = 1,
      minuteStep = 1,
      secondStep = 1,
      format = 'HH:mm:ss',
      type = 'single',
      appearance = 'line',
      defaultValue: uncontrolledValue = DefaultValue,
      disabled = false,
      disabledHours: originalDisabledHours = DefaultDisabledFunc,
      disabledSeconds: originalDisabledSeconds = DefaultDisabledFunc,
      disabledMinutes: originalDisabledMinutes = DefaultDisabledFunc,
      onChange: notifyOutside,
      placeholder: originalPlaceholder = DefaultPlaceholder,
      inputReadonly = false,
      overlay,
      size = 'md',
      invalid = false,
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const confirmText = i18n.get('timePicker.ok')
    const nowText = i18n.get('timePicker.now')

    const [attachEl, setAttachEl] = useState<HTMLElement | null>(null)
    const formatUncontrolledValue = useMemo(() => getValueMatchString(uncontrolledValue, format)!, [
      format,
      uncontrolledValue,
    ])
    const formatControlledValue = useMemo(() => getValueMatchString(controlledValue, format), [
      controlledValue,
      format,
    ])
    const formatNotifyOutside = useCallback(
      (disposeValue: string[]) => {
        const result = disposeValue.filter((item) => item)
        notifyOutside && notifyOutside(result.length > 1 ? result : result[0])
      },
      [notifyOutside]
    )
    const isInSingleValueFormat = useMemo(() => {
      const singleFormat: TimePickerFormat[] = ['HH', 'mm', 'ss']
      return singleFormat.includes(format)
    }, [format])

    const [value, onChange] = useUncontrolledState<string[]>(
      formatUncontrolledValue,
      formatControlledValue,
      formatNotifyOutside
    )

    const placeholder = useMemo(
      () => (Array.isArray(originalPlaceholder) ? originalPlaceholder : [originalPlaceholder]),
      [originalPlaceholder]
    )

    const inputRef = useRef<InputRef | null>(null)
    const [isInputValid, setIsInputValid] = useState(true)
    const [cacheValue, setCacheValue] = useState<string[]>(value)
    const cacheValueRef = useRef(cacheValue)

    // 将值统一转化为函数
    const { disabledHours, disabledMinutes, disabledSeconds } = useFilter({
      disabledHours: originalDisabledHours,
      disabledMinutes: originalDisabledMinutes,
      disabledSeconds: originalDisabledSeconds,
    })

    useEffect(() => {
      cacheValueRef.current = [...value]
      setCacheValue((pre) => {
        if (pre.join('') !== value.join('')) {
          return [...value]
        }
        return pre
      })
    }, [value])

    const getPanelType = useCallback(
      (index: number): TimePickerPanelType => {
        if (type === 'single') {
          return 'single'
        } else {
          return index === 0 ? 'range-start' : 'range-end'
        }
      },
      [type]
    )

    // 检查值是否合规
    const validChecker = useCallback(
      (checkValue: string[]) => {
        // 检查 range 情况下值是否正确
        // 视开始结束都为空值为正确值
        const rangeValid = checkValue.join('') === '' || checkValue[1] > checkValue[0]
        return (
          checkValue.every((item, index) =>
            valueChecker({
              value: item,
              format,
              filter: {
                disabledSeconds,
                disabledMinutes,
                disabledHours,
              },
              step: {
                hourStep,
                minuteStep,
                secondStep,
              },
              panelType: getPanelType(index),
            })
          ) &&
          // 单选不检查前后关系
          (type === 'single' || rangeValid)
        )
      },
      [
        hourStep,
        getPanelType,
        minuteStep,
        secondStep,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        format,
        type,
      ]
    )

    const onCacheChange = useCallback(
      (newValue: string[]) => {
        const result = newValue.slice(0, type === 'single' ? 1 : 2)
        cacheValueRef.current = [...result]
        // 避免重复渲染
        setCacheValue((pre) => {
          if (pre.join('') !== result.join('')) {
            return [...result]
          }
          return pre
        })
      },
      [type]
    )

    const [showPopper, setShowPopper] = useState(false)
    const showPopperRef = useRef(false)

    const cls = cx(prefixCls, className, `${prefixCls}--appearance-${appearance}`, {
      [`${prefixCls}--active`]: showPopper && !disabled,
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--input-not-valid`]: !isInputValid || invalid,
    })

    const functionButtons = useMemo(() => {
      return (
        <div className={`${prefixCls}__pop-function-buttons`}>
          <Button
            className={`${prefixCls}__pop-confirm-btn`}
            type={'primary'}
            disabled={!isInputValid}
            onClick={() => {
              // 合法，才去通知外部
              if (validChecker(cacheValue)) {
                if (cacheValue.join('') !== value.join('')) {
                  onChange([...cacheValue])
                }
              }
              showPopperRef.current = false
              setShowPopper(false)
            }}
          >
            {confirmText}
          </Button>
          {type === 'single' && !isInSingleValueFormat && (
            <Button
              className={`${prefixCls}__pop-now-btn`}
              appearance="link"
              type="primary"
              onClick={() => {
                onCacheChange([getNowString(format)])
                onChange([getNowString(format)])
                showPopperRef.current = false
                setShowPopper(false)
              }}
            >
              {nowText}
            </Button>
          )}
        </div>
      )
    }, [
      prefixCls,
      isInputValid,
      confirmText,
      type,
      isInSingleValueFormat,
      nowText,
      validChecker,
      cacheValue,
      value,
      onChange,
      onCacheChange,
      format,
    ])

    return (
      <div ref={ref} role={role} className={cls}>
        <div ref={setAttachEl} className={`${prefixCls}__input-wrapper`}>
          <Input
            size={size}
            isFitContent={appearance === 'unset'}
            ref={inputRef}
            onValidChange={setIsInputValid}
            disabled={inputReadonly || disabled}
            type={type}
            placeholders={placeholder}
            prefix={prefixCls}
            format={format}
            hourStep={hourStep}
            secondStep={secondStep}
            minuteStep={minuteStep}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            value={cacheValue}
            onChange={onCacheChange}
            onFocus={() => {
              showPopperRef.current = true
              setShowPopper(true)
            }}
          />
          <div
            className={`${prefixCls}__function-button`}
            onClick={() => {
              showPopperRef.current = !showPopperRef.current
              setShowPopper((pre) => !pre)
            }}
          >
            {showPopper ? (
              <CloseCircleFilled
                className={`${prefixCls}__close-button`}
                onClick={() => {
                  onCacheChange(type === 'single' ? [''] : ['', ''])
                }}
              />
            ) : (
              <TimeOutlined />
            )}
          </div>
        </div>
        <Popper
          {...(overlay || {})}
          unmountOnClose={false}
          visible={showPopper && !disabled}
          attachEl={attachEl}
          autoFocus={false}
          onClose={() => {
            // 关闭弹窗，视作，抛弃之前的选择行为，复位
            showPopperRef.current = false
            setShowPopper(false)
            onCacheChange([...value])
            // 强制刷新 input 内容，复位
            inputRef.current?.refresh()
          }}
          preload
        >
          <PopContent
            // itemHeight={itemHeight}
            // fullDisplayItemNumber={fullDisplayItemNumber}
            type={type}
            prefix={prefixCls}
            format={format}
            hourStep={hourStep}
            secondStep={secondStep}
            minuteStep={minuteStep}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            value={cacheValue}
            onChange={(e) => {
              // 只有弹窗展开的时候才接受 pop content 的值改变
              // WARNING: 当值错误，弹窗收起，默认会滚动到 00:00:00，并且通知外部（非期望），所以我们需要这个FLAG来避免错误值获取
              if (showPopperRef.current) {
                // 强制刷新 input 内容，复位
                // 解决此情况：
                //  输入框输入错误数据，故而input不通知外部，time-picker cache-value 不变化，input接受value不变
                //  此时我们再次在pop-content点击当前选中值，time-picker cache-value 依旧不变化，input接受value不变，展示的依旧是错误的cache-value
                inputRef.current?.refresh()
                onCacheChange(e)
              }
            }}
          />
          {functionButtons}
        </Popper>
      </div>
    )
  }
)

type ExtendType = Omit<HiBaseHTMLProps<'div'>, 'placeholder' | 'value' | 'onChange'> &
  TimePickerFilterProps &
  TimePickerStep
export interface TimePickerProps extends ExtendType {
  /**
   * 选择器类型
   * @default 'single'
   */
  type?: TimePickerType
  /**
   * 选择器格式
   * @default 'HH:mm:ss'
   */
  format?: TimePickerFormat
  /**
   * 当前值（type='single'取数组第一个值，type='range'取数组第一个作为开始，第二个作为结束）
   */
  value?: TimePickerValue[] | TimePickerValue
  /**
   * 默认值
   */
  defaultValue?: TimePickerValue[] | TimePickerValue
  /**
   * 自定义控制弹出层 popper
   */
  overlay?: PopperOverlayProps
  /**
   * 输入框是否不可编辑
   * @default false
   */
  inputReadonly?: boolean
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 输入框占位符
   */
  placeholder?: string | string[]
  /**
   * 选择器外观
   * @default 'line'
   */
  appearance?: 'line' | 'filled' | 'unset'
  /**
   * 尺寸
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 值改变事件
   * @param value
   */
  onChange?: (value: string | string[]) => void
  /**
   * 是否非法
   * @default false
   */
  invalid?: boolean
}

if (__DEV__) {
  TimePicker.displayName = 'TimePicker'
}
