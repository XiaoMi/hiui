---
to: <%= h.uiDir(`${name}/src/${h.camelCase(name)}.tsx`) %>
---
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { use<%= h.camelCase(name) %>, Use<%= h.camelCase(name) %>Props } from './use-<%= name %>'
import { <%= h.camelCase(name) %>Provider } from './context'

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
    // TODO: 使用 自定义hook 抽离逻辑，若不需要可以移除
    const { rootProps, ...context } = use<%= h.camelCase(name) %>(rest)

    const cls = cx(prefixCls, className)

    return (
      <<%= h.camelCase(name) %>Provider value={context}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          {children}
        </div>
      </<%= h.camelCase(name) %>Provider>
    )
  }
)

export interface <%= h.camelCase(name) %>Props extends HiBaseHTMLProps<'div'>, Use<%= h.camelCase(name) %>Props {

}

if (__DEV__) {
  <%= h.camelCase(name) %>.displayName = '<%= h.camelCase(name) %>'
}
