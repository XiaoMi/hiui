import React, { useRef, useMemo, useCallback } from 'react'
import { TriggerActionEnum } from './types'
import { normalizeTrigger } from './utils'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useTimeout } from '@hi-ui/use-timeout'
import { useUnmountEffect } from '@hi-ui/use-unmount-effect'
import { PopperPortalProps } from '@hi-ui/popper'
import { getPrefixStyleVar } from '@hi-ui/classname'
import { mergeRefs } from '@hi-ui/react-utils'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { isNumeric } from '@hi-ui/type-assertion'

const NOOP_ARRAY = [] as []

export const useDropdown = (props: UseDropdownProps) => {
  const {
    trigger: triggerProp = TriggerActionEnum.HOVER,
    disabled = false,
    parents = NOOP_ARRAY,
    width,
    popper,
    ...rest
  } = props

  const triggerElementRef = useRef<HTMLElement>(null)
  const popperElementRef = useRef<HTMLElement>(null)

  /**
   * 抹平数组或字符串结构，同时 memo 处理，减少重渲染
   */
  const trigger = normalizeTrigger(triggerProp)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggerMethods = useMemo(() => trigger, trigger)

  const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
    defaultVisible: false,
    disabled,
  })

  /**
   * 维护 trigger 元素 或 tooltip 弹出层元素的 hover 态
   */
  const hoveringRef = useRef<boolean>(false)

  const { start: startOpenTimer, clear: clearOpenTimer } = useTimeout(() => {
    if (disabled) return
    menuVisibleAction.on()
  }, 0)

  const { start: startCloseTimer, clear: clearCloseTimer } = useTimeout(() => {
    if (disabled) return
    if (hoveringRef.current) return

    menuVisibleAction.off()
  }, 100)

  const clearToggleTimer = useCallback(() => {
    clearOpenTimer()
    clearCloseTimer()
  }, [clearOpenTimer, clearCloseTimer])

  useUnmountEffect(clearToggleTimer)

  const handlePopperLeave = useLatestCallback((evt) => {
    hoveringRef.current = false
    // if (triggerElementRef.current?.contains(evt.target as HTMLElement)) return

    clearOpenTimer()
    startCloseTimer()
  })

  const handlePopperEnter = useLatestCallback(() => {
    if (disabled) return

    hoveringRef.current = true

    startOpenTimer()
  })

  const getTriggerProps = useCallback(
    (props = {}, ref = null) => {
      const triggerProps = {
        ref: mergeRefs(triggerElementRef, ref),
        disabled,
      }

      /**
       * 事件收集
       * 'click' | 'contextmenu' | 'hover'
       */
      triggerMethods.reduce((acc, cur) => {
        switch (cur) {
          case TriggerActionEnum.HOVER:
            acc.onMouseEnter = mockDefaultHandlers(props.onMouseEnter, handlePopperEnter)
            acc.onMouseLeave = mockDefaultHandlers(props.onMouseLeave, handlePopperLeave)
            break
          case TriggerActionEnum.CONTEXTMENU:
            acc.onContextMenu = mockDefaultHandlers(
              props.onContextMenu,
              (evt: React.MouseEvent) => {
                evt.preventDefault()
                menuVisibleAction.not()
              }
            )
            break
          case TriggerActionEnum.CLICK:
            acc.onClick = mockDefaultHandlers(props.onClick, menuVisibleAction.not)
            break
        }

        return acc
      }, triggerProps as any)

      return triggerProps
    },
    [disabled, triggerMethods, menuVisibleAction, handlePopperEnter, handlePopperLeave]
  )

  const rootProps = rest

  const getMenuProps = useLatestCallback((props = {}, ref = null) => {
    const menuParents = parents.concat(triggerElementRef)

    const menuProps = {
      ...props,
      ref: mergeRefs(popperElementRef, ref),
      parents: menuParents,
      style: {
        ...props.style,
        [getPrefixStyleVar('dropdown-menu-width')]: isNumeric(width) ? width + 'px' : width,
      },
      popper: {
        ...popper,
        ...props.popper,
        closeOnOutsideClick: true,
        visible: menuVisible,
        attachEl: triggerElementRef.current,
        onClose: menuVisibleAction.off,
        // containedElementRefs: menuParents,
      },
    }

    if (triggerMethods.includes(TriggerActionEnum.HOVER)) {
      // @ts-ignore
      menuProps.onMouseEnter = () => {
        hoveringRef.current = true
      }

      // @ts-ignore
      menuProps.onMouseLeave = handlePopperLeave
    }

    return menuProps
  })

  return {
    width,
    rootProps,
    disabled,
    menuVisible,
    menuVisibleAction,
    triggerElementRef,
    triggerMethods,
    getTriggerProps,
    getMenuProps,
  }
}

export interface UseDropdownProps {
  /**
   * 下拉菜单触发方式
   */
  trigger?: TriggerActionEnum | TriggerActionEnum[]
  /**
   * 是否禁用下拉菜单
   */
  disabled?: boolean
  /**
   * 菜单项宽度
   */
  width?: number
  /**
   * 祖先吸附节点
   * @private
   */
  parents?: any[]
  /**
   * 自定义控制 下拉 popper 行为
   */
  popper?: Omit<PopperPortalProps, 'visible' | 'attachEl'>
}

export type UseDropdownReturn = ReturnType<typeof useDropdown>
