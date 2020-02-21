import React from 'react'
import Classnames from 'classnames'

export const BarProgress = props => {
  function getWidth () {
    if (!props.width || props.width <= 0) {
      return props.size === 'large' ? 480 : 160
    }
    return props.width
  }

  function getHeight () {
    const { size, height } = props
    if (!height || height <= 0) {
      return size === 'large' ? 8 : size === 'default' ? 6 : 2
    }
    return height
  }

  let prefix = 'hi-progress'
  const {
    percent: percentNum,
    content,
    type,
    showInfo,
    placement,
    tooltip = null,
    active
  } = props
  const percent = percentNum > 0 ? percentNum : 0
  return (
    <div>
      <div
        className={`${prefix}__inner`}
        style={{ width: getWidth() + 'px', height: getHeight() + 'px' }}
      >
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
