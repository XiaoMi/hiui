import React, { useState, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import Provider from '../context'
import './style/index'

const Switch = ({ content = [], disabled = false, checked, defaultChecked, onChange, onClick, theme }) => {
  const [value, setValue] = useState(checked || defaultChecked || false)

  useEffect(() => {
    if (checked !== undefined) {
      setValue(checked)
    }
  }, [checked])

  const clickSwitch = useCallback(
    (e) => {
      if (!disabled) {
        if (onClick) {
          onClick(!value, e)
        }
        if (onChange) {
          onChange(!value)
        }
        if (checked === undefined) {
          setValue(!value)
        }
      }
    },
    [disabled, onChange, onClick, checked, value]
  )

  return (
    <span
      className={classNames(
        'hi-switch',
        `theme__${theme}`,
        !value && 'hi-switch--closed',
        disabled && 'hi-switch--disabled'
      )}
      onClick={clickSwitch}
    >
      <span className="hi-switch__text">{content.length > 0 && (value ? content[0] : content[1])}</span>
    </span>
  )
}

export default Provider(Switch)
