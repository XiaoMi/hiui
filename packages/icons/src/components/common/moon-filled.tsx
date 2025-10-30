
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-moon-filled')

export const MoonFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26594"  ><path d="M915.093333 566.997333c21.162667 10.88 39.082667 36.821333 29.226667 68.48-56.234667 180.48-224.576 311.594667-423.68 311.616-241.237333 0-437.504-192.512-443.584-432.277333l-0.149333-11.456c0-199.104 131.114667-367.445333 311.616-423.68 31.658667-9.856 57.6 8.064 68.48 29.226667 9.621333 18.709333 10.410667 44.138667-3.797334 65.024l-3.050666 4.138666-7.061334 9.173334a280.085333 280.085333 0 0 0-54.72 166.784l0.106667 7.253333c3.84 152.170667 128.426667 274.346667 281.493333 274.346667 66.624 0 127.765333-23.104 175.957334-61.781334 21.610667-17.301333 49.194667-17.130667 69.162666-6.826666z" p-id="26595"></path></svg>
    )
  }
)

if (__DEV__) {
  MoonFilled.displayName = 'MoonFilled'
}
  