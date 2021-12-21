import React from 'react'
import { TriggerActionEnum } from './types'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { PopperPortalProps } from '@hi-ui/popper'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { mergeRefs, withDefaultProps } from '@hi-ui/react-utils'
import { useUID } from '@hi-ui/use-id'
import { useUnmountEffect } from '@hi-ui/use-unmount-effect'
import { normalizeArray } from '@hi-ui/array-utils'

export const usePopover = ({
  visible: visibleProp,
  onOpen,
  onClose,
  trigger: triggerProp = 'click',
  popper,
  ...rest
}: UsePopoverProps) => {
  const openTimerRef = React.useRef<number>()
  const closeTimerRef = React.useRef<number>()

  const clearToggleTimer = React.useCallback(() => {
    window.clearTimeout(openTimerRef.current)
    window.clearTimeout(closeTimerRef.current)
  }, [])

  const [visible, visibleAction] = useUncontrolledToggle({
    defaultVisible: false,
    visible: visibleProp,
    onOpen,
    onClose: () => {
      clearToggleTimer()
      onClose?.()
    },
  })

  useUnmountEffect(clearToggleTimer)

  const [triggerEl, setTriggerEl] = React.useState<HTMLElement | null>(null)

  const hoveringRef = React.useRef<boolean>(false)

  const trigger = normalizeArray(triggerProp)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggersMemo = React.useMemo(() => trigger, trigger)

  const popoverId = useUID('popover')

  const handlePopoverLeave = React.useCallback(() => {
    hoveringRef.current = false
    clearTimeout(openTimerRef.current)

    closeTimerRef.current = window.setTimeout(() => {
      if (hoveringRef.current) return
      visibleAction.off()
    }, 200)
  }, [visibleAction])

  const handlePopoverEnter = React.useCallback(() => {
    hoveringRef.current = true

    openTimerRef.current = window.setTimeout(() => {
      visibleAction.on()
    }, 0)
  }, [visibleAction])

  const getOverlayProps = React.useCallback(
    (props = {}, ref = null) => {
      const popoverProps = {
        ...props,
        ref,
        role: 'dialog',
        id: popoverId,
      }

      if (triggersMemo.includes(TriggerActionEnum.HOVER)) {
        popoverProps.onMouseEnter = mockDefaultHandlers(props.onMouseEnter, () => {
          hoveringRef.current = true
        })

        popoverProps.onMouseLeave = mockDefaultHandlers(props.onMouseLeave, handlePopoverLeave)
      }

      return popoverProps
    },

    [triggersMemo, popoverId, handlePopoverLeave]
  )

  const getTriggerProps = React.useCallback(
    (props = {}, ref = null) => {
      const triggerProps = {
        ...props,
        ref: mergeRefs(setTriggerEl, ref),
        'aria-controls': popoverId,
        'aria-haspopup': 'dialog',
        'aria-expanded': visible,
      }

      if (triggersMemo.includes(TriggerActionEnum.CLICK)) {
        triggerProps.onClick = mockDefaultHandlers(props.onClick, visibleAction.not)
      }

      if (triggersMemo.includes(TriggerActionEnum.HOVER)) {
        // @ref https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html
        triggerProps.onFocus = mockDefaultHandlers(props.onFocus, visibleAction.on)
        triggerProps.onBlur = mockDefaultHandlers(props.onBlur, visibleAction.off)

        triggerProps.onMouseEnter = mockDefaultHandlers(props.onMouseEnter, handlePopoverEnter)
        triggerProps.onMouseLeave = mockDefaultHandlers(props.onMouseLeave, handlePopoverLeave)
      } else if (triggersMemo.includes(TriggerActionEnum.FOCUS)) {
        triggerProps.onFocus = mockDefaultHandlers(props.onFocus, visibleAction.on)
        triggerProps.onBlur = mockDefaultHandlers(props.onBlur, visibleAction.off)
      }

      if (triggersMemo.includes(TriggerActionEnum.CONTEXTMENU)) {
        triggerProps.onContextMenu = mockDefaultHandlers(
          props.onContextMenu,
          (evt: React.MouseEvent) => {
            evt.preventDefault()
            visibleAction.not()
          }
        )
      }

      return triggerProps
    },
    [triggersMemo, popoverId, visibleAction, visible, handlePopoverEnter, handlePopoverLeave]
  )

  const getPopperProps = React.useCallback(() => {
    const popperProps: PopperPortalProps = withDefaultProps(popper, {
      arrow: true,
      placement: 'top',
      zIndex: 1060,
      // @DesignToken 10
      gutterGap: 14,
    })

    return {
      ...popperProps,
      visible,
      attachEl: triggerEl,
      onClose: visibleAction.off,
    }
  }, [visible, popper, visibleAction, triggerEl])

  return { rootProps: rest, getOverlayProps, getTriggerProps, getPopperProps }
}

export interface UsePopoverProps {
  /**
   * 控制气泡卡片的显示和隐藏（受控）
   */
  visible?: boolean
  /**
   * 打开时回调
   */
  onOpen?: () => void
  /**
   * 关闭时回调
   */
  onClose?: () => void
  /**
   * 	气泡卡片触发方式
   */
  trigger?: TriggerActionEnum[] | TriggerActionEnum
  /**
   * popper 透传的 props
   */
  popper?: PopperPortalProps
}

export type UsePopoverReturn = ReturnType<typeof usePopover>
