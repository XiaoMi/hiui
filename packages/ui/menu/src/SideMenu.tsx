import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import Scrollbar from '@hi-ui/scrollbar'
import { MenuDataItem } from './types'
import { getAncestorIds } from './util'

const SIDE_MENU_PREFIX = getPrefixCls('side-menu')

/**
 * 侧边菜单组件
 */
export const SideMenu = forwardRef<HTMLDivElement | null, SideMenuProps>(
  (
    {
      prefixCls = SIDE_MENU_PREFIX,
      role = 'side-menu',
      className,
      defaultActiveId = null,
      activeId: activeIdProp,
      data = [],
      mini,
      childrenContainerRef,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, {
      [`${prefixCls}--mini`]: mini,
    })

    const [activeId, tryChangeActiveId] = useUncontrolledState<React.ReactText | null>(
      defaultActiveId,
      activeIdProp
    )

    const handleClick = useLatestCallback(
      (event: React.MouseEvent<HTMLDivElement>, id: React.ReactText, item: MenuDataItem) => {
        tryChangeActiveId(id)
        onClick?.(event, id, item)
      }
    )

    const handleMouseEnter = useLatestCallback(
      (event: React.MouseEvent<HTMLDivElement>, id: React.ReactText, item: MenuDataItem) => {
        event.stopPropagation()
        onMouseEnter?.(event, id, item)
      }
    )

    const handleMouseLeave = useLatestCallback(
      (event: React.MouseEvent<HTMLDivElement>, id: React.ReactText, item: MenuDataItem) => {
        event.stopPropagation()
        onMouseLeave?.(event, id, item)
      }
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <Scrollbar onlyScrollVisible axes="y">
          {data.map((item) => {
            const { id, title, icon } = item
            return (
              <div
                key={id}
                className={cx(`${prefixCls}-item-wrapper`)}
                onClick={(event) => handleClick(event, id, item)}
                onMouseEnter={(event) => handleMouseEnter(event, id, item)}
                onMouseLeave={(event) => handleMouseLeave(event, id, item)}
              >
                <div
                  className={cx(`${prefixCls}-item`, {
                    [`${prefixCls}-item--active`]: activeId === id,
                    [`${prefixCls}-item--mini`]: mini,
                  })}
                >
                  <div className={cx(`${prefixCls}-item__icon`)}>{icon}</div>
                  <div className={cx(`${prefixCls}-item__title`)}>
                    <EllipsisTooltip>{title as string}</EllipsisTooltip>
                  </div>
                </div>
              </div>
            )
          })}
        </Scrollbar>
      </div>
    )
  }
)

export interface SideMenuProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onClick' | 'onMouseEnter' | 'onMouseLeave'> {
  /**
   * 侧边菜单宽度
   */
  width?: number
  /**
   * 是否为迷你模式
   */
  mini?: boolean
  /**
   * 默认激活的菜单项
   */
  defaultActiveId?: React.ReactText | null
  /**
   * 激活的菜单项
   */
  activeId?: React.ReactText | null
  /**
   * 侧边菜单数据
   */
  data: MenuDataItem[]
  /**
   * 子菜单容器引用
   */
  childrenContainerRef?: React.RefObject<HTMLDivElement>
  /**
   * 点击侧边菜单项
   */
  onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    id: React.ReactText,
    item: MenuDataItem
  ) => void
  /**
   * 鼠标移入侧边菜单项
   */
  onMouseEnter?: (
    event: React.MouseEvent<HTMLDivElement>,
    id: React.ReactText,
    item: MenuDataItem
  ) => void
  /**
   * 鼠标移出侧边菜单项
   */
  onMouseLeave?: (
    event: React.MouseEvent<HTMLDivElement>,
    id: React.ReactText,
    item: MenuDataItem
  ) => void
}

if (__DEV__) {
  SideMenu.displayName = 'SideMenu'
}

export const useSideMenuCascade = ({
  data,
  selectId,
  activeId,
}: {
  data: MenuDataItem[]
  selectId: React.ReactText
  activeId: React.ReactText
}) => {
  const activeParents = React.useMemo(() => {
    return getAncestorIds(activeId, data)
  }, [activeId, data])

  const selectParents = React.useMemo(() => {
    return getAncestorIds(selectId, data)
  }, [selectId, data])

  const selectParentId = React.useMemo(() => {
    return selectParents[selectParents.length - 1] ?? selectId
  }, [selectId, selectParents])

  const activeParentId = React.useMemo(() => {
    return activeParents[activeParents.length - 1] ?? activeId
  }, [activeId, activeParents])

  const submenuData = React.useMemo(() => {
    const parentId = selectParentId || activeParentId
    return data.find((item) => item.id === parentId)?.children || []
  }, [selectParentId, activeParentId, data])

  return {
    submenuData,
    selectParentId,
    activeParentId,
  }
}
