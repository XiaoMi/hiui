---
to: <%= h.uiDir(`${name}/src/${h.camelCase(name)}.tsx`) %>
---
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = '<%= name %>'
const _prefix = getPrefixCls(_role)

/**
* TODO: What is <%= h.camelCase(name) %>
*/
export const <%= h.camelCase(name) %> = forwardRef<HTMLDivElement | null, <%= h.camelCase(name) %>Props>(
  (
    {
      prefixCls = _prefix,
      role = _role,
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

export interface <%= h.camelCase(name) %>Props extends HiBaseHTMLProps<'div'> {

}

if (__DEV__) {
  <%= h.camelCase(name) %>.displayName = '<%= h.camelCase(name) %>'
}
