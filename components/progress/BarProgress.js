import React from 'react'
import Classnames from 'classnames'

export default class BarProgress extends React.Component {
  textRef = React.createRef()
  state = { insidePlacement: 'right' }

  componentDidMount() {
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

    const _content = typeof content !== 'undefined' ? content : text // // api 兼容 1.x 为 text 2.x 改为 content
    const _showInfo = typeof showInfo !== 'undefined' ? showInfo : withOutText // // api 兼容 1.x 为 withOutText 2.x 改为 showInfo
    const _type = type || status

    const percent = percentNum > 0 ? percentNum : 0
    return (
      <div>
        <div className={`${prefix}__inner`} style={{ width: this.getWidth() + 'px', height: this.getHeight() + 'px' }}>
          <div
            className={Classnames(`${prefix}__bar ${prefix}__bar--${_type}`, {
              [`${prefix}__bar--active`]: active
            })}
            style={{ width: `${percent}%` }}
          >
            {_showInfo && placement === 'inside' && this.getHeight() >= 14 && (
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
