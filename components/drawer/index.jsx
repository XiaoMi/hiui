import React, { useCallback, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Button from '../button'
import Icon from '../icon'
import Classnames from 'classnames'
import './style/index.scss'

const PREFIX = 'hi-drawer'

const getDefaultContainer = () => {
  const defaultContainer = document.createElement('div')
  document.body.appendChild(defaultContainer)
  return defaultContainer
}

const DrawerComp = ({ children, container, visible, title, onConfirm, onCancel }) => {
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false) {
    defaultContainer.current = getDefaultContainer()
  }
  return ReactDOM.createPortal(
    <div className={PREFIX}>
      <div className={`${PREFIX}__mask`} style={{ display: visible === false && 'none' }} />
      <div
        className={Classnames(`${PREFIX}__wrapper`, { [`${PREFIX}__wrapper--visible`]: visible })}
      >
        <div className={`${PREFIX}__header`}>
          {title}
          <Icon name={'close'} style={{ cursor: 'pointer' }} onClick={onCancel} />
        </div>
        <div className={`${PREFIX}__content`}>{children}</div>
        <div className={`${PREFIX}__footer`}>
          <Button type={'line'} onClick={onCancel}>
            取消
          </Button>
          <Button type={'primary'} onClick={onConfirm}>
            确认
          </Button>
        </div>
      </div>
    </div>,
    container || defaultContainer.current
  )
}

export default DrawerComp
