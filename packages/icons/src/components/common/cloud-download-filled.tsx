
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-cloud-download-filled'
const _prefix = getPrefixCls(_role)

export const CloudDownloadFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M490.666667 149.333333c158.272 0 287.786667 123.093333 298.026666 278.762667l0.106667 2.346667c107.562667 19.52 189.568 112.298667 192.448 224.746666L981.333333 661.333333c0 127.018667-101.077333 230.890667-228.394666 234.581334L746.666667 896H320C178.624 896 64 781.376 64 640c0-91.328 48.277333-173.824 124.010667-219.392l5.568-3.285333c15.146667-148.501333 138.986667-264.576 290.389333-267.925334z m21.333333 298.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v127.488l-33.834666-33.834667-2.709334-2.496a42.666667 42.666667 0 0 0-57.621333 62.848l106.666667 106.666667 2.709333 2.496a42.666667 42.666667 0 0 0 57.621333-2.496l106.666667-106.666667 2.496-2.709333a42.666667 42.666667 0 0 0-2.496-57.642667l-2.709333-2.496a42.666667 42.666667 0 0 0-57.621334 2.496L554.666667 618.133333V490.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z" p-id="15221"></path></svg>
    )
  }
)

if (__DEV__) {
  CloudDownloadFilled.displayName = 'CloudDownloadFilled'
}
  