import { useRef, useCallback, useState, useMemo } from 'react'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import {
  usePopper,
  UsePopperProps,
  omitPopperOverlayProps,
  PopperOverlayProps,
} from '@hi-ui/popper'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { mergeRefs, withDefaultProps } from '@hi-ui/react-utils'
import { useUID } from '@hi-ui/use-id'
import { useUnmountEffect } from '@hi-ui/use-unmount-effect'
import { normalizeArray } from '@hi-ui/array-utils'
import { TooltipTriggerActionEnum } from './types'
import { useTimeout } from '@hi-ui/use-timeout'
import { useLatestCallback } from '@hi-ui/use-latest'

export const useTooltip = ({
  visible: visibleProp,
  onOpen,
  onClose,
  trigger: triggerProp = 'hover',
  disabled = false,
  mouseEnterDelay = 100,
  mouseLeaveDelay = 100,
  ...restProps
}: UseTooltipProps) => {
  const [popper, rest] = omitPopperOverlayProps(restProps) as any

  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null)

  /**
   * 抹平数组或字符串结构，同时 memo 处理，减少重渲染
   */
  const trigger = normalizeArray(triggerProp)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggersMemo = useMemo(() => trigger, trigger)

  /**
   * 维护 trigger 元素 或 tooltip 弹出层元素的 hover 态
   */
  const hoveringRef = useRef<boolean>(false)

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

  useUnmountEffect(clearToggleTimer)

  const [visible, visibleAction] = useUncontrolledToggle({
    defaultVisible: false,
    visible: visibleProp,
    disabled,
    onOpen,
    onClose: () => {
      clearToggleTimer()
      onClose?.()
    },
  })

  const handlePopperLeave = useLatestCallback(() => {
    hoveringRef.current = false

    clearOpenTimer()
    startCloseTimer()
  })

  const handlePopperEnter = useLatestCallback(() => {
    if (disabled) return

    hoveringRef.current = true

    startOpenTimer()
  })

  const usePopperProps: UsePopperProps = useMemo(() => {
    const popperProps = withDefaultProps(popper, {
      placement: 'top',
      // @DesignToken zIndex: tooltip
      zIndex: 1060,
      // @DesignToken
      gutterGap: 14,
    })

    return {
      ...popperProps,
      visible,
      attachEl: triggerElement,
      onClose: visibleAction.off,
    }
  }, [visible, popper, visibleAction, triggerElement])

  const { shouldRenderPopper, getArrowProps, getPopperProps, update: updatePopper } = usePopper(
    usePopperProps
  )

  const tooltipId = useUID('popover')

  const getTooltipProps = useCallback(
    (props = {}, ref = null) => {
      const popoverProps = {
        ...props,
        ref,
        role: 'tooltip',
        id: tooltipId,
        ...rest,
      }

      if (triggersMemo.includes(TooltipTriggerActionEnum.HOVER)) {
        popoverProps.onMouseEnter = mockDefaultHandlers(props.onMouseEnter, () => {
          hoveringRef.current = true
        })

        popoverProps.onMouseLeave = mockDefaultHandlers(props.onMouseLeave, handlePopperLeave)
      }

      return popoverProps
    },
    [triggersMemo, tooltipId, handlePopperLeave, rest]
  )

  const getTriggerProps = useCallback(
    (props = {}, ref = null) => {
      const triggerProps = {
        ...props,
        ref: mergeRefs(setTriggerElement, ref),
        'aria-describedby': tooltipId,
        'aria-expanded': visible,
      }

      if (triggersMemo.includes(TooltipTriggerActionEnum.CLICK)) {
        triggerProps.onClick = mockDefaultHandlers(props.onClick, visibleAction.not)
      }

      if (triggersMemo.includes(TooltipTriggerActionEnum.HOVER)) {
        // @ref https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html
        triggerProps.onFocus = mockDefaultHandlers(props.onFocus, visibleAction.on)
        triggerProps.onBlur = mockDefaultHandlers(props.onBlur, visibleAction.off)

        triggerProps.onMouseEnter = mockDefaultHandlers(props.onMouseEnter, handlePopperEnter)
        triggerProps.onMouseLeave = mockDefaultHandlers(props.onMouseLeave, handlePopperLeave)
      } else if (triggersMemo.includes(TooltipTriggerActionEnum.FOCUS)) {
        triggerProps.onFocus = mockDefaultHandlers(props.onFocus, visibleAction.on)
        triggerProps.onBlur = mockDefaultHandlers(props.onBlur, visibleAction.off)
      }

      if (triggersMemo.includes(TooltipTriggerActionEnum.CONTEXTMENU)) {
        triggerProps.onContextMenu = mockDefaultHandlers(props.onContextMenu, (evt: MouseEvent) => {
          // 阻止呼出默认浏览器菜单
          evt.preventDefault()
          visibleAction.not()
        })
      }

      return triggerProps
    },
    [triggersMemo, tooltipId, visibleAction, visible, handlePopperEnter, handlePopperLeave]
  )

  return {
    visible,
    visibleAction,
    triggerElement,
    setTriggerElement,
    getTooltipProps,
    getTriggerProps,
    getPopperProps,
    getArrowProps,
    updatePopper,
    shouldRenderPopper,
  }
}

export interface UseTooltipProps extends PopperOverlayProps {
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
  trigger?: TooltipTriggerActionEnum[] | TooltipTriggerActionEnum
  /**
   * 开启禁用
   */
  disabled?: boolean
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
}

export type UseTooltipReturn = ReturnType<typeof useTooltip>
