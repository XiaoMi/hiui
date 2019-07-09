import notice from '../notice'
import './style/index'
import React from 'react'
import classNames from 'classnames'

const iconMap = {
  success: 'chenggong',
  error: 'shibai',
  warning: 'jinggao',
  info: 'tishi'
}

const message = {
  open: ({
    title,
    prefix = 'message',
    key = Math.random(),
    duration,
    closable = false,
    type = 'info',
  }) => {
    const NoticeContent = (
      <React.Fragment>
        <div className={`hi-${prefix}__title--wrapper`} >
          <span className={`hi-${prefix}__icon`}>
            <i className={classNames('hi-icon', `icon-${iconMap[type]}`)} />
          </span>
          {title && <div className={`hi-${prefix}__title`}>{title}</div>}
        </div>
      </React.Fragment>
    )
    notice.open({
      content: NoticeContent,
      prefix,
      key,
      closable,
      duration,
      type
    })
  }
}

export default message
