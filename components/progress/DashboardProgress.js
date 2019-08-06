import React from 'react'
export const DashboardProgress = props => {
  let prefix = 'hi-progress'
  const { percent: percentNum, content, status, radius: radiusThis, showInfo } = props
  const percent = percentNum > 0 ? percentNum : 0
  const radius = radiusThis > 0 ? radiusThis : 40
  const totalRadiusWidth = radius + 10
  const strokeDash = radius * 2 * Math.PI
  const openWidth = 70
  const pathString = `M ${totalRadiusWidth},${totalRadiusWidth} m 0,${radius}
  a ${radius},${radius} 0 1 1 0,-${2 * radius}
  a ${radius},${radius} 0 1 1 0,${2 * radius}`
  const trailPathStyle = {
    strokeDasharray: `${strokeDash - openWidth}px ${strokeDash}px`,
    strokeDashoffset: `-${openWidth / 2}px`,
    transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s ease'
  }
  const strokePathStyle = {
    strokeDasharray: `${(percent / 100) * (strokeDash - openWidth)}px ${strokeDash}px`,
    strokeDashoffset: `-${openWidth / 2}px`,
    transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s ease',
    fill: '#fff'
  }
  return (
    <div
      className={`${prefix}__svg ${prefix}__svg_dashboard`}
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <svg viewBox={`0 0 ${totalRadiusWidth * 2} ${totalRadiusWidth * 2}`}>
        <path
          className={`${prefix}__svgbackground`}
          d={pathString}
          fillOpacity='0'
          strokeLinecap='round'
          style={trailPathStyle}
        />
        <path
          className={`${prefix}__dashboard ${prefix}__dashboard--${status}`}
          d={pathString}
          strokeLinecap='round'
          style={strokePathStyle}
        />
      </svg>
      {showInfo && (
        <div className={`${prefix}__text ${prefix}__text--${status}`}>
          {content || `${percent}%`}
        </div>
      )}
    </div>
  )
}
