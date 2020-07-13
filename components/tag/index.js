import React from 'react'
import classNames from 'classnames'
import './style'
import Icon from '../icon'

const noop = () => {}
const Tag = ({
  type = 'primary',
  appearance = 'default',
  onClick,
  children,
  color,
  closable = false,
  onClose = noop

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
        {
          [`hi-tag--${type}`]: type,
          'hi-tag--line': appearance === 'line',
          'hi-tag--hasIcon': type === 'hasIcon'
        }

      )}
      onClick={onClick}
      style={style}
    >
      {children}
      {closable && <Icon name='close' onClick={() => onClose(children)} />}
    </span>
  )
}

export default Tag
