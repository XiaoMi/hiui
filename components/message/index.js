import notice from '../notice'
import './style/index'
import React from 'react'
import Icon from '../icon'

const iconMap = {
  success: 'check-circle',
  error: 'close-circle',
  warning: 'exclamation-circle',
  info: 'info-circle'
}

const message = {
  open: ({ title, prefix = 'message', key = Math.random(), duration, closeable = false, type = 'info' }) => {
    const NoticeContent = (
      <React.Fragment>
        <div className={`hi-${prefix}__title--wrapper`}>
          <span className={`hi-${prefix}__icon`}>
            <Icon name={iconMap[type]} filled style={{ fontSize: '18px' }} />
          </span>
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
