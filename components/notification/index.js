import notice from '../notice'
import './style/index'
import React from 'react'
import Button from '../button'
import Icon from '../icon'
import _handleNotificate from './HandleNotification'
const iconMap = {
  success: 'check-circle',
  danger: 'close-circle',
  warning: 'exclamation-circle',
  primary: 'info-circle'
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
    type = 'primary',
    confirmText,
    onConfirm,
    onClose
  }) => {
    let _type = type === 'info' ? 'primary' : type
    _type = type === 'error' ? 'danger' : _type
    const NoticeContent = (
      <React.Fragment>
        <div className={`hi-${prefix}__header`}>
          <Icon name={iconMap[_type]} className={`hi-${prefix}__icon`} filled />
          {title && <div className={`hi-${prefix}__title`}>{title}</div>}
        </div>

        {content && <div className={`hi-${prefix}__content`}>{content}</div>}
        {onConfirm && (
          <div className={`hi-${prefix}__footer`}>
            <Button
              size="small"
              type="primary"
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
      type: _type,
      onClose
    })
  }
}

export default notification
