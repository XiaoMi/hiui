import React, { useState, useCallback, useEffect } from 'react'
import classNames from 'classnames'

import { CheckProps } from './types'

const prefixCls = 'hi-checkbox'

const Checkbox = (props: CheckProps) => {
  const {
    autoFocus,
    className,
    children,
    disabled,
    checked: checkedProps,
    indeterminate,
    style,
    theme,
    name,
    value,
    focusable = true,
    onChange,
    onClick
  } = props

  const [checked, setChecked] = useState(getChecked(props))

  useEffect(() => {
    setChecked(checkedProps)
  }, [checkedProps])

  const checkboxCls = classNames(prefixCls, className, disabled && `${prefixCls}--disabled`, `theme__${theme}`)
  const inputCls = classNames(
    `${prefixCls}__input`,
    checked && !indeterminate && `${prefixCls}__input--checked`,
    indeterminate && `${prefixCls}__input--indeterminate`
  )

  const handleChange = useCallback(
    (event) => {
      onChange && onChange(event)
      hasChecked(props) || setChecked(event.target.checked)
    },
    [props, onChange, hasChecked]
  )

  const handleClick = useCallback(() => {
    const item = {
      content: children,
      checked
    }
    onClick && onClick(item)
  }, [children, checked, onClick])

  return (
    <label className={checkboxCls} style={style} onClick={handleClick}>
      <input
        type="checkbox"
        autoFocus={autoFocus}
        onChange={handleChange}
        checked={checked}
        disabled={disabled}
        name={name}
        value={value}
        tabIndex={focusable ? 0 : -1}
      />
      <span className={inputCls} />
      {children !== undefined && <span className={`${prefixCls}__text`}>{children}</span>}
    </label>
  )
}

function hasChecked(props: CheckProps) {
  const has = (key: string) => Object.prototype.hasOwnProperty.call(props, key)
  return has('checked')
}

function getChecked(props: CheckProps) {
  const { checked, defaultChecked } = props
  return hasChecked(props) ? checked || false : defaultChecked
}

export default Checkbox
