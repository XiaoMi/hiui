
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-strategy-outlined'
const _prefix = getPrefixCls(_role)

export const StrategyOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M544 132.672a64 64 0 0 0-48.064 0l-318.72 129.152c-53.312 21.568-53.312 97.024 0 118.592l318.72 129.152a64 64 0 0 0 48 0l318.72-129.152c53.312-21.568 53.312-97.024 0-118.592L544 132.672z m294.656 188.48L519.936 450.24l-318.72-129.088L520 192l318.72 129.152zM157.44 551.424a32 32 0 0 1 24.96-58.944L520.576 635.2l338.24-142.72a32 32 0 0 1 24.896 58.88L533.504 699.2a31.872 31.872 0 0 1-25.536 0.192l-350.4-147.968zM157.44 743.424a32 32 0 1 1 24.96-58.944L520.576 827.2l338.24-142.72a32 32 0 0 1 24.896 58.88L533.504 891.2a31.872 31.872 0 0 1-25.536 0.192L157.504 743.424z" p-id="11235"></path></svg>
    )
  }
)

if (__DEV__) {
  StrategyOutlined.displayName = 'StrategyOutlined'
}
  