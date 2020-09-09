import notice from '../notice'
import './style/index'
import React from 'react'
import Icon from '../icon'

const iconMap = {
  success: 'check-circle',
  danger: 'close-circle',
  warning: 'exclamation-circle',
  primary: 'info-circle'
}

const message = {
  open: ({ title, prefix = 'message', key = Math.random(), duration, closeable = false, type = 'primary' }) => {
    const NoticeContent = (
      <React.Fragment>
        <div className={`hi-${prefix}__header`}>
          <Icon name={iconMap[type]} filled className={`hi-${prefix}__icon`} />
          {title && <div className={`hi-${prefix}__title`}>{title}</div>}
        </div>
      </React.Fragment>
    )
    notice.open({
      content: NoticeContent,
      prefix,
      key,
      closeable,
      duration,
      type
    })
  }
}

export default message
