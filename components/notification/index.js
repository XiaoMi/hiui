import notice from '../notice'
import './style/index'
import React from 'react'
import Button from '../button'
import classNames from 'classnames'
import handleNotification from './HandleNotification'

const iconMap = {
  success: 'chenggong',
  error: 'shibai',
  warning: 'jinggao',
  info: 'tishi'
}

const notification = {
  close: key => {
    notice.close('notification', key)
  },
  handleNotification,
  open: ({
    title,
    content,
    prefix = 'notification',
    key = Math.random(),
    duration,
    closable = true,
    type = 'info',
    confirmText,
    onConfirm,
    onClose
  }) => {
    const NoticeContent = (
      <React.Fragment>
        <div className={`hi-${prefix}__title--wrapper`}>
          <span className={`hi-${prefix}__icon`}>
            <i className={classNames('hi-icon', `icon-${iconMap[type]}`)} />
          </span>
          {title && <div className={`hi-${prefix}__title`}>{title}</div>}
        </div>

        {content && <div className={`hi-${prefix}__content`}>{content}</div>}
        {onConfirm && (
          <div className={`hi-${prefix}__button--wrapper`}>
            <Button
              size='small'
              className={`hi-${prefix}__button`}
              onClick={() => {
                onConfirm()
              }}
            >
              {confirmText || '确认'}
            </Button>
          </div>
        )}
      </React.Fragment>
    )
    notice.open({
      content: NoticeContent,
      prefix,
      key,
      closable,
      duration,
      type,
      onClose
    })
  }
}

export default notification
