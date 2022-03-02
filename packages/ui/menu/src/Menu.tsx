import React, { forwardRef, useCallback, useState, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@hi-ui/icons'
import { __DEV__ } from '@hi-ui/env'
import { MenuItem } from './MenuItem'
import MenuContext from './context'
import { getAncestorIds } from './util'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { MenuDataItem } from './types'
import Tooltip from '@hi-ui/tooltip'

const MENU_PREFIX = getPrefixCls('menu')

/**
 * TODO: What is Menu
 */
export const Menu = forwardRef<HTMLDivElement | null, MenuProps>(
  (
    {
      prefixCls = MENU_PREFIX,
      role = 'menu',
      className,
      data,
      placement = 'vertical',
      showCollapse,
      // 仅对垂直模式有效
      expandedType = 'collapse',
      showAllSubMenus = false,
      defaultExpandedIds,
      defaultActiveId,
      activeId,
      onClickSubMenu,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [_activeId, updateActiveId] = useUncontrolledState(
      defaultActiveId || '',
      activeId,
      onClick
    )

    const [activeParents, updateActiveParents] = useState(getAncestorIds(_activeId, data))
    useEffect(() => {
      updateActiveParents(getAncestorIds(_activeId, data))
    }, [_activeId, data])
    const [_expandedIds, updateExpanedIds] = useState(defaultExpandedIds || [])

    const clickMenu = useCallback(
      (id: React.ReactText) => {
        updateActiveId(id)
      },
      [updateActiveId]
    )
    const clickSubMenu = useCallback(
      (id: React.ReactText) => {
        const expandedIds = _expandedIds.includes(id)
          ? _expandedIds.filter((expandedId) => expandedId !== id)
          : _expandedIds.concat(id)
        updateExpanedIds(expandedIds)
        if (onClickSubMenu) {
          onClickSubMenu(id, expandedIds)
        }
      },
      [onClickSubMenu, _expandedIds]
    )

    const closePopper = useCallback(
      (id: React.ReactText) => {
        updateExpanedIds(_expandedIds.filter((expandedId) => expandedId !== id))
      },
      [_expandedIds]
    )

    const closeAllPopper = useCallback(() => {
      updateExpanedIds([])
    }, [])

    const [mini, setMini] = useState(false)
    const cls = cx(prefixCls, className, `${prefixCls}--${placement}`, {
      [`${prefixCls}--mini`]: mini,
      [`${prefixCls}--popup`]: expandedType === 'pop' || showAllSubMenus || mini,
    })

    const onToggle = useCallback(() => {
      setMini(!mini)
      closeAllPopper()
    }, [mini, closeAllPopper])

    const canToggle = placement === 'vertical' && showCollapse

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <MenuContext.Provider
          value={{
            placement,
            expandedType,
            showAllSubMenus,
            mini,
            clickMenu,
            clickSubMenu,
            closePopper,
            closeAllPopper,
            activeParents,
            activeId: _activeId,
            expandedIds: _expandedIds,
          }}
        >
          <ul className={cx(`${prefixCls}__wrapper`)}>
            {data.map((item) => {
              return canToggle && mini ? (
                <Tooltip title={item.title} key={item.id} placement="right">
                  <MenuItem {...item} level={1} />
                </Tooltip>
              ) : (
                <MenuItem {...item} key={item.id} level={1} />
              )
            })}
          </ul>
          {canToggle ? (
            <div className={cx(`${prefixCls}__toggle`)} onClick={onToggle}>
              {mini ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          ) : null}
        </MenuContext.Provider>
      </div>
    )
  }
)

export interface MenuProps extends Omit<HiBaseHTMLProps<'div'>, 'onClick'> {
  data: MenuDataItem[]
  activeId?: React.ReactText
  placement?: 'horizontal' | 'vertical'
  collapsed?: boolean
  showCollapse?: boolean
  showAllSubMenus?: boolean
  accordion?: boolean
  onClick?: (menuId: React.ReactText) => void
  onClickSubMenu?: (subMenuId: React.ReactText, expandedIds: React.ReactText[]) => void
  onCollapse?: (collapsed: boolean) => void
  overlayClassName?: string
  expandedType?: 'collapse' | 'pop'
  defaultExpandedIds?: React.ReactText[]
  defaultActiveId?: React.ReactText
}

if (__DEV__) {
  Menu.displayName = 'Menu'
}
