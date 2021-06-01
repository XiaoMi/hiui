---
to: <%= h.uiDir(`${name}/src/${name}.tsx`) %>
---
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'

const componentName = '<%= name %>'
const _prefix = getPrefixCls(componentName)

export const <%= h.camelCase(name) %> = forwardRef<HTMLDivElement | null, <%= h.camelCase(name) %>Props>(
  (
    {
      prefixCls = _prefix,
      role = componentName,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {children}
      </div>
    )
  }
)

export interface <%= h.camelCase(name) %>Props {
  prefixCls?: string
  role?: string
  className?: string
  style?: React.CSSProperties
}

export default <%= h.camelCase(name) %>
