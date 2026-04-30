
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-business-card-filled')

export const BusinessCardFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5160"  ><path d="M870.4 831.914667A102.464 102.464 0 0 1 768 934.4H256A102.4 102.4 0 0 1 153.6 832V192A102.4 102.4 0 0 1 256 89.6h512c56.618667 0 102.4 45.994667 102.4 102.485333v639.829334zM689.066667 693.333333a38.4 38.4 0 0 0-38.4-38.4h-277.333334a38.4 38.4 0 1 0 0 76.8h277.333334a38.4 38.4 0 0 0 38.4-38.4z m-21.333334-128c0-42.624-21.12-79.210667-49.621333-104.277333A165.333333 165.333333 0 0 0 536.96 422.4a74.666667 74.666667 0 1 0-49.898667 0 165.333333 165.333333 0 0 0-81.173333 38.677333C377.386667 486.122667 356.266667 522.709333 356.266667 565.333333a38.4 38.4 0 1 0 76.8 0c0-16.277333 8.106667-33.024 23.509333-46.592C472.106667 505.109333 492.586667 497.066667 512 497.066667c19.413333 0 39.893333 8.042667 55.424 21.674666 15.424 13.568 23.509333 30.314667 23.509333 46.592a38.4 38.4 0 1 0 76.8 0z" p-id="5161"></path></svg>
    )
  }
)

if (__DEV__) {
  BusinessCardFilled.displayName = 'BusinessCardFilled'
}
  