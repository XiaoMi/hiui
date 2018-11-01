import React from 'react'
export const BarProgress = (props) => {
  function getWidth () {
    if (!props.width || props.width <= 0) {
      return props.size === 'big' ? 480 : 160
    }
    return props.width
  }

  function getHeight () {
    const {size, height} = props
    if (!height || height <= 0) {
      return size === 'big' ? 8 : (size === 'middle' ? 6 : 2)
    }
    return height
  }

  let prefix = 'hi-progress'
  const {percent: percentNum, text, status, withOutText = false, inside = false, tooltip = null} = props
  const percent = percentNum > 0 ? percentNum : 0
  return (
    <div>
      <div
        className={`${prefix}__inner`}
        style={{width: getWidth() + 'px', height: getHeight() + 'px'}}>
        <div
          className={`${prefix}__bar ${prefix}__bar_${status}`}
          style={{width: `${percent}%`}}>
          {(!withOutText && inside && getHeight() >= 14) && <div
            className={`${prefix}__text_inside`}>
            {text || `${percent}%`}
          </div>}
          {tooltip}
        </div>
      </div>
      {(!withOutText && !inside) && <div
        className={`${prefix}__text ${prefix}__text_${status}`}>
        {text || `${percent}%`}
      </div>}
    </div>
  )
}
