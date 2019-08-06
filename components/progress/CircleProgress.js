import React from 'react'
export const CircleProgress = props => {
  let prefix = 'hi-progress'
  const { percent: percentNum, content, type, radius: radiusThis, showInfo } = props
  const percent = percentNum > 0 ? percentNum : 0
  const radius = radiusThis > 0 ? radiusThis : 40
  const totalRadiusWidth = radius + 10
  const strokeDash = radius * 2 * Math.PI
  return (
    <div className={`${prefix}__svg`} style={{ width: radius * 2, height: radius * 2 }}>
      <svg viewBox={`0 0 ${totalRadiusWidth * 2} ${totalRadiusWidth * 2}`}>
        <circle
          cx={totalRadiusWidth}
          cy={totalRadiusWidth}
          r={radius}
          className={`${prefix}__svgbackground`}
        />
        <circle
          cx={totalRadiusWidth}
          cy={totalRadiusWidth}
          r={radius}
          className={`${prefix}__circle ${prefix}__circle--${type}`}
          strokeDasharray={`${strokeDash} ${strokeDash}`}
          strokeDashoffset={`${strokeDash * ((100 - percent) / 100)}`}
          strokeLinecap='round'
        />
      </svg>
      {showInfo && (
        <div className={`${prefix}__text ${prefix}__text--${type}`}>{content || `${percent}%`}</div>
      )}
    </div>
  )
}
