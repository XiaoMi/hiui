import React from 'react'
import './style/index'
import './iconfont.js'

const Icon = ({ name, filled = false, style = {} }) => {
  return (
    <svg
      class='hi-icon'
      aria-hidden='true'
      style={{ fill: style.color, height: style.fontSize, width: style.fontSize }}
    >
      <use xlinkHref={`#icon${name}-${filled ? 'filled' : 'outlined'}`} />
    </svg>
  )
}
export default Icon
