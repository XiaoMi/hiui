import React, { useRef, useContext, useState } from 'react'
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
}) => {
  const itemRef = useRef<HTMLLIElement | null>(null)
  const { placement, expandedType, showAllSubMenus, mini } = useContext(MenuContext)
  const [expanded, setExpanded] = useState(false)
  return (
    <li
      ref={itemRef}
      className={cx(`${prefixCls}-item`, {
        [`${prefixCls}-item--disabled`]: disabled,
      })}
    >
      <div
        className={cx(`${prefixCls}-item__inner`, { [`${prefixCls}-item__inner--mini`]: mini })}
        onClick={() => {
          if (children?.length) {
            setExpanded(!expanded)
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
        {mini &&
          (icon || typeof content === 'string' ? (content as String).substring(0, 1) : content)}
        {!mini && <span className={`${prefixCls}-item__content`}>{content}</span>}
        {/* 垂直菜单-纵向展开 */}
        {children?.length &&
          placement === 'vertical' &&
          expandedType === 'default' &&
          !showAllSubMenus &&
          (expanded ? <UpOutlined /> : <DownOutlined />)}
        {/* 垂直菜单-弹出展开 */}
        {children?.length &&
          placement === 'vertical' &&
          (expandedType === 'pop' || showAllSubMenus) && <RightOutlined />}
        {/* 水平菜单 */}
        {children?.length && placement === 'horizontal' && level > 1 && <RightOutlined />}
        {children?.length &&
          placement === 'horizontal' &&
          level === 1 &&
          (expanded ? <UpOutlined /> : <DownOutlined />)}
      </div>
      {/* 垂直菜单-纵向展开 */}
      {children?.length &&
        placement === 'vertical' &&
        !showAllSubMenus &&
        expanded &&
        expandedType === 'default' && (
          <ul className={`${prefixCls}-submenu`}>
            {children.map((child) => (
              <MenuItem {...child} key={child.id} level={level + 1} />
            ))}
          </ul>
        )}
      {/* 垂直菜单-弹出展开 */}
      {children?.length &&
        placement === 'vertical' &&
        !showAllSubMenus &&
        expanded &&
        expandedType === 'pop' && (
          <PopperPortal
            visible={expanded}
            attachEl={itemRef.current}
            placement={'right-start'}
            gutterGap={level === 1 ? 8 : 16}
            onClose={() => {
              setExpanded(false)
            }}
          >
            <ul className={`${prefixCls}-popmenu`}>
              {children.map((child) => (
                <MenuItem {...child} key={child.id} level={level + 1} />
              ))}
            </ul>
          </PopperPortal>
        )}
      {/* 垂直胖菜单 */}
      {children?.length && placement === 'vertical' && showAllSubMenus && (
        <PopperPortal
          visible={expanded}
          attachEl={itemRef.current}
          placement={'right-start'}
          gutterGap={8}
          onClose={() => {
            setExpanded(false)
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
                        <div className={`${prefixCls}-item`} key={item.id}>
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
          visible={expanded}
          attachEl={itemRef.current}
          placement={level === 1 ? 'bottom-start' : 'right-start'}
          gutterGap={level === 1 ? 8 : 16}
          onClose={() => {
            setExpanded(false)
          }}
        >
          <ul className={`${prefixCls}-popmenu`}>
            {children.map((child) => (
              <MenuItem {...child} key={child.id} level={level + 1} />
            ))}
          </ul>
        </PopperPortal>
      )}
      {/* 水平胖菜单 */}
      {children?.length && placement === 'horizontal' && showAllSubMenus && (
        <PopperPortal
          visible={expanded}
          attachEl={itemRef.current}
          placement={'bottom-start'}
          gutterGap={8}
          onClose={() => {
            setExpanded(false)
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
                        <div className={`${prefixCls}-item`} key={item.id}>
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
