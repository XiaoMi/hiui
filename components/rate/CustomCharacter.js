import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
const prefixCls = 'hi-rate-customCharacter'
const CustomCharacter = props => {
  const { value, idx, defaultValue, allowHalf } = props
  const [customValue, setCustomValue] = useState(value || defaultValue)
  const [halfIndex, setHalfindex] = useState(0)
  console.log('customValue', customValue, Number.isInteger(customValue))
  // 初始
  useEffect(() => {
    if (allowHalf && !Number.isInteger(defaultValue)) {
      setHalfindex(Math.ceil(defaultValue))
    }
  }, [])

  useEffect(() => {
    value && setCustomValue(value)
    if (value && Number.isInteger(value) && allowHalf) {
      setHalfindex(Math.ceil(value))
    }
  }, [value])

  const handleIconEnter = placement => {
    console.log(placement, halfIndex, idx, customValue)
    setCustomValue(idx + 1)
  }
  const handleIconLeave = placement => {
    console.log('leave', placement)
    setCustomValue(idx + 1)
  }
  const handleIconClick = placement => {
    console.log('click', placement)
  }
  return (
    <li
      className={classnames(`${prefixCls}`, {
        [`${prefixCls}-full`]: idx + 1 <= customValue,
        [`${prefixCls}-half`]: idx + 1 === halfIndex
      })}
      key={value}
    >
      <div
        className={`${prefixCls}-before`}
        onMouseEnter={() => handleIconEnter('before')}
        onMouseLeave={() => handleIconLeave('before')}
        onClick={() => handleIconClick('before')}
      >
        😈
      </div>
      <div
        className={`${prefixCls}-after`}
        onMouseEnter={() => handleIconEnter('after')}
        onMouseLeave={() => handleIconLeave('after')}
        onClick={() => handleIconClick('after')}
      >
        😈
      </div>
    </li>
  )
}
export default CustomCharacter
