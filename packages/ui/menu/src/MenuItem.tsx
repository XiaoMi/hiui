import React, { useRef, useContext, forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { DownOutlined, UpOutlined, RightOutlined } from '@hi-ui/icons'
import Popper from '@hi-ui/popper'
import { isArrayNonEmpty, isFunction } from '@hi-ui/type-assertion'
import { times } from '@hi-ui/array-utils'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
import { MenuDataItem } from './types'
import MenuContext from './context'
import { Expander } from './Expander'

const MENU_PREFIX = getPrefixCls('menu')

const hiddenStyle: React.CSSProperties = {
  position: 'absolute',
  opacity: 0,
  order: 9999,
  visibility: 'hidden',
}

export const MenuItem = forwardRef<HTMLLIElement | null, MenuItemProps>(
  (
    {
      prefixCls = MENU_PREFIX,
      className,
      icon,
      title,
      disabled,
      id,
      level = 1,
      children,
      parentIds,
      hidden = false,
      render,
      raw,
      size = 'lg',
    },
    ref
  ) => {
    const itemRef = useRef<HTMLLIElement | null>(null)
    const {
      placement,
      expandedType,
      showAllSubMenus,
      mini,
      activeId,
      closePopper,
      expandedIds,
      clickMenu,
      clickSubMenu,
      closeAllPopper,
      activeParents,
      overlayClassName,
      showTitleOnMini,
    } = useContext(MenuContext)

    const _parentIds = (parentIds || []).concat(id)

    const hasChildren = isArrayNonEmpty(children)

    const mergedRef = useMergeRefs(itemRef, ref)

    return (
      <>
        <li
          ref={mergedRef}
          className={cx(
            `${prefixCls}-item`,
            {
              [`${prefixCls}-item__inner--mini`]: mini,
              [`${prefixCls}-item--disabled`]: disabled,
              [`${prefixCls}-item--active`]:
                placement === 'horizontal' &&
                (activeId === id || activeParents?.includes(id)) &&
                level === 1,
            },
            className
          )}
          style={hidden ? hiddenStyle : undefined}
        >
          <div
            className={cx(`${prefixCls}-item__inner`, {
              // TODO: 移到 上面的 item 统一管理
              [`${prefixCls}-item__inner--active`]: activeId === id,
              [`${prefixCls}-item__inner--active-p`]: activeParents?.includes(id),
              [`${prefixCls}-item__inner--expanded`]: expandedIds?.includes(id),
              [`${prefixCls}-item__inner--hasIcon`]: icon,
            })}
            onClick={() => {
              if (isArrayNonEmpty(children)) {
                !disabled && clickSubMenu?.(id)
              } else {
                !disabled && clickMenu?.(id, raw as MenuDataItem)
                if (
                  closeAllPopper &&
                  !(placement === 'vertical' && expandedType === 'collapse' && mini === false)
                ) {
                  closeAllPopper()
                }
              }
            }}
          >
            {placement === 'vertical' && expandedType === 'collapse' && !mini
              ? renderIndent({ prefixCls: `${prefixCls}-item`, depth: level - 1 })
              : null}

            {icon ? <span className={`${prefixCls}-item__icon`}>{icon}</span> : null}
            <span className={`${prefixCls}-item__content`}>
              {isFunction(render) ? render({ ...raw, id, icon, title }, level) : title}
            </span>
            {/* 垂直菜单-纵向展开 */}
            {hasChildren &&
              !mini &&
              placement === 'vertical' &&
              expandedType === 'collapse' &&
              !showAllSubMenus &&
              (!disabled && expandedIds?.includes(id) ? (
                <Arrow prefixCls={`${prefixCls}-item`} direction="up" />
              ) : (
                <Arrow prefixCls={`${prefixCls}-item`} direction="down" />
              ))}
            {/* 垂直菜单-mini */}
            {hasChildren && mini && level > 1 && placement === 'vertical' ? (
              <Arrow prefixCls={`${prefixCls}-item`} />
            ) : null}
            {/* 垂直菜单-弹出展开 */}
            {hasChildren &&
            !mini &&
            placement === 'vertical' &&
            (expandedType === 'pop' || showAllSubMenus) ? (
              <Arrow prefixCls={`${prefixCls}-item`} />
            ) : null}
            {/* 水平菜单 */}
            {hasChildren && placement === 'horizontal' && level > 1 ? (
              <Arrow prefixCls={`${prefixCls}-item`} />
            ) : null}
            {hasChildren &&
              placement === 'horizontal' &&
              level === 1 &&
              (!disabled && expandedIds?.includes(id) ? (
                <Arrow prefixCls={`${prefixCls}-item`} direction="up" />
              ) : (
                <Arrow prefixCls={`${prefixCls}-item`} direction="down" />
              ))}
          </div>
          {/* 垂直菜单-纵向展开 */}
          {hasChildren &&
          placement === 'vertical' &&
          !mini &&
          !showAllSubMenus &&
          expandedType === 'collapse' ? (
            <Expander visible={!disabled && !!expandedIds?.includes(id)}>
              <ul className={`${prefixCls}-submenu`}>
                {children!.map((child) => (
                  <MenuItem
                    {...child}
                    key={child.id}
                    level={level + 1}
                    parentIds={_parentIds}
                    raw={child}
                    render={render}
                    size={size}
                  />
                ))}
              </ul>
            </Expander>
          ) : null}
        </li>
        {/* 注意：popper 写在 li 标签外，阻止 createPortal 事件冒泡 */}
        {/* 垂直菜单-纵向展开-mini */}
        {hasChildren &&
          placement === 'vertical' &&
          mini &&
          !showAllSubMenus &&
          expandedType === 'collapse' &&
          (level === 1 ? (
            <Popper
              visible={!!expandedIds?.includes(id)}
              attachEl={itemRef.current}
              placement={'right-start'}
              gutterGap={showTitleOnMini ? 8 : 16}
              className={overlayClassName}
              onClose={() => {
                closePopper?.(id)
              }}
            >
              <ul className={`${prefixCls}-popmenu ${prefixCls}--size-${size}`}>
                {children!.map((child) => {
                  return (
                    <MenuItem
                      {...child}
                      key={child.id}
                      level={level + 1}
                      parentIds={_parentIds}
                      raw={child}
                      render={render}
                      size={size}
                    />
                  )
                })}
              </ul>
            </Popper>
          ) : (
            <Popper
              visible={!!expandedIds?.includes(id)}
              attachEl={itemRef.current}
              placement={'right-start'}
              gutterGap={showTitleOnMini ? 12 : 16}
              disabledPortal
              className={overlayClassName}
              onClose={() => {
                closePopper?.(id)
              }}
            >
              <ul className={`${prefixCls}-popmenu ${prefixCls}--size-${size}`}>
                {children!.map((child) => (
                  <MenuItem
                    {...child}
                    key={child.id}
                    level={level + 1}
                    parentIds={_parentIds}
                    raw={child}
                    render={render}
                    size={size}
                  />
                ))}
              </ul>
            </Popper>
          ))}
        {/* 垂直菜单-弹出展开 */}
        {hasChildren &&
          placement === 'vertical' &&
          !showAllSubMenus &&
          expandedType === 'pop' &&
          (level === 1 ? (
            <Popper
              visible={!!expandedIds?.includes(id)}
              attachEl={itemRef.current}
              placement={'right-start'}
              gutterGap={16}
              className={overlayClassName}
              onClose={() => {
                closePopper?.(id)
              }}
            >
              <ul className={`${prefixCls}-popmenu ${prefixCls}--size-${size}`}>
                {children!.map((child) => (
                  <MenuItem
                    {...child}
                    key={child.id}
                    level={level + 1}
                    parentIds={_parentIds}
                    raw={child}
                    render={render}
                    size={size}
                  />
                ))}
              </ul>
            </Popper>
          ) : (
            <Popper
              visible={!!expandedIds?.includes(id)}
              attachEl={itemRef.current}
              disabledPortal
              placement={'right-start'}
              gutterGap={16}
              className={overlayClassName}
              onClose={() => {
                closePopper?.(id)
              }}
            >
              <ul className={`${prefixCls}-popmenu ${prefixCls}--size-${size}`}>
                {children!.map((child) => (
                  <MenuItem
                    {...child}
                    key={child.id}
                    level={level + 1}
                    parentIds={_parentIds}
                    raw={child}
                    render={render}
                    size={size}
                  />
                ))}
              </ul>
            </Popper>
          ))}
        {/* 垂直胖菜单 */}
        {hasChildren && placement === 'vertical' && showAllSubMenus ? (
          <Popper
            visible={!!expandedIds?.includes(id)}
            attachEl={itemRef.current}
            placement={'right-start'}
            gutterGap={16}
            className={overlayClassName}
            onClose={() => {
              closePopper?.(id)
            }}
          >
            <div className={`${prefixCls}-fat-menu`}>
              {children!.map((child) => {
                return (
                  <div key={child.id} className={`${prefixCls}-fat-menu__group`}>
                    <div className={`${prefixCls}-group-item`}>{child.title}</div>
                    {child && isArrayNonEmpty(child.children) ? (
                      <ul>
                        {child.children.map((item) => (
                          <div
                            onClick={() => {
                              if (!item.disabled) {
                                clickMenu?.(item.id, item)
                                closePopper?.(id)
                              }
                            }}
                            className={cx(`${prefixCls}-item`, {
                              [`${prefixCls}-item--active`]: activeId === item.id,
                              [`${prefixCls}-item--disabled`]: item.disabled,
                            })}
                            key={item.id}
                          >
                            {item.title}
                          </div>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </Popper>
        ) : null}
        {/* 水平菜单 */}
        {hasChildren &&
          placement === 'horizontal' &&
          !showAllSubMenus &&
          (level === 1 ? (
            <Popper
              visible={!!expandedIds?.includes(id)}
              attachEl={itemRef.current}
              placement={level === 1 ? 'bottom-start' : 'right-start'}
              gutterGap={level === 1 ? 8 : 16}
              className={overlayClassName}
              onClose={() => {
                closePopper?.(id)
              }}
            >
              <ul className={`${prefixCls}-popmenu ${prefixCls}--size-${size}`}>
                {children!.map((child) => (
                  <MenuItem
                    {...child}
                    key={child.id}
                    level={level + 1}
                    parentIds={_parentIds}
                    raw={child}
                    render={render}
                    size={size}
                  />
                ))}
              </ul>
            </Popper>
          ) : (
            <Popper
              visible={!!expandedIds?.includes(id)}
              attachEl={itemRef.current}
              disabledPortal
              placement={level === 1 ? 'bottom-start' : 'right-start'}
              gutterGap={level === 1 ? 8 : 16}
              className={overlayClassName}
              onClose={() => {
                closePopper?.(id)
              }}
            >
              <ul className={`${prefixCls}-popmenu ${prefixCls}--size-${size}`}>
                {children!.map((child) => (
                  <MenuItem
                    {...child}
                    key={child.id}
                    level={level + 1}
                    parentIds={_parentIds}
                    raw={child}
                    render={render}
                    size={size}
                  />
                ))}
              </ul>
            </Popper>
          ))}
        {/* 水平胖菜单 */}
        {hasChildren && placement === 'horizontal' && showAllSubMenus ? (
          <Popper
            visible={!!expandedIds?.includes(id)}
            attachEl={itemRef.current}
            placement={'bottom-start'}
            gutterGap={8}
            className={overlayClassName}
            onClose={() => {
              closePopper?.(id)
            }}
          >
            <div className={`${prefixCls}-fat-menu`}>
              {children!.map((child) => {
                return (
                  <div key={child.id} className={`${prefixCls}-fat-menu__group`}>
                    <div className={`${prefixCls}-group-item`}>{child.title}</div>
                    {child && isArrayNonEmpty(child.children) ? (
                      <ul>
                        {child.children.map((item) => (
                          <div
                            className={cx(`${prefixCls}-item`, {
                              [`${prefixCls}-item--active`]: activeId === item.id,
                              [`${prefixCls}-item--disabled`]: item.disabled,
                            })}
                            onClick={() => {
                              if (!item.disabled) {
                                clickMenu?.(item.id, item)
                                closePopper?.(id)
                              }
                            }}
                            key={item.id}
                          >
                            {item.title}
                          </div>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </Popper>
        ) : null}
      </>
    )
  }
)

export interface MenuItemProps extends Omit<HiBaseHTMLProps<'li'>, 'id'> {
  id: React.ReactText
  title: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  children?: MenuDataItem[]
  level?: number
  parentIds?: React.ReactText[]
  render?: (node: MenuDataItem, level?: number) => React.ReactNode
  raw?: MenuDataItem
  size?: Omit<HiBaseSizeEnum, 'xs'>
}

if (__DEV__) {
  MenuItem.displayName = 'MenuItem'
}

const Arrow = ({ prefixCls, direction }: any) => {
  let icon
  switch (direction) {
    case 'up':
      icon = <UpOutlined />
      break
    case 'down':
      icon = <DownOutlined />
      break
    default:
      icon = <RightOutlined />
  }

  return <span className={`${prefixCls}__arrow`}>{icon}</span>
}

/**
 * 渲染空白占位
 */
const renderIndent = ({ prefixCls, depth }: { prefixCls?: string; depth: number }) => {
  return times(depth, (index) => {
    return <span className={`${prefixCls}__indent`} key={index} />
  })
}
