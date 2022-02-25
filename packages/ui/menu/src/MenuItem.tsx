import React, { useRef, useContext } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { MenuItemProps } from './Menu'
import { __DEV__ } from '@hi-ui/env'
import { DownOutlined, UpOutlined, RightOutlined } from '@hi-ui/icons'
import MenuContext from './context'
import { PopperPortal, Popper } from '@hi-ui/popper'
import { Expander } from './Expander'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'

const MENU_PREFIX = getPrefixCls('menu')

export const MenuItem: React.FC<MenuItemProps> = ({
  prefixCls = MENU_PREFIX,
  icon,
  title,
  disabled,
  id,
  level = 1,
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
    closeAllPopper,
    activeParents,
  } = useContext(MenuContext)

  const _parentIds = (parentIds || []).concat(id)

  const hasChildren = isArrayNonEmpty(children)

  return (
    <li
      ref={itemRef}
      className={cx(`${prefixCls}-item`, {
        [`${prefixCls}-item--disabled`]: disabled,
        [`${prefixCls}-item--active`]:
          placement === 'horizontal' &&
          (activeId === id || activeParents?.includes(id)) &&
          level === 1,
      })}
    >
      <div
        className={cx(`${prefixCls}-item__inner`, {
          [`${prefixCls}-item__inner--mini`]: mini,
          [`${prefixCls}-item__inner--active`]: activeId === id,
          [`${prefixCls}-item__inner--active-p`]: activeParents?.includes(id),
        })}
        onClick={() => {
          if (isArrayNonEmpty(children)) {
            if (clickSubMenu) {
              clickSubMenu(id)
            }
          } else {
            if (clickMenu) {
              clickMenu(id)
            }
            if (
              closeAllPopper &&
              !(placement === 'vertical' && expandedType === 'collapse' && mini === false)
            ) {
              closeAllPopper()
            }
          }
        }}
        style={
          placement === 'vertical' && expandedType === 'collapse' && !mini
            ? {
                paddingLeft:
                  level > 1 ? 12 + (level - 1 > 0 ? 1 : 0) * 20 + (level - 2 || 0) * 16 : 12,
              }
            : {}
        }
      >
        {icon}
        <span className={`${prefixCls}-item__content`}>{title}</span>
        {/* 垂直菜单-纵向展开 */}
        {hasChildren &&
          !mini &&
          placement === 'vertical' &&
          expandedType === 'collapse' &&
          !showAllSubMenus &&
          (expandedIds?.includes(id) ? <UpOutlined /> : <DownOutlined />)}
        {/* 垂直菜单-mini */}
        {hasChildren && mini && level > 1 && placement === 'vertical' ? <RightOutlined /> : null}
        {/* 垂直菜单-弹出展开 */}
        {hasChildren &&
        !mini &&
        placement === 'vertical' &&
        (expandedType === 'pop' || showAllSubMenus) ? (
          <RightOutlined />
        ) : null}
        {/* 水平菜单 */}
        {hasChildren && placement === 'horizontal' && level > 1 ? <RightOutlined /> : null}
        {hasChildren &&
          placement === 'horizontal' &&
          level === 1 &&
          (expandedIds?.includes(id) ? (
            <UpOutlined style={{ marginLeft: 4 }} />
          ) : (
            <DownOutlined style={{ marginLeft: 4 }} />
          ))}
      </div>
      {/* 垂直菜单-纵向展开 */}
      {hasChildren &&
      placement === 'vertical' &&
      !mini &&
      !showAllSubMenus &&
      expandedType === 'collapse' ? (
        <Expander visible={!!expandedIds?.includes(id)}>
          <ul className={`${prefixCls}-submenu`}>
            {children!.map((child) => (
              <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
            ))}
          </ul>
        </Expander>
      ) : null}
      {/* 垂直菜单-纵向展开-mini */}
      {hasChildren &&
        placement === 'vertical' &&
        mini &&
        !showAllSubMenus &&
        expandedType === 'collapse' &&
        (level === 1 ? (
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
              {children!.map((child) => (
                <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
              ))}
            </ul>
          </PopperPortal>
        ) : (
          <Popper
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
              {children!.map((child) => (
                <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
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
              {children!.map((child) => (
                <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
              ))}
            </ul>
          </PopperPortal>
        ) : (
          <Popper
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
              {children!.map((child) => (
                <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
              ))}
            </ul>
          </Popper>
        ))}
      {/* 垂直胖菜单 */}
      {hasChildren && placement === 'vertical' && showAllSubMenus ? (
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
            {children!.map((child) => {
              return (
                <div key={child.id} className={`${prefixCls}-fat-menu__group`}>
                  <div className={`${prefixCls}-group-item`}>{child.title}</div>
                  {child && isArrayNonEmpty(child.children) ? (
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
                          {item.title}
                        </div>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )
            })}
          </div>
        </PopperPortal>
      ) : null}
      {/* 水平菜单 */}
      {hasChildren &&
        placement === 'horizontal' &&
        !showAllSubMenus &&
        (level === 1 ? (
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
              {children!.map((child) => (
                <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
              ))}
            </ul>
          </PopperPortal>
        ) : (
          <Popper
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
              {children!.map((child) => (
                <MenuItem {...child} key={child.id} level={level + 1} parentIds={_parentIds} />
              ))}
            </ul>
          </Popper>
        ))}
      {/* 水平胖菜单 */}
      {hasChildren && placement === 'horizontal' && showAllSubMenus ? (
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
                          {item.title}
                        </div>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )
            })}
          </div>
        </PopperPortal>
      ) : null}
    </li>
  )
}

if (__DEV__) {
  MenuItem.displayName = 'MenuItem'
}
