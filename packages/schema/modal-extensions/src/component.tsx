import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Modal, type ModalProps } from '@hi-ui/modal'
import { Button, type ButtonProps } from '@hi-ui/button'
import { execPromiseCheckChain, type CheckChainValueType } from '@hi-ui/schema-utils' // TODO 考虑拆单独的包出来

export type EnhancedModalProps = Omit<ModalProps, 'onConfirm' | 'onCancel'> & {
  onConfirm?: () => CheckChainValueType
  onCancel?: () => CheckChainValueType
  confirmBtnType?: ButtonProps['type']
  cancelBtnType?: ButtonProps['type']
  closeOnBlocked?: boolean
}

export function EnhancedModal(props: EnhancedModalProps) {
  const {
    confirmText = '确定',
    confirmBtnType = 'primary',
    cancelText = '取消',
    cancelBtnType = 'default',
    ...rest
  } = props

  const [visible, setVisible] = useState(true)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)

  // 组件挂载状态跟踪
  const isMountedRef = useRef(true)

  // 组件卸载时清理挂载状态
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // 安全的状态更新函数
  const safeSetState = useCallback((updater: () => void) => {
    if (isMountedRef.current) {
      updater()
    }
  }, [])

  const onCancelClick = () => {
    const value = props.onCancel?.()
    execPromiseCheckChain(value, {
      beforeCheck() {
        safeSetState(() => {
          setIsCancelLoading(true)
          setIsConfirmLoading(true)
        })
      },
      onPassed() {
        safeSetState(() => {
          setIsCancelLoading(false)
          setIsConfirmLoading(false)
          setVisible(false)
        })
      },
      onBlocked() {
        safeSetState(() => {
          setIsCancelLoading(false)
          setIsConfirmLoading(false)
        })
      },
    })
  }

  const onOkClick = () => {
    const value = props.onConfirm?.()
    execPromiseCheckChain(value, {
      beforeCheck() {
        safeSetState(() => {
          setIsCancelLoading(true)
          setIsConfirmLoading(true)
        })
      },
      onPassed() {
        safeSetState(() => {
          setIsCancelLoading(false)
          setIsConfirmLoading(false)
          setVisible(false)
        })
      },
      onBlocked() {
        safeSetState(() => {
          setIsCancelLoading(false)
          setIsConfirmLoading(false)
          if (props.closeOnBlocked) {
            setVisible(false)
          }
        })
      },
    })
  }

  return (
    <Modal
      {...rest}
      visible={visible}
      onCancel={onCancelClick}
      onClose={onCancelClick}
      onConfirm={onOkClick}
      footer={
        rest.footer || [
          cancelText ? (
            <Button
              onClick={onCancelClick}
              loading={isCancelLoading}
              type={cancelBtnType}
              key="cel"
            >
              {cancelText}
            </Button>
          ) : null,
          confirmText ? (
            <Button onClick={onOkClick} loading={isConfirmLoading} type={confirmBtnType} key="ok">
              {confirmText}
            </Button>
          ) : null,
        ]
      }
    ></Modal>
  )
}
