import React, { Component } from 'react'
import PropTypes from 'prop-types'
import clickOutside from 'react-click-outside'
import classNames from 'classnames'
import Button from '../button/index'
import '../button/style'
import './style'
class Dropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      listStyle: {
        top: '100%'
      }
    }
  }
  MENUTITLE = null
  LISTEL = null
  static propTypes = {
    trigger: PropTypes.oneOfType([
      PropTypes.oneOf(['contextmenu', 'click']),
      PropTypes.arrayOf(PropTypes.string)
    ]),
    onClick: PropTypes.func,
    list: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      onClick: PropTypes.func,
      prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }
  static defaultProps = {
    trigger: 'click',
    onClick: () => {},
    list: []
  }
  componentDidMount () {
    this.registerEvent()
  }
  registerEvent () {
    const {trigger, type} = this.props
    if (type !== 'group') {
      if (trigger instanceof Array) {
        trigger.map((en, index) => {
          this.MENUTITLE.addEventListener(en, (e) => {
            this.triggerEvent(e)
          }, false)
        })
      } else {
        this.MENUTITLE.addEventListener(trigger, (e) => {
          this.triggerEvent(e)
        }, false)
      }
    }
  }
  triggerEvent (e) {
    e && e.preventDefault()
    this.setState({
      visible: !this.state.visible
    }, () => {
      const ch = document.documentElement.clientHeight
      const mt = this.MENUTITLE.getBoundingClientRect().top
      const eh = this.LISTEL.offsetHeight
      // console.log(1, ch, mt, eh)
      const o = {top: '100%'}
      if (ch - mt - eh - 32 < 0) {
        o.top = -this.LISTEL.offsetHeight - 4
      }
      this.setState({
        listStyle: o
      })
    })
  }

  handleClickOutside () {
    if (this.state.visible) {
      this.setState({ visible: false })
    }
  }
  handlerClick (item) {
    if (item.disabled) {
      return false
    }
    this.setState({
      visible: false
    })
    if (item.onClick) {
      item.onClick(item.value || item.title)
      return false
    }
    this.props.onClick(item.value || item.title)
  }
  renderTitle () {
    const {type, title} = this.props
    if (type === 'button') {
      return <Button type='default' appearance='line'>{title} &nbsp;<i className='hi-icon icon-down' /></Button>
    } else if (type === 'group') {
      return <div className='hi-dropdow-group-button'>
        <Button type='default' appearance='line' onClick={this.handlerClick.bind(this, {title})}>{title}</Button>
        <Button type='default' appearance='line' onClick={this.triggerEvent.bind(this)}><i className='hi-icon icon-down' /></Button>
      </div>
    } else {
      return <div className='hi-dropdown-title'>
        <span className='hi-dropdown-title-text'>{title}</span>
        <i className='hi-icon icon-down' />
      </div>
    }
  }
  render () {
    // splitButton，disabled
    const {list, width, prefix, suffix} = this.props
    const {visible} = this.state
    const ulCls = classNames('hi-dropdown-menu', !visible && 'hide')
    return (
      <div className='hi-dropdown' ref={el => { this.MENUTITLE = el }} style={{width: width}}>
        {this.renderTitle()}
        <ul
          className={ulCls}
          ref={el => { this.LISTEL = el }}
          style={this.state.listStyle}
        >
          {
            list.map((item, index) => {
              if (item.title === '-') {
                // 分隔线
                return <li className='hi-dropdown-divider' key={index} />
              }
              let liCls = classNames('hi-dropdown-menu-item', item.disabled && 'disable')
              return <li className={liCls} key={index} onClick={this.handlerClick.bind(this, item)}>
                {(prefix || item.prefix) && <div className='hi-dropdown-menu-item-prefix'>{prefix || item.prefix}</div>}
                <div className='hi-dropdown-menu-item-title' title={item.title}>{item.title}</div>
                {(suffix || item.suffix) && <div className='hi-dropdown-menu-item-suffix'>{suffix || item.suffix}</div>}
              </li>
            })
          }
        </ul>
      </div>
    )
  }
}

export default clickOutside(Dropdown)
