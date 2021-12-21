import React, { useRef, useContext } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { MenuItemProps } from './Menu'
import { __DEV__ } from '@hi-ui/env'
import { DownOutlined, UpOutlined, RightOutlined } from '@hi-ui/icons'
import MenuContext from './context'
import { PopperPortal } from '@hi-ui/popper'

const MENU_PREFIX = getPrefixCls('menu')

export const MenuItem: React.FC<MenuItemProps> = ({
  prefixCls = MENU_PREFIX,
  icon,
  content,
  disabled,
  id,
  level,
  children,
  parentIds,
}) => {
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
  } = useContext(MenuContext)

  const _parentIds = (parentIds || []).concat(id)

  return (
    <li
      ref={itemRef}
      className={cx(`${prefixCls}-item`, {
        [`${prefixCls}-item--disabled`]: disabled,
      })}
    >
      <div
        className={cx(`${prefixCls}-item__inner`, {
          [`${prefixCls}-item__inner--mini`]: mini,
          [`${prefixCls}-item__inner--active`]: activeId === id,
        })}
        onClick={() => {
          if (children?.length) {
            if (clickSubMenu) {
              clickSubMenu(id)
            }
          } else {
            if (clickMenu) {
              clickMenu(id)
            }
          }
        }}
        style={
          placement === 'vertical' && expandedType === 'default'
            ? {
                paddingLeft:
                  level > 1 ? 12 + (level - 1 > 0 ? 1 : 0) * 20 + (level - 2 || 0) * 16 : 12,
              }
            : {}
        }
      >
        {icon}
        <span className={`${prefixCls}-item__content`}>{content}</span>
        {/* 垂直菜单-纵向展开 */}
        {children?.length &&
          !mini &&
          placement === 'vertical' &&
          expandedType === 'default' &&
          !showAllSubMenus &&
          (expandedIds?.includes(id) ? <UpOutlined /> : <DownOutlined />)}
        {/* 垂直菜单-弹出展开 */}
        {children?.length &&
          !mini &&
          placement === 'vertical' &&
          (expandedType === 'pop' || showAllSubMenus) && <RightOutlined />}
        {/* 水平菜单 */}
        {children?.length && placement === 'horizontal' && level > 1 && <RightOutlined />}
        {children?.length &&
          placement === 'horizontal' &&
          level === 1 &&
          (expandedIds?.includes(id) ? <UpOutlined /> : <DownOutlined />)}
      </div>
      {/* 垂直菜单-纵向展开 */}
      {children?.length &&
        placement === 'vertical' &&
        !mini &&
        !showAllSubMenus &&
        expandedIds?.includes(id) &&
        expandedType === 'default' && (
          <ul className={`${prefixCls}-submenu`}>
            {children.map((child) => (
              <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
            ))}
          </ul>
        )}
      {/* 垂直菜单-弹出展开 */}
      {children?.length && placement === 'vertical' && !showAllSubMenus && expandedType === 'pop' && (
        <PopperPortal
          visible={!!expandedIds?.includes(id)}
          attachEl={itemRef.current}
          placement={'right-start'}
          gutterGap={16}
          onClose={() => {
            if (closePopper) {
              closePopper(id)
            }
          }}
        >
          <ul className={`${prefixCls}-popmenu`}>
            {children.map((child) => (
              <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
            ))}
          </ul>
        </PopperPortal>
      )}
      {/* 垂直胖菜单 */}
      {children?.length && placement === 'vertical' && showAllSubMenus && (
        <PopperPortal
          visible={!!expandedIds?.includes(id)}
          attachEl={itemRef.current}
          placement={'right-start'}
          gutterGap={16}
          onClose={() => {
            if (closePopper) {
              closePopper(id)
            }
          }}
        >
          <div className={`${prefixCls}-fat-menu`}>
            {children.map((child) => {
              return (
                <div key={child.id} className={`${prefixCls}-fat-menu__group`}>
                  <div className={`${prefixCls}-group-item`}>{child.content}</div>
                  {child?.children?.length && (
                    <ul>
                      {child.children.map((item) => (
                        <div
                          onClick={() => {
                            if (clickMenu) {
                              clickMenu(item.id)
                            }
                            if (closePopper) {
                              closePopper(id)
                            }
                          }}
                          className={cx(`${prefixCls}-item`, {
                            [`${prefixCls}-item--active`]: activeId === item.id,
                          })}
                          key={item.id}
                        >
                          {item.content}
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </PopperPortal>
      )}
      {/* 水平菜单 */}
      {children?.length && placement === 'horizontal' && !showAllSubMenus && (
        <PopperPortal
          visible={!!expandedIds?.includes(id)}
          attachEl={itemRef.current}
          placement={level === 1 ? 'bottom-start' : 'right-start'}
          gutterGap={level === 1 ? 8 : 16}
          onClose={() => {
            if (closePopper) {
              closePopper(id)
            }
          }}
        >
          <ul className={`${prefixCls}-popmenu`}>
            {children.map((child) => (
              <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
            ))}
          </ul>
        </PopperPortal>
      )}
      {/* 水平胖菜单 */}
      {children?.length && placement === 'horizontal' && showAllSubMenus && (
        <PopperPortal
          visible={!!expandedIds?.includes(id)}
          attachEl={itemRef.current}
          placement={'bottom-start'}
          gutterGap={8}
          onClose={() => {
            if (closePopper) {
              closePopper(id)
            }
          }}
        >
          <div className={`${prefixCls}-fat-menu`}>
            {children.map((child) => {
              return (
                <div key={child.id} className={`${prefixCls}-fat-menu__group`}>
                  <div className={`${prefixCls}-group-item`}>{child.content}</div>
                  {child?.children?.length && (
                    <ul>
                      {child.children.map((item) => (
                        <div
                          className={cx(`${prefixCls}-item`, {
                            [`${prefixCls}-item--active`]: activeId === item.id,
                          })}
                          onClick={() => {
                            if (clickMenu) {
                              clickMenu(item.id)
                            }
                            if (closePopper) {
                              closePopper(id)
                            }
                          }}
                          key={item.id}
                        >
                          {item.content}
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </PopperPortal>
      )}
    </li>
  )
}

if (__DEV__) {
  MenuItem.displayName = 'MenuItem'
}
