import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { setAttrStatus, hiddenStyle } from '@hi-ui/dom-utils'

export const useRadio = ({
  name: nameProp,
  // 是否作为必传参数使用
  value: valueProp,
  invalid,
  autoFocus = false,
  defaultChecked = false,
  onChange,
  checked: checkedProp,
  readOnly = false,
  disabled = false,
  gap,
  ...rest
}: UseRadioProps) => {
  const [checked, tryChangeChecked] = useUncontrolledState(defaultChecked, checkedProp, onChange)

  const nonInteractive = disabled || readOnly

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (nonInteractive) {
        // 不可交互，不触发事件的任何默认行为
        evt.preventDefault()
        return
      }

      tryChangeChecked(evt.target.checked, evt)
    },
    [nonInteractive, tryChangeChecked]
  )

  const getInputProps = useCallback(() => {
    return {
      style: hiddenStyle,
      type: 'radio',
      checked,
      disabled,
      readOnly,
      onChange: handleChange,
      autoFocus,
      name: nameProp,
      value: valueProp,
    }
  }, [nameProp, handleChange, checked, disabled, readOnly, autoFocus, valueProp])

  const state = useMemo(() => {
    return {
      disabled,
      invalid,
      checked,
      readOnly,
    }
  }, [disabled, invalid, checked, readOnly])

  const rootProps = {
    ...rest,
    'data-disabled': setAttrStatus(disabled),
    'data-invalid': setAttrStatus(invalid),
    'data-checked': setAttrStatus(checked),
    'data-readonly': setAttrStatus(readOnly),
  }

  const getLabelProps = useCallback(() => {
    return {
      style: { marginInlineStart: gap },
    }
  }, [gap])

  return {
    state,
    rootProps,
    getInputProps,
    getLabelProps,
  }
}

export interface UseRadioProps {
  /**
   * 是否无效
   */
  invalid?: boolean
  /**
   * 字段名称
   */
  name?: string
  /**
   * 单选对应的值
   */
  value?: React.ReactText

  /**
   * 是否选中（受控）
   */
  checked?: boolean
  /**
   * 默认是否选中
   */
  defaultChecked?: boolean
  /**
   * 选中态改变时的回调
   */
  onChange?: (shouldChecked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 页面载入时，是否自动获取焦点
   */
  autoFocus?: boolean
  /**
   * 是否只读
   */
  readOnly?: boolean
  /**
   * 和文本的间距
   */
  gap?: number
}

export type UseRadioReturn = ReturnType<typeof useRadio>
