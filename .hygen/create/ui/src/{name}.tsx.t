---
to: <%= h.uiDir(`${name}/src/${h.camelCase(name)}.tsx`) %>
---
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const <%= h.capt(name) %>_PREFIX = getPrefixCls('<%= name %>')

/**
* TODO: What is <%= h.camelCase(name) %>
*/
export const <%= h.camelCase(name) %> = forwardRef<HTMLDivElement | null, <%= h.camelCase(name) %>Props>(
  (
    {
      prefixCls = <%= h.capt(name) %>_PREFIX,
      role = '<%= name %>',
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
