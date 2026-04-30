import React, { forwardRef, useCallback, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { Resizable, ResizeCallbackData } from 'react-resizable'

const SIDER_PREFIX = getPrefixCls('sider')

const DEFAULT_SIDER_WIDTH = 180
const SIDER_WIDTH_MIN = 60
const SIDER_WIDTH_MIN_COLLAPSED = 150
const SIDER_WIDTH_MAX = 360

/**
 * 侧边栏组件
 */
export const Sider = forwardRef<HTMLDivElement | null, SiderProps>(
  (
    {
      prefixCls = SIDER_PREFIX,
      role = 'sider',
      className,
      width: widthProp,
      maxWidth: maxWidthProp,
      resizable = true,
      collapsed: collapsedProp,
      onCollapse,
      children,
      ...rest
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = useUncontrolledState(false, collapsedProp, onCollapse)
    const siderWidth = widthProp || DEFAULT_SIDER_WIDTH
    const [width, setWidth] = useState(collapsedProp ? SIDER_WIDTH_MIN : siderWidth)
    const maxWidth = maxWidthProp || SIDER_WIDTH_MAX

    const handleResize = (evt: React.SyntheticEvent, options: ResizeCallbackData) => {
      let width = options?.size?.width as number

      if (!collapsed && width < SIDER_WIDTH_MIN_COLLAPSED) {
        width = SIDER_WIDTH_MIN
        setCollapsed(true)
      }

      if (collapsed && width > SIDER_WIDTH_MIN) {
        width = siderWidth
        setTimeout(() => {
          setCollapsed(false)
        }, 300)
      }

      if (width <= SIDER_WIDTH_MIN) {
        width = SIDER_WIDTH_MIN
      }

      if (width > maxWidth) {
        width = maxWidth
      }

      setWidth(width)
    }

    const handleResizeStart = useCallback(() => {
      document.body.style.userSelect = 'none'
    }, [])

    const handleResizeStop = useCallback(() => {
      document.body.style.userSelect = 'auto'
    }, [])

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--collapsed`]: collapsed,
    })

    const Content = (
      <div ref={ref} role={role} className={cls} {...rest} style={{ width, ...rest.style }}>
        {children}
      </div>
    )

    return resizable ? (
      <Resizable
        className={`${prefixCls}__resizable`}
        draggableOpts={{ enableUserSelectHack: false }}
        handle={<span className={`${prefixCls}__resizable-handler`} />}
        height={0}
        width={width}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
      >
        {Content}
      </Resizable>
    ) : (
      Content
    )
  }
)

export interface SiderProps extends HiBaseHTMLProps<'div'> {
  /**
   * 宽度
   */
  width?: number
  /**
   * 最大宽度
   */
  maxWidth?: number
  /**
   * 最小宽度
   */
  /**
   * 是否可调整宽度
   */
  resizable?: boolean
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
  Sider.displayName = 'Sider'
}
