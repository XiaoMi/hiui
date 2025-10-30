
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-question-circle-filled')

export const QuestionCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14540"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333zM507.733333 661.333333a42.666667 42.666667 0 1 0 0 85.333334 42.666667 42.666667 0 0 0 0-85.333334z m3.2-379.733333c-53.013333 0-95.317333 34.432-116.928 70.250667a128.533333 128.533333 0 0 0-15.509333 38.698666 38.4 38.4 0 0 0 75.008 16.576 51.84 51.84 0 0 1 6.250667-15.616c11.946667-19.776 32.362667-33.109333 51.2-33.109333 35.456 0 58.666667 27.114667 58.666666 49.493333 0 7.786667-3.498667 15.722667-13.013333 24.682667-18.88 17.856-40.832 39.402667-57.92 64.213333-17.322667 25.173333-31.253333 55.893333-31.253333 92.010667a38.4 38.4 0 1 0 76.8 0c0-15.573333 5.845333-31.253333 17.706666-48.426667 12.074667-17.557333 28.714667-34.346667 47.381334-51.946666 19.306667-18.218667 37.077333-45.013333 37.077333-80.554667 0-70.677333-63.744-126.272-135.466667-126.272z" p-id="14541"></path></svg>
    )
  }
)

if (__DEV__) {
  QuestionCircleFilled.displayName = 'QuestionCircleFilled'
}
  