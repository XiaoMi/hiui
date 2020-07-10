import React, { useEffect, useRef } from 'react'
import { render, unmountComponentAtNode, createPortal } from 'react-dom'
import Classnames from 'classnames'
import Button from '../button'
import Icon from '../icon'
import './style/index.scss'

const PREFIX = 'hi-modal'

const getDefaultContainer = () => {
  const defaultContainer = document.createElement('div')
  document.body.appendChild(defaultContainer)
  return defaultContainer
}
// TODO:Confirm
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
  showFooterDivider = true
}) => {
  // TODO: 整体可以抽成一个 hooks 供 modal 和 drawer 复用
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false && !container) {
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

  return createPortal(
    <div className={PREFIX}>
      <div
        className={Classnames(`${PREFIX}__mask`, { [`${PREFIX}__mask--visible`]: visible })}
        onClick={() => {
          if (maskClosable && onCancel) {
            onCancel()
          }
        }}
      />
      <div
        className={Classnames(`${PREFIX}__wrapper`, `${PREFIX}__wrapper--${size}`)}
        style={{ display: visible === false && 'none', width, height }}
      >
        <div className={Classnames(`${PREFIX}__header`, { [`${PREFIX}__header--divided`]: showHeaderDivider })}>
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
        <div className={Classnames(`${PREFIX}__footer`, { [`${PREFIX}__footer--divided`]: showFooterDivider })}>
          <Button
            type={'line'}
            onClick={() => {
              if (onCancel) {
                onCancel()
              }
            }}
          >
            取消
          </Button>
          <Button
            type={'primary'}
            onClick={() => {
              if (onConfirm) {
                onConfirm()
              }
            }}
          >
            确认
          </Button>
        </div>
      </div>
    </div>,
    container || defaultContainer.current
  )
}

function confirm ({ onConfirm, onCancel, title = '提示', content, type = 'default' }) {
  const confirmContainer = document.createElement('div')

  document.body.appendChild(confirmContainer)
  const modal = React.createElement(ModalComp, {
    container: confirmContainer,
    title,
    size: 'small',
    visible: true,
    onConfirm: () => {
      onConfirm()
      unmountComponentAtNode(confirmContainer)
      confirmContainer.parentNode.removeChild(confirmContainer)
    },
    children: content,
    onCancel: () => {
      onCancel && onCancel()
      unmountComponentAtNode(confirmContainer)
      confirmContainer.parentNode.removeChild(confirmContainer)
    }
  })
  render(modal, confirmContainer)
}

ModalComp.confirm = confirm
export default ModalComp
