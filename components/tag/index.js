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
  const style = color
    ? {
      background: appearance === 'default' ? color : '',
      borderColor: appearance === 'line' ? color : '',
      color: appearance === 'line' ? color : ''
    }
    : {}
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
      style={style}
    >
      {children}
    </span>
  )
}

export default Tag
