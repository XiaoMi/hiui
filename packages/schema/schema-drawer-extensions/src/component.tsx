import React, { useState } from 'react'
import { useMount } from 'ahooks'
import { Drawer, type DrawerProps } from '@hi-ui/drawer'
import { Button, type ButtonProps } from '@hi-ui/button'
import { ArrowLeftOutlined } from '@hi-ui/icons'
import { execPromiseCheckChain, type CheckChainValueType } from '@hi-ui/schema-utils'

export type EnhancedDrawerProps = Omit<DrawerProps, 'onConfirm' | 'onCancel' | 'onClose'> & {
  onConfirm?: () => CheckChainValueType
  onCancel?: () => CheckChainValueType
  beforeClose?: () => void
  confirmText?: React.ReactNode
  confirmBtnType?: ButtonProps['type']
  cancelText?: React.ReactNode
  cancelBtnType?: ButtonProps['type']
  closeOnBlocked?: boolean
  /**
   * 是否显示返回按钮
   * - 开启时在标题元素左侧渲染返回按钮
   * - 点击时触发 onCancel 事件
   */
  showBack?: boolean
}

export function EnhancedDrawer(props: EnhancedDrawerProps) {
  const {
    confirmText = '确定',
    confirmBtnType = 'primary',
    cancelText = '取消',
    cancelBtnType = 'default',
    onConfirm,
    onCancel,
    beforeClose,
    closeOnBlocked,
    showBack,
    ...rest
  } = props

  const [visible, setVisible] = useState(false)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)

  const handleClose = () => {
    beforeClose?.()
    setVisible(false)
  }

  const onCancelClick = () => {
    const value = onCancel?.()
    execPromiseCheckChain(value, {
      beforeCheck() {
        setIsCancelLoading(true)
        setIsConfirmLoading(true)
      },
      onPassed() {
        setIsCancelLoading(false)
        setIsConfirmLoading(false)
        handleClose()
      },
      onBlocked() {
        setIsCancelLoading(false)
        setIsConfirmLoading(false)
      },
    })
  }

  const onOkClick = () => {
    const value = onConfirm?.()
    execPromiseCheckChain(value, {
      beforeCheck() {
        setIsCancelLoading(true)
        setIsConfirmLoading(true)
      },
      onPassed() {
        setIsCancelLoading(false)
        setIsConfirmLoading(false)
        handleClose()
      },
      onBlocked() {
        setIsCancelLoading(false)
        setIsConfirmLoading(false)
        if (closeOnBlocked) {
          handleClose()
        }
      },
    })
  }

  // 完成挂载后再显示弹窗，避免闪动
  useMount(() => {
    setVisible(true)
  })

  return (
    <Drawer
      {...rest}
      visible={visible}
      title={
        <DrawerTitleEl
          // title
          title={rest.title}
          showBack={showBack}
          onClick={onCancelClick}
        />
      }
      // onCancel={onCancelClick}
      onClose={onCancelClick}
      footer={
        rest.footer || (
          <div style={{ textAlign: 'right' }}>
            {cancelText ? (
              <Button
                onClick={onCancelClick}
                loading={isCancelLoading}
                type={cancelBtnType}
                key="cancel"
              >
                {cancelText}
              </Button>
            ) : null}
            {confirmText ? (
              <Button
                onClick={onOkClick}
                loading={isConfirmLoading}
                type={confirmBtnType}
                key="confirm"
              >
                {confirmText}
              </Button>
            ) : null}
          </div>
        )
      }
    ></Drawer>
  )
}

function DrawerTitleEl(
  props: Pick<EnhancedDrawerProps, 'title' | 'showBack'> & { onClick?: () => void }
) {
  if (props.showBack) {
    return (
      <span>
        <Button
          appearance="link"
          onClick={props.onClick}
          icon={<ArrowLeftOutlined size={16} />}
          style={{ marginRight: 12 }}
        />

        {props.title ? <span>{props.title}</span> : null}
      </span>
    )
  }

  if (props.title) {
    return <>{props.title}</>
  }

  return null
}
