import React, { useEffect, useRef, useState, useCallback } from 'react'
import { unmountComponentAtNode, createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import Classnames from 'classnames'
import Provider from '../context/index'
import Button from '../button'
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
  cancelText,
  style,
  className,
  destroyOnClose,
  localeDatas
}) => {
  // TODO: 整体可以抽成一个 hooks 供 modal 和 drawer 复用
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false && !container) {
    defaultContainer.current = getDefaultContainer()
  }

  const focusedElementBeforeOpenModal = useRef(null)
  const modalRef = useRef(null)

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
        onClick={() => {
          if (maskClosable && onCancel) {
            onCancel()
          }
        }}
      />
      <div
        className={`${PREFIX}__container`}
        style={{ display: vi === false && 'none' }}
        tabIndex={-1}
        ref={modalRef}
        onKeyDown={trapTabKey}
      >
        <CSSTransition
          in={visible}
          timeout={0}
          classNames={'modal-transition'}
          onExited={() => {
            setTimeout(() => {
              setVi(false)
              focusedElementBeforeOpenModal.current.focus()
            }, 300)
          }}
        >
          <div
            className={Classnames(`${PREFIX}__wrapper`, `${PREFIX}__wrapper--${size}`)}
            style={{ width, height, ...style }}
          >
            <div
              className={Classnames(`${PREFIX}__header`, {
                [`${PREFIX}__header--divided`]: showHeaderDivider
              })}
            >
              {title}
              <Icon
                name={'close'}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (onCancel) {
                    onCancel()
                  }
                }}
              />
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
    </div>,
    container || defaultContainer.current
  )
}

const ModalComp = Provider(InternalModalComp)
ModalComp.confirm = confirm
export default ModalComp
