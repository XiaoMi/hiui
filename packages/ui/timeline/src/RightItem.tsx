import React from 'react'
import { cx } from '@hi-ui/classname'
import { TimelineItem } from './Timeline'

const RightItem: React.FC<TimelineItem> = ({ title, content, timestamp, extraTime, icon }) => {
  return (
    <div className={cx('timeline__item')}>
      <div className="item__title">{title}</div>
      <div className="item__content">{content}</div>
      <div className="item__time">
        {timestamp} {extraTime}
      </div>

      {(icon && <div className="item__icon">{icon}</div>) || <div className="item__dot" />}
      <div className="item__line" />
    </div>
  )
}

export default RightItem
