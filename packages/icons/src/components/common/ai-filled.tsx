
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-ai-filled')

export const AiFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5336"  ><path d="M490.282667 100.117333c7.765333-19.712 35.669333-19.712 43.434666 0l88.042667 223.210667a140.074667 140.074667 0 0 0 78.933333 78.933333l223.189334 88.021334c19.712 7.765333 19.712 35.669333 0 43.434666l-223.210667 88.042667a140.074667 140.074667 0 0 0-78.933333 78.933333l-88.021334 223.189334c-7.765333 19.712-35.669333 19.712-43.434666 0l-88.042667-223.210667a140.074667 140.074667 0 0 0-78.933333-78.933333L100.138667 533.738667c-19.712-7.765333-19.712-35.669333 0-43.434667l223.210666-88.042667a140.074667 140.074667 0 0 0 78.933334-78.933333l88.021333-223.189333zM799.253333 100.352c7.893333-20.032 36.266667-20.032 44.16 0a142.4 142.4 0 0 0 80.213334 80.234667c20.053333 7.893333 20.053333 36.266667 0 44.16a142.4 142.4 0 0 0-80.213334 80.213333c-7.893333 20.053333-36.266667 20.053333-44.16 0a142.4 142.4 0 0 0-80.213333-80.213333c-20.053333-7.893333-20.053333-36.266667 0-44.16a142.4 142.4 0 0 0 80.213333-80.213334z" p-id="5337"></path></svg>
    )
  }
)

if (__DEV__) {
  AiFilled.displayName = 'AiFilled'
}
  