import React from 'react'
import Classnames from 'classnames'

export default class BarProgress extends React.Component {
  textRef = React.createRef()
  state = { insidePlacement: 'right' }

  componentDidMount () {
    if (this.props.placement === 'inside') {
      if (
        this.textRef.current &&
        this.textRef.current.clientWidth >= this.getWidth() - ((this.getWidth() * this.props.percent) / 100 + 5)
      ) {
        this.setState({ insidePlacement: 'left' })
      } else {
        this.setState({ insidePlacement: 'right' })
      }
    }
  }
  getWidth = () => {
    const { width, size } = this.props
    if (!width || width <= 0) {
      return size === 'large' ? 480 : 160
    }
    return width
  }
  getHeight = () => {
    const { size, height } = this.props
    if (!height || height <= 0) {
      return size === 'large' ? 8 : size === 'default' ? 6 : 2
    }
    return height
  }

  let prefix = 'hi-progress'
  const { percent: percentNum, placement, tooltip = null, active } = props
  const content =
    typeof props.content !== 'undefined' ? props.content : props.text // // api 兼容 1.x 为 text 2.x 改为 content
  const showInfo =
    typeof props.showInfo !== 'undefined' ? props.showInfo : props.withOutText // // api 兼容 1.x 为 withOutText 2.x 改为 showInfo
  const type = props.type || props.status

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
            <div className={`${prefix}__text--inside`}>
              {content || `${percent}%`}
            </div>
          )}
          {tooltip}
        </div>
        {showInfo && placement === 'outside' && (
          <div className={`${prefix}__text ${prefix}__text--${type}`}>{content || `${percent}%`}</div>
        )}
      </div>
      {showInfo && placement === 'outside' && (
        <div className={`${prefix}__text ${prefix}__text--${type}`}>
          {content || `${percent}%`}
        </div>
      )}
    </div>
  )
}
