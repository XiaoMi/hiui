import React from 'react'
import classNames from 'classnames'
import './style'

const Tag = ({ type = 'primary', appearance, onClick, children }) => {
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
    >
      {children}
    </span>
  )
}

export default Tag
