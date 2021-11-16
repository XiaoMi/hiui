import React, { useCallback, useMemo, useState } from 'react'
import { defaultTipIcon } from './icons'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestCallback } from '@hi-ui/use-latest'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { withDefaultProps } from '@hi-ui/react-utils'
import { PopperPortalProps } from '@hi-ui/popper'

export const usePopConfirm = ({
  role = 'alert-dialog',
  visible: visibleProp,
  onClose: onCloseProp,
  disabled = false,
  icon = defaultTipIcon,
  closeOnCancel = true,
  closeOnConfirm = true,
  onCancel: onCancelProp,
  onConfirm: onConfirmProp,
  popper,
  ...rest
}: UsePopConfirmProps) => {
  const [visible, trySetVisible] = useUncontrolledState(
    false,
    visibleProp,
    (nextVisible: boolean) => {
      if (!nextVisible) {
        onCloseProp?.()
      }
    }
  )

  const onToggle = useCallback(() => {
    trySetVisible((prev) => !prev)
  }, [trySetVisible])

  const onClose = useCallback(() => {
    trySetVisible(false)
  }, [trySetVisible])

  const cancelClose = useCallback(() => {
    if (closeOnCancel) {
      onClose()
    }
  }, [closeOnCancel, onClose])

  const confirmClose = useCallback(() => {
    if (closeOnConfirm) {
      onClose()
    }
  }, [closeOnConfirm, onClose])

  const onCancelLatest = useLatestCallback(onCancelProp)
  const onConfirmLatest = useLatestCallback(onConfirmProp)

  const onCancel = useMemo(() => mockDefaultHandlers(onCancelLatest, cancelClose), [
    onCancelLatest,
    cancelClose,
  ])

  const onConfirm = useMemo(() => mockDefaultHandlers(onConfirmLatest, confirmClose), [
    onConfirmLatest,
    confirmClose,
  ])

  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null)

  const getTriggerProps = useCallback(() => {
    return {
      // TODO: merge Refs
      ref: setTargetEl,
      onClick: onToggle,
    }
  }, [onToggle, setTargetEl])

  const getPopperProps = useCallback(() => {
    const popperProps = withDefaultProps(popper, { arrow: true, placement: 'top' })

    return {
      ...popperProps,
      visible,
      attachEl: targetEl,
      onClose,
    }
  }, [visible, targetEl, popper, onClose])

  const rootProps = {
    ...rest,
    role,
  }

  return {
    rootProps,
    getTriggerProps,
    getPopperProps,
    onCancel,
    onConfirm,
  }
}

export interface UsePopConfirmProps {
  /**
   * 语义化标签
   */
  role?: React.AriaRole
  /**
   *  是否显示确认框
   */
  visible?: boolean
  /**
   * 确认框关闭时回调
   */
  onClose?: () => void
  /**
   * 取消按钮文案
   */
  cancelText?: React.ReactNode
  /**
   * 确认按钮文案
   */
  confirmText?: React.ReactNode
  /**
   * 取消时关闭确认框
   */
  closeOnCancel?: boolean
  /**
   * 确认时关闭确认框
   */
  closeOnConfirm?: boolean
  /**
   * 点击取消按钮时回调
   */
  onCancel?: () => void
  /**
   * 点击确认按钮时回调
   */
  onConfirm?: () => void
  /**
   * 是否开启禁用
   */
  disabled?: boolean
  /**
   * 自定义提示的 icon 图标
   */
  icon?: React.ReactNode
  /**
   * 自定义控制 popper 行为，参见 `PopperProps`
   */
  popper?: Omit<PopperPortalProps, 'visible' | 'attachEl' | 'onClose'>
}

export type UsePopConfirmReturn = ReturnType<typeof usePopConfirm>
