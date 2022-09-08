import { useCallback, useState } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { withDefaultProps, mergeRefs } from '@hi-ui/react-utils'
import { omitPopperOverlayProps } from '@hi-ui/popper'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'

export const usePopConfirm = ({
  visible: visibleProp,
  disabled = false,
  closeOnCancel = true,
  closeOnConfirm = true,
  onCancel: onCancelProp,
  onConfirm: onConfirmProp,
  onOpen,
  onClose,
  ...restProps
}: UsePopConfirmProps) => {
  // TODO: 移除 popper，使用 hook 重写
  const [popper, rest] = omitPopperOverlayProps(restProps) as any

  const [visible, visibleAction] = useUncontrolledToggle({
    defaultVisible: false,
    visible: visibleProp,
    onOpen,
    onClose: () => {
      onClose?.()
      onCancelProp?.()
    },
  })

  const onCancel = useCallback(() => {
    if (closeOnCancel) {
      visibleAction.off()
    }
  }, [closeOnCancel, visibleAction])

  const onConfirmLatest = useLatestCallback(onConfirmProp)

  const onConfirm = useCallback(() => {
    onConfirmLatest()
    if (closeOnConfirm) {
      visibleAction.off()
    }
  }, [closeOnConfirm, visibleAction, onConfirmLatest])

  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null)

  const getTriggerProps = useCallback(
    (props, ref) => {
      return {
        ref: mergeRefs(setTargetEl, ref),
        onClick: mockDefaultHandlers(props.onClick, visibleAction.not),
      }
    },
    [visibleAction, setTargetEl]
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
      onClose: visibleAction.off,
    }
  }, [visible, targetEl, popper, visibleAction])

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
   * 取消时关闭确认框。暂不对外暴露
   * @private
   */
  closeOnCancel?: boolean
  /**
   * 确认时关闭确认框。暂不对外暴露
   * @private
   */
  closeOnConfirm?: boolean
  /**
   * 弹窗打开时回调
   */
  onOpen?: () => void
  /**
   * 弹窗关闭时回调
   */
  onClose?: () => void
  /**
   * 点击取消按钮时回调
   */
  onCancel?: () => void
  /**
   * 点击确认按钮时回调
   */
  onConfirm?: () => void
  /**
   * 设置基于 reference 元素的间隙偏移量
   */
  gutterGap?: number
  /**
   * 是否开启禁用。暂不对外暴露
   * @private
   */
  disabled?: boolean
}

export type UsePopConfirmReturn = ReturnType<typeof usePopConfirm>
