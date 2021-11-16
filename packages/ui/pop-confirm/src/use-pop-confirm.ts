import React, { useCallback, useMemo, useState } from 'react'
import { defaultTipIcon } from './icons'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestCallback } from '@hi-ui/use-latest'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { PopperProps } from '../../popper/lib/types/Popper'

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
    return {
      ...popper,
      visible,
      attachEl: targetEl,
      onClose,
      arrow: popper?.arrow ?? true,
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
  popper?: Omit<PopperProps, 'visible' | 'attachEl' | 'onClose'>
}

export type UsePopConfirmReturn = ReturnType<typeof usePopConfirm>

/**
 * 通用确认弹窗
 * TODO: 抽离到 Modal，拆分出一个子组件，专门用于局部弹窗确认的场景
 */
// const useConfirmPopper = (props: UseConfirmPopperProps) => {
//   const { prefixCls, onConfirm, content, confirmText, cancelText } = props

//   const [visible, toggleAction] = useToggle()

//   const [targetEl, setTargetEl] = useState<any>(null)
//   const popperElRef = useRef<HTMLDivElement | null>(null)
//   const arrowElRef = useRef<HTMLDivElement | null>(null)

//   const { styles, attributes } = usePopper(targetEl, popperElRef.current, {
//     placement: 'bottom-end',
//     modifiers: [
//       {
//         enabled: true,
//         name: 'arrow',
//         options: {
//           element: arrowElRef.current,
//         },
//       },
//       {
//         enabled: true,
//         name: 'offset',
//         options: {
//           offset: [4, 4],
//         },
//       },
//     ],
//   })

//   useOutsideClick(popperElRef, toggleAction.off)

//   const Modal = visible ? (
//     <div ref={popperElRef} style={{ ...styles.popper, zIndex: 1 }} {...attributes.popper}>
//       <div ref={arrowElRef} style={styles.arrow} className={`${prefixCls}-modal-arrow`} />
//       <div className={`${prefixCls}-modal`}>
//         <section className={`${prefixCls}-modal__body`}>{content}</section>
//         <footer className={`${prefixCls}-modal__footer`}>
//           <Button
//             className={`${prefixCls}-modal__btn--cancel`}
//             type="primary"
//             appearance="line"
//             onClick={(evt) => {
//               // 阻止冒泡，避免触发节点选中
//               evt.stopPropagation()
//               toggleAction.off()
//            }}
//           >
//             {cancelText}
//           </Button>
//           <Button type="primary" className={`${prefixCls}-modal__btn--confirm`} onClick={onConfirm}>
//             {confirmText}
//           </Button>
//         </footer>
//       </div>
//     </div>
//   ) : null

//   return [setTargetEl, Modal, toggleAction.on] as const
// }

// interface UseConfirmPopperProps {
//   prefixCls: string
//   onConfirm: (evt: React.MouseEvent<Element, MouseEvent>) => void
//   content: string
//   confirmText: string
//   cancelText: string
// }
