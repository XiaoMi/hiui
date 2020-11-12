import React from 'react'
import classNames from 'classnames'

const SimpleCard = ({ children, size, style, className, hoverable, bordered }) => {
  return (
    <div
      className={classNames('hi-card', 'hi-card--simple', className, {
        [`hi-card--${size}`]: size,
        'hi-card--hoverable': hoverable,
        'hi-card--bordered': bordered
      })}
      style={style}
    >
      {children}
    </div>
  )
}

export default SimpleCard
