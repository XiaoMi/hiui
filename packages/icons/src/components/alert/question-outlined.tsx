
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-question-outlined')

export const QuestionOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9456"  ><path d="M468.309333 691.2V642.133333c0-57.6 34.325333-101.781333 66.688-135.424 16.426667-17.066667 34.901333-33.877333 50.645334-48.810666 16.426667-15.573333 30.570667-29.674667 41.664-43.712 9.898667-12.522667 19.093333-32.853333 21.205333-66.688 4.074667-65.173333-58.026667-129.877333-134.186667-129.877334-45.077333 0-90.090667 33.898667-115.861333 80.576a146.346667 146.346667 0 0 0-15.296 41.749334 38.4 38.4 0 0 1-75.306667-15.232c4.608-22.698667 12.586667-44.096 23.381334-63.658667 33.898667-61.333333 100.394667-120.213333 183.061333-120.213333 114.432 0 218.090667 96.256 210.88 211.456-2.88 46.122667-16.128 82.346667-37.653333 109.546666-14.762667 18.666667-32.384 35.989333-49.066667 51.797334-17.365333 16.426667-33.344 30.933333-48.128 46.314666-30.058667 31.232-45.226667 56.384-45.226667 82.176V691.2a38.4 38.4 0 1 1-76.8 0zM505.514667 883.2a53.333333 53.333333 0 1 1 0-106.666667 53.333333 53.333333 0 0 1 0 106.666667z" p-id="9457"></path></svg>
    )
  }
)

if (__DEV__) {
  QuestionOutlined.displayName = 'QuestionOutlined'
}
  