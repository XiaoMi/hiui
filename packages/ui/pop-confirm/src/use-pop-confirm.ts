import React, { useCallback, useMemo, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestCallback } from '@hi-ui/use-latest'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { withDefaultProps, mergeRefs } from '@hi-ui/react-utils'
import { PopperPortalProps } from '@hi-ui/popper'

export const usePopConfirm = ({
  visible: visibleProp,
  onClose: onCloseProp,
  disabled = false,
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

  const getTriggerProps = useCallback(
    (props, ref) => {
      return {
        ref: mergeRefs(setTargetEl, ref),
        onClick: mockDefaultHandlers(props.onClick, onToggle),
      }
    },
    [onToggle, setTargetEl]
  )

  const getPopperProps = useCallback(() => {
    const popperProps = withDefaultProps(popper, {
      arrow: true,
      placement: 'top',
      // @DesignToken 10
      gutterGap: 14,
    })

    return {
      ...popperProps,
      visible,
      attachEl: targetEl,
      onClose,
    }
  }, [visible, targetEl, popper, onClose])

  const rootProps = {
    role: 'alert-dialog',
    ...rest,
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
   *  是否显示确认框
   */
  visible?: boolean
  /**
   * 确认框关闭时回调
   */
  onClose?: () => void
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
  onCancel?: (event: React.MouseEvent) => void
  /**
   * 点击确认按钮时回调
   */
  onConfirm?: (event: React.MouseEvent) => void
  /**
   * 是否开启禁用
   */
  disabled?: boolean
  /**
   * 自定义控制 popper 行为，参见 `PopperProps`
   */
  popper?: Omit<PopperPortalProps, 'visible' | 'attachEl' | 'onClose'>
}

export type UsePopConfirmReturn = ReturnType<typeof usePopConfirm>
