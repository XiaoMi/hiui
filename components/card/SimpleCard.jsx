import React from 'react'
import classNames from 'classnames'

const SimpleCard = ({ children, size, style, className, hoverable }) => {
  return (
    <div
      className={classNames('hi-card', 'hi-card--simple', className, {
        [`hi-card--${size}`]: size,
        'hi-card--hoverable': hoverable
      })}
      style={style}
    >
      {children}
    </div>
  )
}

export default SimpleCard
