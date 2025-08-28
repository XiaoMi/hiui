import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import { CollapseIcon } from './CollapseIcon'

const FLOAT_MENU_CONTAINER_PREFIX = getPrefixCls('float-menu-container')

/**
 * 浮动菜单容器组件
 */
export const FloatMenuContainer = forwardRef<HTMLDivElement | null, FloatMenuContainerProps>(
  (
    {
      prefixCls = FLOAT_MENU_CONTAINER_PREFIX,
      role = 'float-menu-container',
      className,
      children,
      visible: visibleProp,
      width,
      collapsed: collapsedProp = true,
      onCollapse,
      zIndex,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const i18n = useLocaleContext()

    const [collapsed, setCollapsed] = React.useState(collapsedProp)
    console.log('collapsed', collapsed)

    React.useEffect(() => {
      setCollapsed(collapsedProp)
    }, [collapsedProp])

    const visible = React.useMemo(() => {
      return collapsed ? visibleProp : true
    }, [collapsed, visibleProp])

    const handleCollapse = () => {
      const newCollapsed = !collapsed
      setCollapsed(newCollapsed)
      onCollapse?.(newCollapsed)
    }

    return (
      <div
        ref={ref}
        role={role}
        className={cls}
        {...rest}
        style={visible ? { width: collapsed ? 0 : width } : {}}
      >
        <div
          className={cx(`${prefixCls}-content`, {
            [`${prefixCls}-content--show`]: visible,
            [`${prefixCls}-content--collapsed`]: collapsed,
          })}
          style={{ zIndex, width: visible ? width : 0 }}
        >
          {visible && (
            <div className={cx(`${prefixCls}-collapse-wrapper`)}>
              <div className={cx(`${prefixCls}-collapse`)} onClick={handleCollapse}>
                <span className={cx(`${prefixCls}-collapse-icon`)}>
                  <CollapseIcon />
                </span>
                <span className={cx(`${prefixCls}-collapse-text`)}>
                  {collapsed ? i18n.timeline.expand : i18n.timeline.collapse}
                </span>
              </div>
            </div>
          )}
          <div className={cx(`${prefixCls}-content-wrapper`)}>{children}</div>
        </div>
      </div>
    )
  }
)

export interface FloatMenuContainerProps extends HiBaseHTMLProps<'div'> {
  /**
   * 浮动宽度
   */
  width?: number
  /**
   * 层级
   */
  zIndex?: number
  /**
   * 是否显示
   */
  visible?: boolean
  /**
   * 是否折叠
   */
  collapsed?: boolean
  /**
   * 折叠回调
   */
  onCollapse?: (collapsed: boolean) => void
}

if (__DEV__) {
  FloatMenuContainer.displayName = 'FloatMenuContainer'
}
