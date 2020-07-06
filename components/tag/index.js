import React from 'react'
import classNames from 'classnames'
import './style'

const Tag = ({
  type = 'primary',
  appearance = 'default',
  onClick,
  children,
  color
}) => {
  return (
    <span
      className={classNames(
        'hi-tag',
        { [`hi-tag--${type}`]: type },
        {
          'hi-tag--line': appearance === 'line'
        }
      )}
      onClick={onClick}
      style={{
        background: color && appearance === 'default' ? color : '',
        borderColor: color && appearance === 'line' ? color : '',
        color: color && appearance === 'line' ? color : ''
      }}
    >
      {children}
    </span>
  )
}

export default Tag
