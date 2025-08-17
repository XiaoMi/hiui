import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { MenuDataItem } from './types'
import Scrollbar from '@hi-ui/scrollbar'

const _role = 'group-menu'
const GROUP_MENU_PREFIX = getPrefixCls(_role)

/**
 * 分组菜单
 */
export const GroupMenu = forwardRef<HTMLDivElement | null, GroupMenuProps>(
  (
    {
      prefixCls = GROUP_MENU_PREFIX,
      role = _role,
      className,
      data = [],
      onClick,
      defaultActiveId = '',
      activeId: activeIdProp,
      ...rest
    },
    ref
  ) => {
    const [activeId, tryChangeActiveId] = useUncontrolledState<React.ReactText>(
      defaultActiveId,
      activeIdProp
    )

    const handleClick = useLatestCallback(
      (evt: React.MouseEvent<HTMLDivElement>, id: React.ReactText, item: MenuDataItem) => {
        tryChangeActiveId(id)
        onClick?.(evt, id, item)
      }
    )

    const renderItem = useCallback(
      (data: MenuDataItem[]) => {
        return data.map((item) => {
          const { id, icon, title, children = [], disabled } = item
          const isParent = isArrayNonEmpty(children)

          return (
            <div
              key={id}
              className={cx(`${prefixCls}-item`, {
                [`${prefixCls}-item--parent`]: isParent,
                [`${prefixCls}-item--active`]: activeId === id,
                [`${prefixCls}-item--disabled`]: disabled,
              })}
              onClick={(evt) => {
                if (disabled) return
                evt.stopPropagation()
                handleClick(evt, id, item)
              }}
            >
              <div className={cx(`${prefixCls}-item__content`)}>
                <div className={cx(`${prefixCls}-item__icon`)}>{icon}</div>
                <div className={cx(`${prefixCls}-item__title`)}>{title}</div>
              </div>
              {isParent && renderItem(children)}
            </div>
          )
        })
      },
      [activeId, handleClick, prefixCls]
    )

    return (
      <div className={cx(`${prefixCls}`, className)} ref={ref} role={role} {...rest}>
        <Scrollbar onlyScrollVisible axes="y">
          {renderItem(data)}
        </Scrollbar>
      </div>
    )
  }
)

export interface GroupMenuProps extends Omit<HiBaseHTMLProps<'div'>, 'onClick'> {
  /**
   * 菜单项数据列表
   */
  data: MenuDataItem[]
  /**
   * 默认激活的菜单项 id
   */
  defaultActiveId?: React.ReactText
  /**
   * 激活的菜单项 id
   */
  activeId?: React.ReactText
  /**
   * 点击菜单选项时的回调
   */
  onClick?: (
    evt: React.MouseEvent<HTMLDivElement>,
    menuId: React.ReactText,
    menuItem: MenuDataItem
  ) => void
}

if (__DEV__) {
  GroupMenu.displayName = 'GroupMenu'
}
