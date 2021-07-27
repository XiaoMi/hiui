
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-expression-filled'
const _prefix = getPrefixCls(_role)

export const ExpressionFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64z m-97.02 577.04c-20.108-8.33-43.262 0.972-51.974 21.014-8.808 20.26 0.478 43.822 20.738 52.63C425.27 732.736 468.278 742 512 742c43.59 0 86.468-9.208 127.88-27.152 20.27-8.784 29.58-32.336 20.798-52.606-8.784-20.27-32.336-29.582-52.606-20.8l-1.894 0.812C575.246 655.384 543.8 662 512 662c-32.548 0-64.728-6.932-96.364-20.684zM364 352c-22.092 0-40 17.908-40 40v80c0 22.092 17.908 40 40 40s40-17.908 40-40v-80c0-22.092-17.908-40-40-40z m296 0c-22.092 0-40 17.908-40 40v80c0 22.092 17.908 40 40 40s40-17.908 40-40v-80c0-22.092-17.908-40-40-40z" p-id="11835"></path></svg>
    )
  }
)

if (__DEV__) {
  ExpressionFilled.displayName = 'ExpressionFilled'
}
  