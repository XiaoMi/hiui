import React from 'react'
import Classnames from 'classnames'

const defaultUnit = 'px'
const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n)

export default class BarProgress extends React.Component {
  textRef = React.createRef()
  barRef = React.createRef()

  state = { insidePlacement: 'right' }

  componentDidMount() {
    if (this.props.placement === 'inside') {
      const { barClientWidth } = this
      const { current: textElm } = this.textRef

      const isOver =
        textElm && textElm.clientWidth >= barClientWidth - ((barClientWidth * this.props.percent) / 100 + 5)
      const insidePlacement = isOver ? 'left' : 'right'

      this.setState({
        insidePlacement
      })
    }
  }

  get barClientWidth() {
    const { current: barElm } = this.barRef
    return barElm ? barElm.clientWidth : 0
  }

  get barClientHeight() {
    const { current: barElm } = this.barRef
    return barElm ? barElm.clientHeight : 0
  }

  get width() {
    const { width, size } = this.props
    const num = parseInt(width) || 0

    if (num <= 0) {
      const defaultNum = size === 'large' ? 480 : 160
      return defaultNum + defaultUnit
    }

    return isNumeric(width) ? width + defaultUnit : width
  }

  get height() {
    const { height, size } = this.props
    const num = parseInt(height) || 0

    if (num <= 0) {
      const defaultNum = size === 'large' ? 8 : size === 'default' ? 6 : 2
      return defaultNum + defaultUnit
    }

    return isNumeric(height) ? height + defaultUnit : height
  }

  render() {
    const prefix = 'hi-progress'
    const {
      percent: percentNum,
      content,
      type,
      showInfo,
      placement,
      tooltip = null,
      active,
      text,
      withOutText,
      status
    } = this.props
    const { width, height } = this

    const _content = typeof content !== 'undefined' ? content : text // // api 兼容 1.x 为 text 2.x 改为 content
    const _showInfo = typeof showInfo !== 'undefined' ? showInfo : withOutText // // api 兼容 1.x 为 withOutText 2.x 改为 showInfo
    const _type = type || status

    const percent = percentNum > 0 ? percentNum : 0
    return (
      <div>
        <div ref={this.barRef} className={`${prefix}__inner`} style={{ width, height }}>
          <div
            className={Classnames(`${prefix}__bar ${prefix}__bar--${_type}`, {
              [`${prefix}__bar--active`]: active
            })}
            style={{ width: `${percent}%` }}
          >
            {_showInfo && placement === 'inside' && this.barClientHeight >= 14 && (
              <div ref={this.textRef} className={`${prefix}__text--inside inside--${this.state.insidePlacement}`}>
                {_content || `${percent}%`}
              </div>
            )}
            {tooltip}
          </div>
        </div>
        {_showInfo && placement === 'outside' && (
          <div className={`${prefix}__text ${prefix}__text--${_type}`}>{_content || `${percent}%`}</div>
        )}
      </div>
    )
  }
}
