import React from 'react'

const NOOP_ARRAY = [] as []

export const useRadioGroup = ({
  name: nameProp,
  value: valueProp,
  onChange: onChangeProp,
  checked: checkedProp,
  readOnly = false,
  disabled = false,
  gap = 6,
  ...rest
}: UseRadioGroupProps) => {
  return { rootProps: rest }
}

export interface UseRadioGroupProps {
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
  onChange?: (value: React.ReactText) => void
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

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>
