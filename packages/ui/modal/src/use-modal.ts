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
  // TODO: 统一命名
  // closeOnOverlayClick = true,
  maskClosable = true,
  // onOverlayClick,
  onClose: onCloseProp,
  focusElementOnClose,
  trapFocus = true,
  returnFocusOnClose = true,
  container,
  ...rest
}: UseModalProps) => {
  const [modalElement, setModalElement] = useState<HTMLDivElement | null>(null)
  const modalElementRef = useLatestRef(modalElement)

  const returnFocusedElementRef = useRef<HTMLElement | null>(null)

  // const [_container, tryAppend, tryRemove] = useContainer(container)

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
    (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      evt.stopPropagation()

      if (maskClosable) {
        onRequestCloseLatest()
      }
    },
    [onRequestCloseLatest, maskClosable]
  )

  const onEscKeyDownLatest = useLatestCallback(onEscKeyDown)

  const onEscClose = useCallback(
    (evt: KeyboardEvent) => {
      // only close the top modal when pressing `Esc`
      if (evt.keyCode !== 27) return

      if (!stackManager.isTop(modalElementRef)) return

      onEscKeyDownLatest(evt)

      if (closeOnEsc) {
        onRequestCloseLatest()
      }
    },
    [closeOnEsc, onRequestCloseLatest, onEscKeyDownLatest, modalElementRef]
  )

  const trapTabKey = useCallback(
    (evt) => {
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
      return {
        role: 'dialog',
        'aria-modal': true,
        ...props,
        ref: mergeRefs(setModalElement, ref),
        tabIndex: -1,
        style: { ...props.style, display: !visible ? 'none' : undefined },
        onKeyDown: mockDefaultHandlers(props.onKeyDown, trapTabKey),
      }
    },
    [visible, trapTabKey]
  )

  const getOverlayProps = useCallback(
    (props = {}, ref = null) => {
      return {
        ...props,
        ref,
        onClick: mockDefaultHandlers(props.onClick, maskClosable ? handleClickOverlay : undefined),
      }
    },
    [maskClosable, handleClickOverlay]
  )

  return {
    rootProps: rest,
    modalElementRef,
    getModalProps,
    getOverlayProps,
  }
}

export interface UseModalProps {
  /**
   * 是否显示模态框
   */
  visible?: boolean
  closeOnEsc?: boolean
  onEscKeyDown?: (event: KeyboardEvent) => void
  maskClosable?: boolean
  lockScroll?: boolean
  /**
   * 指定 portal 的容器
   */
  container?: HTMLElement | null
  onClose?: () => void
  focusElementOnClose?: HTMLElement
  trapFocus?: boolean
  returnFocusOnClose?: boolean
  contentOutside?: boolean
  autoFocus?: boolean
}

export type UseModalReturn = ReturnType<typeof useModal>
