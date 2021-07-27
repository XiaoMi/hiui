
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-security-outlined'
const _prefix = getPrefixCls(_role)

export const SecurityOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M514.21 66.536l371.826 97.894A8 8 0 0 1 892 172.166v551.22a8 8 0 0 1-3.992 6.926L516.042 945.68a8 8 0 0 1-8.016 0L135.992 730.31A8 8 0 0 1 132 723.388V172.168a8 8 0 0 1 5.964-7.736L510.14 66.536a8 8 0 0 1 4.072 0z m-2.046 82.186L212 227.676v454.196l300.03 173.688L812 681.876V227.662l-299.836-78.94zM513 338c39.212 0 71 31.788 71 71 0 24.808-12.722 46.642-32 59.338V596a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-129.028c-18.152-12.86-30-34.032-30-57.972 0-39.212 31.788-71 71-71z" p-id="13165"></path></svg>
    )
  }
)

if (__DEV__) {
  SecurityOutlined.displayName = 'SecurityOutlined'
}
  