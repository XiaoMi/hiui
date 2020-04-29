import React, { useCallback, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Button from '../button'
import Icon from '../icon'
import './style/index.scss'

const PREFIX = 'hi-editor-modal'

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
  hide,
  show
}) => {
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false) {
    defaultContainer.current = container || getDefaultContainer()
  }
  return ReactDOM.createPortal(
    <div className={PREFIX} style={{ display: visible === false && 'none' }}>
      <div className={`${PREFIX}__mask`} />
      <div className={`${PREFIX}__wrapper`}>
        <div className={`${PREFIX}__header`}>
          {title}
          <Icon
            name={'close'}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (hide) {
                hide()
              }
              if (onCancel) {
                onCancel()
              }
            }}
          />
        </div>
        <div className={`${PREFIX}__content`}>{children}</div>
        <div className={`${PREFIX}__footer`}>
          <Button
            type={'line'}
            onClick={() => {
              if (hide) {
                hide()
              }
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
              if (hide) {
                hide()
              }
            }}
          >
            确认
          </Button>
        </div>
      </div>
    </div>,
    defaultContainer.current
  )
}

export const useModal = () => {
  const defaultContainer = useRef(false)
  if (defaultContainer.current === false) {
    defaultContainer.current = getDefaultContainer()
  }
  const [visible, setVisible] = useState(false)

  const show = useCallback(() => setVisible(true), [])
  const hide = useCallback(() => setVisible(false), [])

  const Modal = ({ children, title, onConfirm, onCancel, container }) => (
    <React.Fragment>
      {
        <ModalComp
          title={title}
          visible={visible}
          onConfirm={onConfirm}
          onCancel={onCancel}
          closeModal={hide}
          container={container}
          show={show}
          hide={hide}
        >
          {children}
        </ModalComp>
      }
    </React.Fragment>
  )

  return {
    show,
    hide,
    Modal
  }
}

export default ModalComp
