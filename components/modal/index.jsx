import React, { useEffect, useRef, useState, useCallback } from 'react'
import { render, unmountComponentAtNode, createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import Classnames from 'classnames'
import Button from '../button'
import Icon from '../icon'
import './style/index'

const PREFIX = 'hi-modal'

const getDefaultContainer = () => {
  const defaultContainer = document.createElement('div')
  document.body.appendChild(defaultContainer)
  return defaultContainer
}

const ModalComp = ({
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
  destroyOnClose
}) => {
  // TODO: 整体可以抽成一个 hooks 供 modal 和 drawer 复用
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false && !container) {
    defaultContainer.current = getDefaultContainer()
  }
  const [vi, setVi] = useState(false)
  useEffect(() => {
    visible && setVi(true)
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
      <div className={`${PREFIX}__container`} style={{ display: vi === false && 'none' }}>
        <CSSTransition
          in={visible}
          timeout={0}
          classNames={'modal-transition'}
          onExited={() => {
            setTimeout(() => setVi(false), 300)
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
                    {cancelText || '取消'}
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
                    {confirmText || '确认'}
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

const confirmIconMap = {
  success: { name: 'check-circle', color: '#1DA653' },
  error: { name: 'close-circle', color: '#EB5252' },
  warning: { name: 'exclamation-circle', color: '#e19d0b' },
  info: { name: 'info-circle', color: '#4284F5' }
}

const confirm = ({ onConfirm, onCancel, title = '提示', content, type = 'default', confirmText, cancelText }) => {
  const confirmContainer = document.createElement('div')

  document.body.appendChild(confirmContainer)
  const modal = React.createElement(ModalComp, {
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

ModalComp.confirm = confirm
export default ModalComp
