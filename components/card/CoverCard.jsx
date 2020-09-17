import React from 'react'
import classNames from 'classnames'

const CoverCard = ({ cover, coverUrl, content, size, title, style, className, hoverable }) => {
  return (
    <div
      className={classNames('hi-card', 'hi-card--cover', className, {
        [`hi-card--${size}`]: size,
        'hi-card--hoverable': hoverable
      })}
      style={style}
    >
      {coverUrl && <img src={coverUrl} />}
      {cover}
      <div className="hi-card__content">
        {title && <div className="hi-card__title">{title}</div>}
        {content}
      </div>
    </div>
  )
}

export default CoverCard
