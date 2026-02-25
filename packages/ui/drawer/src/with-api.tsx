import React, { createRef, createElement, useCallback, useState } from 'react'
import getReactDomRender from '@hi-ui/react-compat'
import * as Container from '@hi-ui/container'
import { getPrefixCls } from '@hi-ui/classname'
import { uuid } from '@hi-ui/use-id'
import { __DEV__ } from '@hi-ui/env'
import Button from '@hi-ui/button'
import { useLocaleContext } from '@hi-ui/core'
import { isUndef } from '@hi-ui/type-assertion'
import { Drawer, DrawerProps } from './Drawer'

const STATIC_CONTEXT_WARNING =
  'Static API `Drawer.open` creates a new React root and cannot access React Context (e.g. theme, i18n). Prefer `Drawer.useDrawer()` and place the returned contextHolder under your providers.'

const drawerPrefix = getPrefixCls('drawer')
const selector = `.${drawerPrefix}-api`

const drawerInstanceCache: Record<string, () => void> = {}

export interface DrawerManagerRef {
  close: () => void
  updateConfirmLoading: (v: boolean) => void
}

export interface DrawerManagerProps extends Omit<DrawerApiProps, 'visible'> {
  onExited: () => void
  onResolve?: (confirmed: boolean) => void
}

/**
 * 静态 API 与 useDrawerContext 共用的抽屉管理组件
 */
export const DrawerManager = React.forwardRef<DrawerManagerRef, DrawerManagerProps>(
  (
    {
      content,
      children,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      footer: configFooter,
      onClose,
      onExited,
      onResolve,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()
    const [visible, setVisible] = useState(true)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const closeFn = useCallback(() => setVisible(false), [])
    const apiRef = React.useRef<DrawerManagerRef>({
      close: closeFn,
      updateConfirmLoading: () => {},
    })
    apiRef.current.close = closeFn
    apiRef.current.updateConfirmLoading = setConfirmLoading

    React.useImperativeHandle(ref, () => apiRef.current, [])

    // TODO 确认此处使用 Modal 的国际化文案是否 ok
    const resolvedConfirmText = isUndef(confirmText) ? i18n.get('modal.confirmText') : confirmText
    const resolvedCancelText = isUndef(cancelText) ? i18n.get('modal.cancelText') : cancelText
    const hasConfirm = confirmText !== null && (confirmText !== undefined || onConfirm != null)
    const hasCancel = cancelText !== null && cancelText !== undefined
    const useConfirmFooter = hasConfirm || hasCancel

    const handleConfirm = useCallback(async () => {
      apiRef.current.updateConfirmLoading(true)
      try {
        await onConfirm?.()
        onResolve?.(true)
      } catch (e) {
        console.warn('onConfirm error', e)
        onResolve?.(false)
      } finally {
        apiRef.current.updateConfirmLoading(false)
        closeFn()
      }
    }, [onConfirm, onResolve, closeFn])

    const handleCancel = useCallback(() => {
      onCancel?.()
      onResolve?.(false)
      closeFn()
    }, [onCancel, onResolve, closeFn])

    const handleClose = useCallback(() => {
      onClose?.()
      onResolve?.(false)
      closeFn()
    }, [onClose, onResolve, closeFn])

    // 动画结束后调用 onExited（静态 API 时卸载容器，useDrawer 时由 afterClose 从 holder 移除）
    const handleExited = useCallback(() => {
      onExited()
    }, [onExited])

    const drawerContent = content ?? children

    const footer =
      configFooter !== undefined ? (
        configFooter
      ) : useConfirmFooter ? (
        <div className={`${drawerPrefix}__footer--has-actions`}>
          {hasCancel ? (
            <Button key="cancel" type="default" appearance="line" onClick={handleCancel}>
              {resolvedCancelText}
            </Button>
          ) : null}
          {hasConfirm ? (
            <Button key="confirm" type="primary" loading={confirmLoading} onClick={handleConfirm}>
              {resolvedConfirmText}
            </Button>
          ) : null}
        </div>
      ) : undefined

    return (
      <Drawer
        {...rest}
        visible={visible}
        onClose={handleClose}
        onExited={handleExited}
        footer={footer}
      >
        {drawerContent}
      </Drawer>
    )
  }
)
DrawerManager.displayName = 'DrawerManager'

const open = (config: DrawerApiProps = {}) => {
  if (__DEV__) {
    console.warn(STATIC_CONTEXT_WARNING)
  }
  let { key } = config
  if (!key) {
    key = uuid()
  }

  const selectorId = `${selector}__${key}`
  let container: HTMLElement | null = Container.getContainer(selectorId) as HTMLElement
  let mockUnmount: (() => void) | null = null

  const managerRef = createRef<DrawerManagerRef>()

  const ClonedDrawer = createElement(DrawerManager, {
    ...config,
    container,
    ref: managerRef,
    onExited: () => {
      // 卸载
      if (container) {
        mockUnmount?.()
        Container.removeContainer(selectorId)
      }
      container = null
    },
  })

  requestAnimationFrame(() => {
    if (container) {
      const render = getReactDomRender()
      mockUnmount = render(ClonedDrawer, container)
    }
  })

  const close = () => {
    managerRef.current?.close()
  }

  if (key) {
    drawerInstanceCache[key] = close
  }

  return key
}

const close = (key: string) => {
  if (typeof drawerInstanceCache[key] === 'function') {
    drawerInstanceCache[key]()
  }
  delete drawerInstanceCache[key]
}

export interface DrawerApiProps extends Omit<DrawerProps, 'visible'> {
  /**
   * open 的内容
   */
  content?: React.ReactNode
  /**
   * 组件实例唯一标识
   */
  key?: string
  confirmText?: React.ReactNode | null
  cancelText?: React.ReactNode | null
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export const staticApis = {
  open,
  close,
}
