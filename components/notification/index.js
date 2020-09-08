import notice from '../notice'
import './style/index'
import React from 'react'
import Button from '../button'
import Icon from '../icon'
import _handleNotificate from './HandleNotification'
const iconMap = {
  success: 'check-circle',
  error: 'close-circle',
  warning: 'exclamation-circle',
  info: 'info-circle'
}

export const handleNotificate = _handleNotificate

const notification = {
  close: (key) => {
    notice.close('notification', key)
  },
  handleNotificate,
  open: ({
    title,
    content,
    prefix = 'notification',
    key = Math.random(),
    duration,
    closeable = true,
    type = 'info',
    confirmText,
    onConfirm,
    onClose
  }) => {
    const NoticeContent = (
      <React.Fragment>
        <div className={`hi-${prefix}__header`}>
          <Icon name={iconMap[type]} className={`hi-${prefix}__icon`} filled />
          {title && <div className={`hi-${prefix}__title`}>{title}</div>}
        </div>

        {content && <div className={`hi-${prefix}__content`}>{content}</div>}
        {onConfirm && (
          <div className={`hi-${prefix}__footer`}>
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
      closeable,
      duration,
      type,
      onClose
    })
  }
}

export default notification
