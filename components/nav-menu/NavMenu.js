/**
 * @Author lishuaishuai <lishuaishuai@xiaomi.com>
 * @Date 2018-04-02 16:56:13
 * @Description NavMenu 导航菜单
 */
import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class NavMenu extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedKey: PropTypes.number,
    onClick: PropTypes.func,
    render: PropTypes.func
  }
  static defaultProps = {
    prefixCls: 'hi-navmenu',
    selectedKey: 0,
    selectedSubKey: -1,
    vertical: false,
    width: '100%'
  }
  constructor (props) {
    super(props)

    this.getH = null

    this.state = {
      selectedKey: props.selectedKey,
      selectedSubKey: props.selectedSubKey,
      toggleShow: false,
      toggleOn: false,
      subMenuShow: false,
      subMenuChildred: []
    }
    this.setToggle = this.setToggle().bind(this)
  }

  componentWillReceiveProps (props) {
    if (this.props.selectedKey !== props.selectedKey) {
      this.setState({
        selectedKey: props.selectedKey
      })
    }
  }

  componentDidMount () {
    const {
      selectedKey,
      data
    } = this.props
    if (selectedKey < data.length) {
      this.handleClick(data[selectedKey], selectedKey, 1)
    }
    this.getH && this.setToggleEvent(this.getH)
    window.addEventListener('resize', this.setToggle)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setToggle)
  }

  setToggleEvent (el) {
    const ulH = el.scrollHeight
    const {vertical} = this.props
    let toggleShow = false
    if (ulH > 50 && !vertical) {
      toggleShow = true
    }

    this.setState({ toggleShow })
  }

  setToggle () {
    let start = Date.now()
    const setToggleEvent = this.setToggleEvent.bind(this)

    return () => {
      const now = Date.now()
      if (now - start > 200 && this.getH) {
        setToggleEvent(this.getH)
        start = now
      }
    }
  }

  handleToggle = () => {
    this.setState({
      toggleOn: !this.state.toggleOn
    })
  }
  handleClick = (item, index, level, e) => {
    const { onClick } = this.props
    const { selectedKey, subMenuShow } = this.state
    const { disabled, children = [] } = item

    if (disabled) return

    if (level !== 2) {
      if (selectedKey === index) {
        this.setState({
          subMenuShow: !subMenuShow
        })
      } else {
        this.setState({
          subMenuShow: true
        })
      }
      this.setState({
        subMenuChildred: children,
        selectedKey: index,
        selectedSubKey: -1
      })
      onClick && e && onClick(e, String(index))
    } else {
      this.setState({
        selectedSubKey: index
      })
      onClick && e && onClick(e, `${selectedKey}-${index}`)
    }
  }
  renderMenuItem = () => {
    const { data, prefixCls, render } = this.props
    const { selectedKey } = this.state

    return data.map((item, index) => {
      const classes = classNames(`${prefixCls}__item`, {
        'on': selectedKey === index,
        'hi-navmenu__item--disabled': item.disabled
      })

      return (
        <li
          className={classes}
          key={index}
          onClick={this.handleClick.bind(this, item, index, 1)}
        >
          {render ? render(item) : item.title}
        </li>
      )
    })
  }
  renderSubMenuItem = () => {
    const { prefixCls, render } = this.props
    const { selectedSubKey, subMenuChildred } = this.state

    return subMenuChildred.map((item, index) => {
      const classes = classNames(`${prefixCls}__sub`, {
        'on': selectedSubKey === index,
        'hi-navmenu__item--disabled': item.disabled
      })

      return (
        <li
          className={classes}
          key={index}
          onClick={this.handleClick.bind(this, item, index, 2)}
        >
          {render ? render(item.title) : item.title}
        </li>
      )
    })
  }
  rednerTabContent = () => {
    const { prefixCls, children } = this.props
    const { selectedKey } = this.state
    return React.Children.map(children, (item, index) => {
      const tabCtxCls = classNames(`${prefixCls}__content-item`, item.props.className, {
        'hi-navmenu__content-item--show': selectedKey === index
      })
      return cloneElement(item, {
        className: tabCtxCls
      })
    })
  }
  render () {
    const {prefixCls, children, vertical, width} = this.props
    const {toggleOn, subMenuShow, toggleShow, subMenuChildred} = this.state
    const togClasses = classNames(`${prefixCls}__toggle`, {
      'hi-navmenu__toggle--show': toggleShow,
      'hi-navmenu__toggle--on': toggleOn
    })
    const ulClasses = classNames(`${prefixCls}__list`, {
      'hi-navmenu__list--vertical': vertical,
      'hi-navmenu__list--on': toggleOn
    })
    const subMenCls = classNames(`${prefixCls}__sublist`, {
      'hi-navmenu__sublist--on': subMenuShow
    })
    const _verticalStyle = vertical ? {width: typeof width === 'number' ? `${width}px` : width} : {}
    return (
      <div className={`${prefixCls}`}>
        <span
          className={togClasses}
          onClick={this.handleToggle}
        />
        <ul
          ref={arg => { this.getH = arg }}
          className={ulClasses}
          style={_verticalStyle}
        >
          {this.renderMenuItem()}
        </ul>
        {subMenuChildred.length > 0 && <div className={subMenCls}><ul>{this.renderSubMenuItem()}</ul></div>}
        {children && <div className={`${prefixCls}__content`}>{this.rednerTabContent()}</div>}
      </div>
    )
  }
}
export default NavMenu
