import React from 'react'
import classNames from 'classnames'

import './style/index'
import './iconfont.js'

const Icon = ({ name, filled = false, className, style = {}, onClick }) => {
  return (
    <svg
      className={classNames(className, 'hi-icon')}
      aria-hidden='true'
      onClick={e => {
        onClick && onClick(e)
      }}
      style={{
        fill: style.color,
        height: style.fontSize,
        width: style.fontSize,
        cursor: style.cursor
      }}
    >
      <use xlinkHref={`#icon${name}-${filled ? 'filled' : 'outlined'}`} />
    </svg>
  )
}
export default Icon
