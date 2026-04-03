import React, { useCallback, useEffect, useRef } from 'react'
import { PopoverTriggerActionEnum } from './types'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { omitPopperOverlayProps, PopperJS, PopperOverlayProps } from '@hi-ui/popper'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { mergeRefs, withDefaultProps } from '@hi-ui/react-utils'
import { useUID } from '@hi-ui/use-id'
import { useUnmountEffect } from '@hi-ui/use-unmount-effect'
import { normalizeArray } from '@hi-ui/array-utils'
import { useTimeout } from '@hi-ui/use-timeout'
import { useLatestCallback } from '@hi-ui/use-latest'

// TODO: 和 Tooltip 复用
export const usePopover = ({
  visible: visibleProp,
  onOpen,
  onClose,
  trigger: triggerProp = 'click',
  mouseEnterDelay = 100,
  mouseLeaveDelay = 100,
  attachEl,
  popperClassName,
  ...restProps
}: UsePopoverProps) => {
  // TODO: 移除 popper，使用 hook 重写
  const [popper, rest] = omitPopperOverlayProps(restProps) as any

  /** 为 true 表示本次打开/关闭已由 visibleAction / useUncontrolledToggle 路径触发过回调，避免与 prop 同步 effect 重复调用 */
  const openFromActionRef = useRef(false)
  const closeFromActionRef = useRef(false)
  const onOpenLatest = useLatestCallback(onOpen)
  const onCloseLatest = useLatestCallback(onClose)

  const [visible, visibleAction] = useUncontrolledToggle({
    defaultVisible: false,
    visible: visibleProp,
    onOpen: () => {
      openFromActionRef.current = true
      onOpenLatest()
    },
    onClose: () => {
      clearToggleTimer()
      closeFromActionRef.current = true
      onCloseLatest()
    },
  })

  const { start: startOpenTimer, clear: clearOpenTimer } = useTimeout(() => {
    visibleAction.on()
  }, mouseEnterDelay)

  const { start: startCloseTimer, clear: clearCloseTimer } = useTimeout(() => {
    if (hoveringRef.current) return
    visibleAction.off()
  }, mouseLeaveDelay)

  const clearToggleTimer = useCallback(() => {
    clearOpenTimer()
    clearCloseTimer()
  }, [clearOpenTimer, clearCloseTimer])

  /** null 表示尚未跑过同步 effect，用于首屏 visible===true 时仍能触发 onOpen */
  const prevVisibleRef = useRef<boolean | null>(null)

  /** 非受控时 visible 只可能由 visibleAction 更新，onOpen/onClose 已由 useUncontrolledToggle 触发；此处仅补受控下「只改 prop」的同步 */
  const isControlled = visibleProp !== undefined

  useEffect(() => {
    const prev = prevVisibleRef.current
    if (prev !== true && visible === true) {
      if (openFromActionRef.current) {
        openFromActionRef.current = false
      } else if (isControlled) {
        onOpenLatest()
      }
    }
    if (prev === true && visible === false) {
      if (closeFromActionRef.current) {
        closeFromActionRef.current = false
      } else if (isControlled) {
        clearToggleTimer()
        onCloseLatest()
      }
    }
    prevVisibleRef.current = visible
  }, [visible, isControlled, clearToggleTimer, onOpenLatest, onCloseLatest])

  useUnmountEffect(clearToggleTimer)

  const [triggerEl, setTriggerEl] = React.useState<HTMLElement | null>(null)

  const hoveringRef = React.useRef<boolean>(false)

  const trigger = normalizeArray(triggerProp)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggersMemo = React.useMemo(() => trigger, trigger)

  const popoverId = useUID('popover')

  const handlePopoverLeave = useLatestCallback(() => {
    hoveringRef.current = false
    clearOpenTimer()
    startCloseTimer()
  })

  const handlePopoverEnter = useLatestCallback(() => {
    hoveringRef.current = true

    startOpenTimer()
  })

  const getOverlayProps = React.useCallback(
    (props = {}, ref = null) => {
      const popoverProps = {
        ...props,
        ref,
        role: 'dialog',
        id: popoverId,
      }

      if (triggersMemo.includes(PopoverTriggerActionEnum.HOVER)) {
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

      if (triggersMemo.includes(PopoverTriggerActionEnum.CLICK)) {
        triggerProps.onClick = mockDefaultHandlers(props.onClick, visibleAction.not)
      }

      if (triggersMemo.includes(PopoverTriggerActionEnum.HOVER)) {
        // @ref https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html
        triggerProps.onFocus = mockDefaultHandlers(props.onFocus, visibleAction.on)
        triggerProps.onBlur = mockDefaultHandlers(props.onBlur, visibleAction.off)

        triggerProps.onMouseEnter = mockDefaultHandlers(props.onMouseEnter, handlePopoverEnter)
        triggerProps.onMouseLeave = mockDefaultHandlers(props.onMouseLeave, handlePopoverLeave)
      } else if (triggersMemo.includes(PopoverTriggerActionEnum.FOCUS)) {
        triggerProps.onFocus = mockDefaultHandlers(props.onFocus, visibleAction.on)
        triggerProps.onBlur = mockDefaultHandlers(props.onBlur, visibleAction.off)
      }

      if (triggersMemo.includes(PopoverTriggerActionEnum.CONTEXTMENU)) {
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
    const popperProps = withDefaultProps(popper, {
      arrow: true,
      placement: 'top',
      // @DesignToken zIndex: `popper`
      zIndex: 1030,
      // @DesignToken 10
      gutterGap: 10,
    })

    return {
      ...popperProps,
      visible,
      attachEl: attachEl ?? triggerEl,
      onClose: visibleAction.off,
      className: popperClassName,
    }
  }, [popper, visible, attachEl, triggerEl, visibleAction.off, popperClassName])

  return { rootProps: rest, getOverlayProps, getTriggerProps, getPopperProps, visibleAction }
}

export interface UsePopoverProps extends PopperOverlayProps {
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
  trigger?: PopoverTriggerActionEnum[] | PopoverTriggerActionEnum
  /**
   * 鼠标移入展示延时，单位：毫秒
   */
  mouseEnterDelay?: number
  /**
   * 鼠标移出后隐藏延时，单位：毫秒
   */
  mouseLeaveDelay?: number
  /**
   * 设置基于 reference 元素的间隙偏移量
   */
  gutterGap?: number
  /**
   * 吸附的元素
   */
  attachEl?: HTMLElement
  /**
   * 自定义 popper.js 的装饰器
   */
  modifiers?: ReadonlyArray<Partial<PopperJS.Modifier<string, any>>>
  /**
   * 自定义 Popper 的 className
   */
  popperClassName?: string
}

export type UsePopoverReturn = ReturnType<typeof usePopover>
