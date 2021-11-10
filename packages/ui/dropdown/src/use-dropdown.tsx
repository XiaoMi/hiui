import React, { useRef, useState, useMemo, useCallback } from 'react'
import { TriggerActionEnum } from './types'
import { normalizeTrigger } from './utils'
import { useToggle } from '@hi-ui/use-toggle'

const NOOP_ARRAY = [] as []

export const useDropdown = (props: UseDropdownProps) => {
  const { data = NOOP_ARRAY, trigger = TriggerActionEnum.HOVER, ...rest } = props

  const dropdownRef = useRef<HTMLElement>(null)

  const [menuVisible, menuVisibleAction] = useToggle()
  const [activeMenuIds, setActiveMenuIds] = useState([])

  const triggerMethods = useMemo(() => normalizeTrigger(trigger), [trigger])
  const handleMouseLeave = useCallback(
    (evt: MouseEvent) => {
      console.log(evt)
      if (dropdownRef.current?.contains(evt.target as HTMLElement)) return
      menuVisibleAction.off()
    },
    [menuVisibleAction]
  )

  // 事件收集
  // 'click' | 'contextmenu' | 'hover'
  const eventHandler = useMemo(() => {
    return triggerMethods.reduce((acc, cur) => {
      switch (cur) {
        // TODO: 处理冒泡，模拟冒泡阻止事件触发
        case TriggerActionEnum.HOVER:
          acc.onMouseEnter = menuVisibleAction.on
          acc.onMouseLeave = handleMouseLeave
          break
        case TriggerActionEnum.CONTEXTMENU:
          acc.onContextMenu = menuVisibleAction.not
          break
        case TriggerActionEnum.CLICK:
          acc.onClick = menuVisibleAction.not
          break
      }

      return acc
    }, {} as any)
  }, [triggerMethods, menuVisibleAction, handleMouseLeave])

  const getTriggerProps = useCallback(() => {
    return {
      onContextMenu: eventHandler.onContextMenu,
      onClick: eventHandler.onClick,
      ref: dropdownRef,
    }
  }, [eventHandler])

  const getRootProps = useCallback(() => {
    return {
      ...rest,
      onMouseEnter: eventHandler.onMouseEnter,
      onMouseLeave: eventHandler.onMouseLeave,
    }
  }, [rest, eventHandler])

  return {
    dropdownRef,
    visible: menuVisible,
    triggerMethods,
    getTriggerProps,
    getRootProps,
    data,
    menuVisibleAction,
  }
}

export interface UseDropdownProps {
  /**
   * 下拉菜单数据项
   */
  data?: DropdownDataItem[]
  /**
   * 下拉菜单按钮类型
   */
  type?: 'text' | 'button' | 'group'
  /**
   * 下拉菜单触发方式
   */
  trigger?: TriggerActionEnum | TriggerActionEnum[]
  /**
   * 下拉菜单触发元素
   */
  triggerButton?: React.ReactNode
  /**
   * 是否禁用下拉菜单
   */
  disabled?: boolean
  /**
   * 菜单项宽度
   */
  width?: number
  /**
   * 下拉根元素的类名称
   */
  overlayClassName?: string
  /**
   * 点击左侧按钮的回调
   */
  onButtonClick?: (evt: Event) => void
}

export type UseDropdownReturn = ReturnType<typeof useDropdown>

export type DropdownDataItem = {
  /**
   * 标题的内容，设置为 '-' 时是分割线
   */
  title?: React.ReactNode
  /**
   * 唯一标识 id
   */
  id?: React.ReactText
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 点击跳转的路径
   */
  href?: string
  /**
   * 同 a 标签的 target 属性，仅在设置 href 后有效
   */
  target?: '_self' | '_blank' | '_parent' | '_top'
}
