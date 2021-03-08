import React, { memo, useEffect, useCallback, useState } from 'react'
import classNames from 'classnames'
import Checkbox from './Checkbox'

import { GroupProps, DataItem } from './types'

const prefixCls = 'hi-checkbox-group'

const Group = (props: GroupProps) => {
  const { className, name, disabled, style, placement, onChange } = props

  const [data, setData] = useState(props.data || [])

  useEffect(() => {
    setData(getData(props))
  }, [props.data])

  const groupCls = classNames(prefixCls, className, placement === 'vertical' && `${prefixCls}--vertical`)

  const handleCheckboxChange = useCallback(
    (event) => {
      const updatedValue = event.target.value
      const updatedChecked = event.target.checked
      const newData = data.map(({ value, checked, ...rest }: DataItem) => {
        const isValueEquel = updatedValue === value || Number(updatedValue) === value
        return {
          value,
          checked: isValueEquel ? updatedChecked : checked,
          ...rest
        }
      })
      const checkedList = newData.filter(({ checked }: DataItem) => checked).map(({ value }: DataItem) => value)
      onChange && onChange(checkedList)
      hasValue(props) || setData(newData)
    },
    [data, props, onChange]
  )

  return (
    <div className={groupCls} style={{ ...style }}>
      {data.map(({ label, value, checked, disabled: itemDisabled }: DataItem, idx: number) => (
        <Checkbox
          key={idx}
          value={value}
          name={name}
          disabled={disabled || itemDisabled}
          onChange={handleCheckboxChange}
          {...{
            [hasValue(props) ? 'checked' : 'defaultChecked']: checked
          }}
        >
          {label}
        </Checkbox>
      ))}
    </div>
  )
}

function hasValue(props: GroupProps) {
  return props.value !== undefined
}

function getData(props: GroupProps) {
  const { data = [], value, defaultValue } = props
  const _value = hasValue(props) ? value : defaultValue
  return data.map((item: DataItem) => {
    const isPlain = ['string', 'number'].includes(typeof item)
    const label = isPlain ? item : item.content
    const value: any = isPlain ? item : item.id
    const disabled = !isPlain && item.disabled
    return {
      label,
      value,
      disabled,
      checked: (_value || []).includes(value)
    }
  })
}

export default Group
