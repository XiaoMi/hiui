import React, { useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import Icon from '../icon'
import Classnames from 'classnames'
import './style/index'

const PREFIX = 'hi-drawer'
const focusableElementsString =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'

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
  placement = 'right',
  className
}) => {
  // TODO: 整体可以抽成一个 hooks 供 modal 和 drawer 复用
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false) {
    defaultContainer.current = getDefaultContainer()
  }

  const focusedElementBeforeOpenModal = useRef(null)
  const drawerRef = useRef(null)

  const trapTabKey = useCallback((e) => {
    // Find all focusable children
    let focusableElements = drawerRef.current.querySelectorAll(focusableElementsString)
    // Convert NodeList to Array
    focusableElements = Array.prototype.slice.call(focusableElements)
    const firstTabStop = focusableElements[0]
    const lastTabStop = focusableElements[focusableElements.length - 1]
    // Check for TAB key press
    if (e.keyCode === 9) {
      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault()
          lastTabStop.focus()
        }
        // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault()
          firstTabStop.focus()
        }
      }
    }
    // ESCAPE
    if (e.keyCode === 27) {
      onClose()
    }
  }, [])

  useEffect(() => {
    const parent = (container || defaultContainer.current).parentNode
    // 屏蔽滚动条
    if (visible) {
      parent.style.setProperty('overflow', 'hidden')
      focusedElementBeforeOpenModal.current = document.activeElement
      drawerRef.current.focus()
    } else {
      parent.style.removeProperty('overflow')
      focusedElementBeforeOpenModal.current && focusedElementBeforeOpenModal.current.focus()
    }
  }, [visible, container])

  return ReactDOM.createPortal(
    <div className={Classnames(PREFIX, className)}>
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
        tabIndex={-1}
        ref={drawerRef}
        onKeyDown={trapTabKey}
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
