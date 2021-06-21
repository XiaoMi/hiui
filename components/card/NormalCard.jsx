import React from 'react'
import classNames from 'classnames'
import Loading from '../loading'

const NormalCard = ({
  children,
  size,
  title,
  extra,
  showHeaderDivider,
  style,
  className,
  hoverable,
  bordered,
  loading
}) => {
  return (
    <div
      className={classNames('hi-card', className, showHeaderDivider ? 'hi-card--standard' : 'hi-card--normal', {
        [`hi-card--${size}`]: size,
        'hi-card--hoverable': hoverable,
        'hi-card--bordered': bordered
      })}
      style={style}
    >
      {(title || extra) && (
        <div className="hi-card__title">
          {title}
          {extra}
        </div>
      )}
      {loading !== undefined ? (
        <Loading visible={loading}>
          <div className="hi-card__content">{children}</div>
        </Loading>
      ) : (
        <div className="hi-card__content">{children}</div>
      )}
    </div>
  )
}

export default NormalCard
