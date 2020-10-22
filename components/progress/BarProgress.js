import React from 'react'
import Classnames from 'classnames'

export const BarProgress = (props) => {
  function getWidth() {
    if (!props.width || props.width <= 0) {
      return props.size === 'large' ? 480 : 160
    }
    return props.width
  }

  function getHeight() {
    const { size, height } = props
    if (!height || height <= 0) {
      return size === 'large' ? 8 : size === 'default' ? 6 : 2
    }
    return height
  }

  const prefix = 'hi-progress'
  const { percent: percentNum, placement, tooltip = null, active } = props
  const content = typeof props.content !== 'undefined' ? props.content : props.text // // api 兼容 1.x 为 text 2.x 改为 content
  const showInfo = typeof props.showInfo !== 'undefined' ? props.showInfo : props.withOutText // // api 兼容 1.x 为 withOutText 2.x 改为 showInfo
  const type = props.type || props.status

  const percent = percentNum > 0 ? percentNum : 0
  return (
    <div>
      <div className={`${prefix}__inner`} style={{ width: getWidth() + 'px', height: getHeight() + 'px' }}>
        <div
          className={Classnames(`${prefix}__bar ${prefix}__bar--${type}`, {
            [`${prefix}__bar--active`]: active
          })}
          style={{ width: `${percent}%` }}
        >
          {showInfo && placement === 'inside' && getHeight() >= 14 && (
            <div className={`${prefix}__text--inside`}>{content || `${percent}%`}</div>
          )}
          {tooltip}
        </div>
      </div>
      {showInfo && placement === 'outside' && (
        <div className={`${prefix}__text ${prefix}__text--${type}`}>{content || `${percent}%`}</div>
      )}
    </div>
  )
}
