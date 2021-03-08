import React, { FC } from 'react'
import ClassNames from 'classnames'
import './style/index.scss'

const PREFIX = 'hix-radio'

interface RadioProps {
  value: string;
  disabled: boolean;
  checked: boolean;
  size: 'string',
}

const Radio: FC<RadioProps> = ({ value, disabled, children, checked, size = 'md' }) => {
  return (
    <label className={ClassNames(PREFIX, { [`${PREFIX}--${size}`]: true })}>
      <input disabled={disabled} checked={checked} value={value} />
      <span></span>
      <span>{children}</span>
    </label>
  )
}

export default Radio
