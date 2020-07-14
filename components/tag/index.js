import React from 'react'
import classNames from 'classnames'
import './style'
import Icon from '../icon'

const noop = () => { }
const Tag = ({
  type = 'primary',
  appearance = 'default',
  onClick,
  children,
  color,
  closable = false,
  onClose = noop,
  style = {}
}) => {
  const tagStyle = color
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
        {
          [`hi-tag--${type}`]: type,
          'hi-tag--line': appearance === 'line'
        }

      )}
      onClick={onClick}
      style={{ ...style, ...tagStyle }}
    >
      {children}
      {closable && <Icon name='close' onClick={(e) => {
        onClose(e)
      }} />}
    </span>
  )
}

export default Tag
