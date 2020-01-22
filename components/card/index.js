import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'
import Provider from '../context'
class Card extends Component {
  constructor (props) {
    super(props)
    this.state = {
      extraShow: props.extraShow === 'stay' && props.extraType === 'default'
    }
  }
  render () {
    const {
      style,
      size,
      hoverable,
      title,
      extra,
      cover,
      coverUrl,
      description,
      content,
      children,
      disabled,
      extraShow,
      extraType,
      type,
      theme
    } = this.props
    const cls = classNames(
      'hi-card',
      `theme__${theme}`,
      hoverable && 'hi-card--hover',
      size && `hi-card--${size === 'default' ? 'middle' : size}`,
      disabled && 'hi-card--disabled',
      !cover && !coverUrl && type !== 'simple' && 'hi-card--padding',
      type === 'simple' && `hi-card--simple-${size === 'default' ? 'middle' : size}`
    )
    const headerCls = classNames('hi-card__header', !title && extra && 'hi-card__header--onlyextra')
    const coverCls = classNames(
      'hi-card__content',
      (cover || coverUrl) && 'hi-card__content--cover'
    )
    const extraCls = classNames('hi-card__extra', !this.state.extraShow && 'hi-card__extra--hide')
    const header = (title || extra) && (
      <div className={headerCls}>
        <div className='hi-card__title'>{title}</div>
        {extra && <div className={extraCls}>{extra}</div>}
      </div>
    )

    let body = (
      <React.Fragment>
        {header}
        <div className={coverCls}>{children}</div>
      </React.Fragment>
    )
    let coverDom = null
    if (cover || coverUrl) {
      coverDom = (
        <React.Fragment>
          {cover && React.cloneElement(cover, { style: { width: '100%' } })}
          {coverUrl && <img src={coverUrl} style={{ width: '100%' }} />}
          <div className={coverCls}>
            {header}
            {content || description}
          </div>
        </React.Fragment>
      )
    }
    if (type === 'simple') {
      body = <div className='hi-card__content hi-card__content--simple'>{children}</div>
      coverDom = null
    }
    return (
      <div
        className={cls}
        style={style}
        onMouseEnter={() => {
          (extraShow === 'hover' || extraType === 'hover') &&
            this.setState({
              extraShow: true
            })
        }}
        onMouseLeave={() => {
          (extraShow === 'hover' || extraType === 'hover') &&
            this.setState({
              extraShow: false
            })
        }}
      >
        {coverDom || body}
      </div>
    )
  }
}
Card.defaultProps = {
  hoverable: false,
  title: '',
  extra: '',
  extraShow: 'stay',
  extraType: 'default'
}
Card.propTypes = {
  // 支持三种宽度预设值 small -> 276px    middle -> 376px  large -> 576px，如果传入 style 则忽略该值，如果缺省 style 及 size 则默认100%
  size: PropTypes.oneOf(['small', 'default', 'middle', 'large']),
  // 一种简单的小卡片
  type: PropTypes.oneOf(['simple', 'default']),
  style: PropTypes.object,
  // 鼠标移入是否显示悬停态（浮起）
  hoverable: PropTypes.bool,
  // 卡片标题
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  // 扩展工具（出现在卡片右上角）
  extra: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
  // 封面图（图片卡片） 含有 cover 属性时，title 将会做为图片下文的 title，而不会出现在卡片左上角
  cover: PropTypes.element,
  // 用于图片卡片，做为描述
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // TODO: 废弃，使用 content
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  disabled: PropTypes.bool, // TODO: 废弃
  // 扩展按钮显示模式
  extraShow: PropTypes.oneOf(['stay', 'hover']), // TODO: 废弃，使用 extraType
  extraType: PropTypes.oneOf(['default', 'hover'])
}
export default Provider(Card)
