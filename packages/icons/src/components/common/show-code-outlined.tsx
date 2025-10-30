
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-show-code-outlined')

export const ShowCodeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8115"  ><path d="M116.608 546.304a81.109333 81.109333 0 0 1 0-68.586667L257.493333 175.765333a38.4 38.4 0 0 1 69.589334 32.469334L186.197333 510.186667a4.309333 4.309333 0 0 0 0 3.626666l140.906667 301.952a38.4 38.4 0 1 1-69.589333 32.469334L116.608 546.304zM916.010667 546.304a81.109333 81.109333 0 0 0 0-68.586667L775.125333 175.765333a38.4 38.4 0 1 0-69.589333 32.469334l140.928 301.952a4.309333 4.309333 0 0 1 0 3.626666L705.493333 815.786667a38.4 38.4 0 1 0 69.589334 32.469333l140.906666-301.930667z" p-id="8116"></path></svg>
    )
  }
)

if (__DEV__) {
  ShowCodeOutlined.displayName = 'ShowCodeOutlined'
}
  