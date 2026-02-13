import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
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
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      data = [],
      onClick,
      defaultActiveId = '',
      activeId: activeIdProp,
      titleRender,
      ...rest
    },
    ref
  ) => {
    const { groupMenu: groupMenuConfig } = useGlobalContext()
    const { classNames, styles } = useMergeSemantic<
      GroupMenuSemanticClassNames,
      GroupMenuSemanticStyles,
      GroupMenuProps
    >({
      classNamesList: [groupMenuConfig?.classNames, classNamesProp],
      stylesList: [groupMenuConfig?.styles, stylesProp],
      info: { props: { ...rest, data, defaultActiveId, activeId: activeIdProp, titleRender } },
    })
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
              className={cx(
                isParent ? `${prefixCls}-parent-item` : `${prefixCls}-item`,
                {
                  [`${prefixCls}-item--active`]: activeId === id,
                  [`${prefixCls}-item--disabled`]: disabled,
                  [`${prefixCls}-item--empty`]: !title && !icon,
                },
                classNames?.item
              )}
              style={styles?.item}
              onClick={(evt) => {
                if (disabled || isParent) return
                evt.stopPropagation()
                handleClick(evt, id, item)
              }}
            >
              <div
                className={cx(`${prefixCls}-item__content`, classNames?.itemContent)}
                style={styles?.itemContent}
              >
                <div
                  className={cx(`${prefixCls}-item__icon`, classNames?.itemIcon)}
                  style={styles?.itemIcon}
                >
                  {icon}
                </div>
                <div
                  className={cx(`${prefixCls}-item__title`, classNames?.itemTitle)}
                  style={styles?.itemTitle}
                >
                  {typeof titleRender === 'function' ? titleRender(item) : title}
                </div>
              </div>
              {isParent && renderItem(children)}
            </div>
          )
        })
      },
      [activeId, handleClick, prefixCls, titleRender, classNames, styles]
    )

    return (
      <div
        className={cx(prefixCls, className, classNames?.root)}
        style={{ ...style, ...styles?.root }}
        ref={ref}
        role={role}
        {...rest}
      >
        <Scrollbar
          onlyScrollVisible
          axes="y"
          className={classNames?.wrapper}
          style={styles?.wrapper}
        >
          {renderItem(data)}
        </Scrollbar>
      </div>
    )
  }
)

export type GroupMenuSemanticName =
  | 'root'
  | 'wrapper'
  | 'item'
  | 'itemContent'
  | 'itemIcon'
  | 'itemTitle'
export type GroupMenuSemanticClassNames = SemanticClassNamesType<
  GroupMenuProps,
  GroupMenuSemanticName
>
export type GroupMenuSemanticStyles = SemanticStylesType<GroupMenuProps, GroupMenuSemanticName>
export type GroupMenuSemantic = ComponentSemantic<
  GroupMenuSemanticClassNames,
  GroupMenuSemanticStyles
>
export interface GroupMenuProps extends Omit<HiBaseHTMLProps<'div'>, 'onClick'>, GroupMenuSemantic {
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
  /**
   * 自定义渲染菜单项标题
   */
  titleRender?: (menuItem: MenuDataItem) => React.ReactNode
}

if (__DEV__) {
  GroupMenu.displayName = 'GroupMenu'
}
