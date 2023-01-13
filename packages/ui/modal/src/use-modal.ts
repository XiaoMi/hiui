import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useStackManager, stackManager } from './hooks/use-stack'
import { useScrollLock } from '@hi-ui/use-scroll-lock'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { mergeRefs } from '@hi-ui/react-utils'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'

// TODO: 聚焦收敛器
const focusableElementsString =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'

export const useModal = ({
  // disabled = false,
  visible = false,
  lockScroll = true,
  closeOnEsc = true,
  autoFocus = true,
  onEscKeyDown,
  maskClosable = true,
  onClose: onCloseProp,
  focusElementOnClose,
  trapFocus = true,
  returnFocusOnClose = true,
  container,
  ...rest
}: UseModalProps) => {
  const [modalElement, setModalElement] = useState<HTMLDivElement | null>(null)
  const modalElementRef = useLatestRef(modalElement)
  const modalElementWrapperRef = useRef<HTMLDivElement | null>(null)
  // 鼠标按下时的事件对象
  const mouseDownElementRef = useRef<HTMLElement | null>(null)
  const returnFocusedElementRef = useRef<HTMLElement | null>(null)

  // 多任务以栈维护，可以控制显隐时序（后显先隐）
  useStackManager(modalElementRef, visible)

  const visibleMounted = visible && !!modalElement

  // 控制锁滚
  const enabledScrollLock = lockScroll && visibleMounted

  useScrollLock(modalElementRef, {
    enabled: enabledScrollLock,
    // @ts-ignore
    target: container?.parentNode,
  })

  useLayoutEffect(() => {
    if (autoFocus && visibleMounted) {
      modalElementRef.current?.focus()
    }
  }, [visibleMounted, modalElementRef, autoFocus])

  const onExitedLatest = useLatestCallback(() => {
    if (focusElementOnClose) {
      focusElementOnClose.focus()
    } else {
      if (returnFocusOnClose) {
        returnFocusedElementRef.current?.focus()
      }
    }
  })

  useEffect(() => {
    if (visible) {
      returnFocusedElementRef.current = document.activeElement as HTMLElement
    } else {
      onExitedLatest()
    }
  }, [visible, onExitedLatest])

  const onRequestCloseLatest = useLatestCallback(onCloseProp)

  const handleClickOverlay = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      // @ts-ignore
      if (modalElementWrapperRef.current?.contains(evt.target)) return

      // 当鼠标按下时的事件对象和当前点击对象不相等时，直接返回不处理
      // 例如：当鼠标在内容区域按下后滑动到外部，然后松开鼠标，此时就出现了这2个点击事件不同的情况
      if (evt.target !== mouseDownElementRef.current) return

      if (maskClosable) {
        if (!stackManager.isTop(modalElementRef)) return

        evt.stopPropagation()

        onRequestCloseLatest()
      }
    },
    [onRequestCloseLatest, maskClosable, modalElementRef]
  )

  const onEscKeyDownLatest = useLatestCallback(onEscKeyDown)

  const onEscClose = useCallback(
    (evt: React.KeyboardEvent) => {
      // only close the top modal when pressing `Esc`
      if (evt.keyCode !== 27) return

      if (!stackManager.isTop(modalElementRef)) return

      onEscKeyDownLatest(evt)

      if (closeOnEsc) {
        evt.preventDefault()
        evt.stopPropagation()
        onRequestCloseLatest()
      }
    },
    [closeOnEsc, onRequestCloseLatest, onEscKeyDownLatest, modalElementRef]
  )

  const trapTabKey = useCallback(
    (evt: React.KeyboardEvent) => {
      if (!modalElementRef.current) return

      // ESCAPE
      onEscClose(evt)

      // TODO: 抽离 useTrapFocus hook
      if (!trapFocus) return

      // Find all focusable children
      let focusableElements: any = modalElementRef.current.querySelectorAll(focusableElementsString)

      // Convert NodeList to Array
      focusableElements = Array.prototype.slice.call(focusableElements)

      const firstTabStop = focusableElements[0]
      const lastTabStop = focusableElements[focusableElements.length - 1]

      // Check for TAB key press
      if (evt.keyCode === 9) {
        // SHIFT + TAB
        if (evt.shiftKey) {
          if (document.activeElement === firstTabStop) {
            evt.preventDefault()
            lastTabStop.focus()
          }
          // TAB
        } else {
          if (document.activeElement === lastTabStop) {
            evt.preventDefault()
            firstTabStop.focus()
          }
        }
      }
    },
    [onEscClose, modalElementRef, trapFocus]
  )

  const getModalProps = useCallback(
    (props = {}, ref = null) => {
      const style = { outline: 'none', ...props.style }
      if (!visible) {
        style.display = 'none'
      }

      return {
        role: 'dialog',
        'aria-modal': true,
        ...props,
        ref: mergeRefs(setModalElement, ref),
        tabIndex: -1,
        style,
        onMouseDown: mockDefaultHandlers(props.onMouseDown, (evt: React.MouseEvent) => {
          // @ts-ignore
          mouseDownElementRef.current = evt.target
          evt.stopPropagation()
        }),
        onKeyDown: mockDefaultHandlers(props.onKeyDown, trapTabKey),
        onClick: mockDefaultHandlers(props.onClick, maskClosable ? handleClickOverlay : undefined),
      }
    },
    [visible, trapTabKey, maskClosable, handleClickOverlay]
  )

  const getModalWrapperProps = useCallback((props = {}, ref = null) => {
    return {
      ...props,
      ref: mergeRefs(modalElementWrapperRef, ref),
      onClick: mockDefaultHandlers(props.onClick, (evt: React.MouseEvent) => evt.stopPropagation()),
    }
  }, [])

  return {
    rootProps: rest,
    modalElementRef,
    getModalProps,
    getModalWrapperProps,
  }
}

export interface UseModalProps {
  /**
   * 	是否弹出显示
   */
  visible?: boolean
  /**
   * 开启 Esc 快捷键关闭
   */
  closeOnEsc?: boolean
  /**
   * 按下 Esc 时触发。暂不对外暴露
   * @private
   */
  onEscKeyDown?: (event: React.KeyboardEvent) => void
  /**
   * 开启点击蒙层时关闭
   */
  maskClosable?: boolean
  /**
   * 指定 portal 的容器
   */
  container?: HTMLElement | null
  /**
   * 关闭时回调（设置该项后，如果要实现点击蒙层关闭，还需要设置 onCancel）
   */
  onClose?: () => void
  /**
   * 开启弹出时滚动条锁定。暂不对外暴露
   * @private
   */
  lockScroll?: boolean
  /**
   * 设置关闭后聚焦元素，默认是上一个聚焦元素。暂不对外暴露
   * @private
   */
  focusElementOnClose?: HTMLElement
  /**
   * 开启跟踪收敛焦点到弹出层。暂不对外暴露
   * @private
   */
  trapFocus?: boolean
  /**
   * 开启关闭后焦点返回。暂不对外暴露
   * @private
   */
  returnFocusOnClose?: boolean
  /**
   * 开启自动聚焦。暂不对外暴露
   * @private
   */
  autoFocus?: boolean
}

export type UseModalReturn = ReturnType<typeof useModal>
