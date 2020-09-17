import React from 'react'
import classNames from 'classnames'

const NormalCard = ({ children, size, title, extra, showHeaderDivider, style, className, hoverable }) => {
  return (
    <div
      className={classNames('hi-card', className, showHeaderDivider ? 'hi-card--standard' : 'hi-card--normal', {
        [`hi-card--${size}`]: size,
        'hi-card--hoverable': hoverable
      })}
      style={style}
    >
      {(title || extra) && (
        <div className="hi-card__title">
          {title}
          {extra}
        </div>
      )}
      <div className="hi-card__content">{children}</div>
    </div>
  )
}

export default NormalCard
