import React, { useEffect, useRef, useState, useCallback } from 'react'
import { unmountComponentAtNode, createPortal, render } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import Classnames from 'classnames'
import Provider from '../context/index'
import { Button } from '../button/Button'
import Icon from '../icon'
import './style/index'

const PREFIX = 'hi-modal'
const focusableElementsString =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'

const getDefaultContainer = () => {
  const defaultContainer = document.createElement('div')
  document.body.appendChild(defaultContainer)
  return defaultContainer
}

const InternalModalComp = ({
  children,
  container,
  visible,
  title,
  onConfirm,
  onCancel,
  maskClosable = true,
  width,
  height,
  size = 'default',
  showHeaderDivider = true,
  showFooterDivider = true,
  footer,
  confirmText,
  confirmLoading,
  cancelText,
  style,
  className,
  destroyOnClose,
  localeDatas,
  foucsElementOnClose = null,
  theme,
  closeable: propCloseable = true
}) => {
  // TODO: 整体可以抽成一个 hooks 供 modal 和 drawer 复用
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false && !container) {
    defaultContainer.current = getDefaultContainer()
  }

  const focusedElementBeforeOpenModal = useRef(null)
  const modalRef = useRef(null)
  const [closeable, setCloseable] = useState(propCloseable)
  useEffect(() => {
    setCloseable(closeable)
  }, [propCloseable])
  const trapTabKey = useCallback((e) => {
    // Find all focusable children
    let focusableElements = modalRef.current.querySelectorAll(focusableElementsString)
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
      onCancel()
    }
  }, [])

  const [vi, setVi] = useState(false)
  useEffect(() => {
    if (visible === true) {
      setVi(true)
      focusedElementBeforeOpenModal.current = document.activeElement
    }
  }, [visible])

  const destroy = useCallback(() => {
    const _container = container || defaultContainer.current
    unmountComponentAtNode(_container)
    _container.parentNode.removeChild(_container)
  }, [])

  useEffect(() => {
    const parent = (container || defaultContainer.current).parentNode
    // 屏蔽滚动条
    if (vi) {
      parent.style.setProperty('overflow', 'hidden')
    } else {
      parent.style.removeProperty('overflow')
      if (destroyOnClose) {
        destroy()
      }
    }
    modalRef.current.focus()
  }, [vi])

  return createPortal(
    <div
      className={Classnames(PREFIX, {
        [className]: className
      })}
    >
      <div
        className={Classnames(`${PREFIX}__mask`, {
          [`${PREFIX}__mask--visible`]: visible
        })}
      />
      <div
        className={`${PREFIX}__outter`}
        style={{ display: vi === false && 'none' }}
        onClick={() => {
          if (maskClosable && onCancel) {
            onCancel()
          }
        }}
      >
        <div className={`${PREFIX}__container`} tabIndex={-1} ref={modalRef} onKeyDown={trapTabKey}>
          <CSSTransition
            in={visible}
            timeout={0}
            classNames={'modal-transition'}
            onExited={() => {
              setTimeout(() => {
                setVi(false)
                if (foucsElementOnClose) {
                  foucsElementOnClose.focus()
                } else {
                  focusedElementBeforeOpenModal.current.focus()
                }
              }, 300)
            }}
          >
            <div
              className={Classnames(`${PREFIX}__wrapper`, `${PREFIX}__wrapper--${size}`)}
              style={{ width, height, ...style }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <div
                className={Classnames(`${PREFIX}__header`, {
                  [`${PREFIX}__header--divided`]: showHeaderDivider
                })}
              >
                {title}
                {closeable && (
                  <Icon
                    name={'close'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (onCancel) {
                        onCancel()
                      }
                    }}
                  />
                )}
              </div>
              <div className={`${PREFIX}__content`}>{children}</div>
              {footer !== null && (
                <div
                  className={Classnames(`${PREFIX}__footer`, {
                    [`${PREFIX}__footer--divided`]: showFooterDivider
                  })}
                >
                  {footer === undefined && cancelText !== null && (
                    <Button
                      type={'line'}
                      theme={theme}
                      onClick={() => {
                        if (onCancel) {
                          onCancel()
                        }
                      }}
                    >
                      {cancelText || localeDatas.modal.cancelText}
                    </Button>
                  )}
                  {footer === undefined && confirmText !== null && (
                    <Button
                      type={'primary'}
                      theme={theme}
                      loading={confirmLoading}
                      onClick={() => {
                        if (onConfirm) {
                          onConfirm()
                        }
                      }}
                    >
                      {confirmText || localeDatas.modal.confirmText}
                    </Button>
                  )}
                  {footer}
                </div>
              )}
            </div>
          </CSSTransition>
        </div>
      </div>
    </div>,
    container || defaultContainer.current
  )
}

const confirmIconMap = {
  success: { name: 'check-circle', color: '#1DA653' },
  error: { name: 'close-circle', color: '#EB5252' },
  warning: { name: 'exclamation-circle', color: '#e19d0b' },
  info: { name: 'info-circle', color: '#4284F5' }
}

const confirm = ({
  onConfirm,
  onCancel,
  title = '提示',
  content,
  type = 'default',
  confirmText,
  cancelText,
  className
}) => {
  const confirmContainer = document.createElement('div')

  document.body.appendChild(confirmContainer)
  const modal = React.createElement(ModalComp, {
    className,
    container: confirmContainer,
    title,
    width: 480,
    height: 240,
    visible: true,
    confirmText,
    cancelText,
    onConfirm: () => {
      onConfirm && onConfirm()
      confirmContainer.parentNode.style.removeProperty('overflow')
      unmountComponentAtNode(confirmContainer)
      confirmContainer.parentNode.removeChild(confirmContainer)
    },
    showFooterDivider: false,
    children: (
      <div style={{ display: 'flex', flex: 1 }}>
        {type !== 'default' && (
          <Icon
            name={confirmIconMap[type] && confirmIconMap[type].name}
            style={{
              color: confirmIconMap[type] && confirmIconMap[type].color,
              fontSize: '48px',
              marginRight: 12
            }}
          />
        )}
        {content}
      </div>
    ),
    onCancel: () => {
      onCancel && onCancel()
      confirmContainer.parentNode.style.removeProperty('overflow')
      unmountComponentAtNode(confirmContainer)
      confirmContainer.parentNode.removeChild(confirmContainer)
    }
  })
  render(modal, confirmContainer)
}
InternalModalComp.IS_FROM_HIUI = true
const ModalComp = Provider(InternalModalComp)
ModalComp.confirm = confirm
export default ModalComp
