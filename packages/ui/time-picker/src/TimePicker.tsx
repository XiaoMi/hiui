import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import {
  TimePickerStep,
  TimePickerType,
  TimePickerFormat,
  TimePickerPanelType,
  TimePickerFilterProps,
} from './@types'
import { Input } from './Input'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { PopperPortal } from '@hi-ui/popper'
import { CloseCircleFilled, TimeOutlined } from '@hi-ui/icons'
import { PopContent } from './PopContent'
import { valueChecker } from './utils/valueChecker'
import { useFilter } from './hooks/useFilter'

const _role = 'time-picker'
export const _prefix = getPrefixCls(_role)

const DefaultValue = ['', '']
const DefaultDisabledFunc = () => []
const DefaultPlaceholder = ['', '']
/**
 * TODO: What is TimePicker
 */
export const TimePicker = forwardRef<HTMLDivElement | null, TimePickerProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      value: controlledValue,
      itemHeight = 32,
      fullDisplayItemNumber = 7,
      hourStep = 1,
      minuteStep = 1,
      secondStep = 1,
      format = 'HH:mm:ss',
      type = 'single',
      defaultValue: uncontrolledValue = DefaultValue,
      disabled = false,
      disabledHours: originalDisabledHours = DefaultDisabledFunc,
      disabledSeconds: originalDisabledSeconds = DefaultDisabledFunc,
      disabledMinutes: originalDisabledMinutes = DefaultDisabledFunc,
      bordered = true,
      onChange: notifyOutside,
      placeholder = DefaultPlaceholder,
      inputReadonly = false,
    },
    ref
  ) => {
    const [attachEl, setAttachEl] = useState<HTMLElement | null>(null)
    const [value, onChange] = useUncontrolledState<string[]>(
      uncontrolledValue,
      controlledValue,
      notifyOutside
    )
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

    const onChangeWrapper = useCallback(
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

        // 避免重复通知，我们只通知正确的值到外部
        if (validChecker(result)) {
          if (result.join('') !== value.join('')) {
            onChange([...result])
          }
        }
      },
      [value, onChange, type, validChecker]
    )

    const [showPopper, setShowPopper] = useState(false)
    const showPopperRef = useRef(false)

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--border`]: bordered,
      [`${prefixCls}--active`]: showPopper && !disabled,
      [`${prefixCls}--disabled`]: disabled,
    })

    // 行为结束，如果此时值还是错误的，则直接重置
    const finishAction = useCallback(() => {
      if (!validChecker(cacheValueRef.current)) {
        onChangeWrapper(type === 'single' ? [''] : ['', ''])
      }
    }, [validChecker, onChangeWrapper, type])

    return (
      <div ref={ref} role={role} className={cls}>
        <div ref={setAttachEl} className={`${prefixCls}__input-wrapper`}>
          <Input
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
            onChange={onChangeWrapper}
            onFocus={() => {
              showPopperRef.current = true
              setShowPopper(true)
            }}
            onBlur={() => {
              // 失焦之后，弹窗已经收起，视作行为结束
              if (!showPopperRef.current) {
                finishAction()
              }
            }}
          />
          <div
            className={`${prefixCls}__function-button`}
            onClick={() => {
              showPopperRef.current = !showPopper
              setShowPopper((pre) => !pre)
            }}
          >
            {showPopper ? (
              <CloseCircleFilled className={`${prefixCls}__close-button`} />
            ) : (
              <TimeOutlined />
            )}
          </div>
        </div>
        <PopperPortal
          unmountOnClose={false}
          visible={showPopper && !disabled}
          attachEl={attachEl}
          onClose={() => {
            showPopperRef.current = false
            finishAction()
            setShowPopper(false)
          }}
          preload
        >
          <PopContent
            itemHeight={itemHeight}
            fullDisplayItemNumber={fullDisplayItemNumber}
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
              // 只有弹窗展开的时候才接手 pop content 的值改变
              // WARNING: 当值错误，弹窗收起，默认会滚动到 00:00:00，并且通知外部（非期望），所以我们需要这个FLAG来避免错误值获取
              if (showPopperRef.current) {
                onChangeWrapper(e)
              }
            }}
          />
        </PopperPortal>
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
  value?: string[]
  /**
   * 默认值
   */
  defaultValue?: string[]
  /**
   * 输入框是否不可编辑
   * @default false
   */
  inputReadonly?: boolean
  /**
   * 是否有边框
   * @default true
   */
  bordered?: boolean
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 输入框占位符
   */
  placeholder?: string[]
  /**
   * 选择器高
   * @default 32
   */
  itemHeight?: number
  /**
   * 完全展示item的数目，必须为奇数
   * @default 7
   */
  fullDisplayItemNumber?: number

  onChange?: (value: string[]) => void
}

if (__DEV__) {
  TimePicker.displayName = 'TimePicker'
}
