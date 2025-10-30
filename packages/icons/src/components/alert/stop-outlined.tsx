
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-stop-outlined')

export const StopOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9747"  ><path d="M763.925333 260.074667C633.962667 130.133333 428.586667 121.557333 288.682667 234.389333l500.906666 500.906667c112.832-139.904 104.298667-345.258667-25.664-475.221333zM260.053333 763.946667C390.037333 893.866667 595.413333 902.4 735.296 789.610667l-500.906667-500.906667C121.557333 428.586667 130.112 633.941333 260.053333 763.904zM818.218667 205.781333c169.130667 169.130667 169.130667 443.306667 0 612.437334-169.109333 169.130667-443.306667 169.130667-612.437334 0-169.130667-169.109333-169.130667-443.306667 0-612.437334 169.130667-169.130667 443.306667-169.130667 612.437334 0z" p-id="9748"></path></svg>
    )
  }
)

if (__DEV__) {
  StopOutlined.displayName = 'StopOutlined'
}
  