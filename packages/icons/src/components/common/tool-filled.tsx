
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-tool-filled')

export const ToolFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30614"  ><path d="M885.973333 732.373333l-196.074666-197.162666c15.296-34.56 19.434667-76.48 19.434666-118.72C709.333333 247.530667 572.970667 106.666667 404.8 106.666667c-21.717333 0-43.498667 5.738667-64.789333 14.08-43.2 16.981333-47.893333 76.970667-11.904 106.282666l92.245333 75.093334 3.562667 3.562666A88.576 88.576 0 0 1 298.666667 430.954667l-0.896-0.917334a49.386667 49.386667 0 0 1-4.864-5.653333l-65.578667-89.109333c-28.373333-38.549333-89.92-34.432-106.645333 10.432C112.362667 367.978667 106.666667 390.08 106.666667 410.026667c0 168.981333 133.76 307.242667 301.952 307.242666 45.866667 0 87.893333-11.52 129.941333-30.72l194.176 199.082667c42.048 42.24 110.848 42.24 149.077333 0l3.818667-3.84c42.026667-38.4 42.389333-107.178667 0.341333-149.44z" p-id="30615"></path></svg>
    )
  }
)

if (__DEV__) {
  ToolFilled.displayName = 'ToolFilled'
}
  