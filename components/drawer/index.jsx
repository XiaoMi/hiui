import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Icon from '../icon'
import Classnames from 'classnames'
import './style/index.scss'

const PREFIX = 'hi-drawer'

const getDefaultContainer = () => {
  const defaultContainer = document.createElement('div')
  document.body.appendChild(defaultContainer)
  return defaultContainer
}

const DrawerComp = ({
  children,
  container,
  visible,
  title,
  onClose,
  maskClosable = true,
  closable = true,
  footer,
  width,
  showMask = true,
  placement = 'right'
}) => {
  // TODO: 整体可以抽成一个 hooks 供 modal 和 drawer 复用
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false) {
    defaultContainer.current = getDefaultContainer()
  }

  useEffect(() => {
    const parent = (container || defaultContainer.current).parentNode
    // 屏蔽滚动条
    if (visible) {
      parent.style.setProperty('overflow', 'hidden')
    } else {
      parent.style.removeProperty('overflow')
    }
  }, [visible, container])

  return ReactDOM.createPortal(
    <div className={PREFIX}>
      {showMask && (
        <div
          className={Classnames(`${PREFIX}__mask`, { [`${PREFIX}__mask--visible`]: visible })}
          onClick={() => {
            if (maskClosable) {
              onClose()
            }
          }}
        />
      )}
      <div
        style={{ width: width }}
        className={Classnames(`${PREFIX}__wrapper`, `${PREFIX}__wrapper--${placement}`, {
          [`${PREFIX}__wrapper--visible`]: visible
        })}
      >
        <div className={`${PREFIX}__header`}>
          {title}
          {closable && <Icon name={'close'} style={{ cursor: 'pointer' }} onClick={onClose} />}
        </div>
        <div className={`${PREFIX}__content`}>{children}</div>
        {footer && <div className={`${PREFIX}__footer`}>{footer}</div>}
      </div>
    </div>,
    container || defaultContainer.current
  )
}

export default DrawerComp
