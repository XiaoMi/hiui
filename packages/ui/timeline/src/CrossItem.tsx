import React from 'react'
import { cx } from '@hi-ui/classname'
import { TimelineDataItem } from './types'

const CrossItem: React.FC<TimelineDataItem> = ({
  title,
  content,
  timestamp,
  extraTime,
  icon,
  children,
}) => {
  return children ? (
    <>
      <div className={cx('timeline__item')}>
        <div className="item--left">
          <div className="item__time">{timestamp}</div>
          <div className="item__extra">{extraTime}</div>
        </div>
        {(icon && <div className="item__icon">{icon}</div>) || <div className="item__dot" />}
        <div className="item__line" />
        <div className="item--right">
          <div className="item__title">{title}</div>
          <div className="item__content">{content}</div>
        </div>
      </div>
      <div className={cx('timeline__collapse')}>
        {children?.map((child, idx) => (
          <CrossItem key={idx} {...child} />
        ))}
      </div>
    </>
  ) : (
    <div className={cx('timeline__item')}>
      <div className="item--left">
        <div className="item__time">{timestamp}</div>
        <div className="item__extra">{extraTime}</div>
      </div>
      {(icon && <div className="item__icon">{icon}</div>) || <div className="item__dot" />}
      <div className="item__line" />
      <div className="item--right">
        <div className="item__title">{title}</div>
        <div className="item__content">{content}</div>
      </div>
    </div>
  )
}

export default CrossItem
