import open from '../notice'
import './style/index'
import React from 'react'
import Button from '../button'
import classNames from 'classnames'

const iconMap = {
  success: 'chenggong',
  error: 'shibai',
  warning: 'jinggao',
  info: 'tishi'
}
const iconColorMap = {
  success: '#1DA653',
  error: '#F44141',
  warning: '#E19D0C',
  info: '#4284F5'
}

const notification = {
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
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 12, fontSize: '16px', color: iconColorMap[type] }}>
            <i className={classNames('hi-icon', `icon-${iconMap[type]}`)} />
          </span>
          {title && <div className={`hi-${prefix}__title`}>{title}</div>}
        </div>

        {content && <div className={`hi-${prefix}__content`}>{content}</div>}
        {onConfirm && (
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                onConfirm()
              }}
            >
              {confirmText || '确认'}
            </Button>
          </div>
        )}
      </div>
    )
    open({
      title,
      content: NoticeContent,
      prefix,
      key,
      closable,
      duration,
      type,
      // confirmText,
      // onConfirm,
      onClose
    })
  }
}

export default notification
