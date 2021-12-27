
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-mail-send-outlined'
const _prefix = getPrefixCls(_role)

export const MailSendOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M725.333333 128a85.333333 85.333333 0 0 1 85.333334 85.333333v85.333334c26.666667 0 51.413333 8.149333 71.893333 22.08a42.496 42.496 0 0 1 34.069333 34.090666A127.317333 127.317333 0 0 1 938.666667 426.666667v341.333333a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V426.666667c0-26.624 8.106667-51.349333 22.037334-71.829334a42.773333 42.773333 0 0 1 34.069333-34.112A127.466667 127.466667 0 0 1 213.333333 298.666667v-85.333334a85.333333 85.333333 0 0 1 85.333334-85.333333h426.666666z m128 299.285333l-318.144 205.866667a42.666667 42.666667 0 0 1-43.306666 1.813333l-3.072-1.813333L170.666667 427.306667V768a42.666667 42.666667 0 0 0 39.466666 42.56L213.333333 810.666667h597.333334a42.666667 42.666667 0 0 0 42.56-39.466667L853.333333 768V427.285333zM725.333333 213.333333H298.666667v195.114667l213.333333 138.048 213.333333-138.048V213.333333z m-128 85.333334a42.666667 42.666667 0 1 1 0 85.333333h-170.666666a42.666667 42.666667 0 1 1 0-85.333333h170.666666z" p-id="39665"></path></svg>
    )
  }
)

if (__DEV__) {
  MailSendOutlined.displayName = 'MailSendOutlined'
}
  