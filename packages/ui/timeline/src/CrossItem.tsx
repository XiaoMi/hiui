import React from 'react'
import { cx } from '@hi-ui/classname'
import { TimelineItem } from './Timeline'

const CrossItem: React.FC<TimelineItem> = ({ title, content, timestamp, extraTime, icon }) => {
  return (
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
