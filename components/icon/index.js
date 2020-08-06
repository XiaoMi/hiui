import React from 'react'
import './style/index'
import './iconfont.js'

const Icon = ({ name, filled = false, style = {}, onClick }) => {
  return (
    <svg
      class='hi-icon'
      aria-hidden='true'
      onClick={(e) => {
        onClick && onClick(e)
      }}
      style={{ fill: style.color, height: style.fontSize, width: style.fontSize, cursor: style.cursor }}
    >
      <use xlinkHref={`#icon${name}-${filled ? 'filled' : 'outlined'}`} />
    </svg>
  )
}
export default Icon
