import React, { forwardRef, useCallback, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { Resizable, ResizeCallbackData } from 'react-resizable'

const SIDER_PREFIX = getPrefixCls('sider')

/**
 * 侧边栏组件
 */
export const Sider = forwardRef<HTMLDivElement | null, SiderProps>(
  (
    {
      prefixCls = SIDER_PREFIX,
      role = 'sider',
      className,
      collapsed: collapsedProp,
      onCollapse,
      children,
      ...rest
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = useUncontrolledState(false, collapsedProp, onCollapse)
    const [width, setWidth] = useState(collapsedProp ? 68 : 200)

    const handleResize = (evt: React.SyntheticEvent, options: ResizeCallbackData) => {
      let width = options?.size?.width as number

      if (!collapsed && width < 150) {
        width = 68
        setCollapsed(true)
      }

      if (collapsed && width > 68) {
        width = 200
        setTimeout(() => {
          setCollapsed(false)
        }, 300)
      }

      if (width < 68) {
        width = 68
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

    return (
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
        <div ref={ref} role={role} className={cls} {...rest} style={{ width, ...rest.style }}>
          {children}
        </div>
      </Resizable>
    )
  }
)

export interface SiderProps extends HiBaseHTMLProps<'div'> {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

if (__DEV__) {
  Sider.displayName = 'Sider'
}
