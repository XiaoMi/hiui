import React, { Component } from 'react'
import PropTypes from 'prop-types'
import clickOutside from 'react-click-outside'
import classNames from 'classnames'
import Button from '../button/index'
import Popper from '../popper'
import Provider from '../context'
class Dropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  MENUTITLE = null
  static propTypes = {
    placement: PropTypes.oneOf(['top-start', 'bottom-start', 'top-bottom-start']),
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
    placement: 'top-bottom-start',
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
        trigger.forEach((en, index) => {
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
      return <Button type='default'>{title} &nbsp;<i className='hi-icon icon-down' /></Button>
    } else if (type === 'group') {
      return <div className='hi-dropdown__button-group'>
        <Button type='default' onClick={this.handlerClick.bind(this, {title})}>{title}</Button>
        <Button type='default' onClick={this.triggerEvent.bind(this)}><i className='hi-icon icon-down' /></Button>
      </div>
    } else {
      return <div className='hi-dropdown__title'>
        <span className='hi-dropdown__title-text'>{title}</span>
        <i className='hi-icon icon-down' />
      </div>
    }
  }

  render () {
    // splitButton，disabled
    const {list, width, prefix, suffix, theme, title, placement} = this.props
    const {visible} = this.state
    const ulCls = classNames('hi-dropdown__menu')
    return (
      <div className={`hi-dropdown theme__${theme}`} ref={el => { this.MENUTITLE = el }} style={{width: width}}>
        {this.renderTitle()}
        <Popper
          className='hi-dropdown__popper'
          show={visible}
          attachEle={this.MENUTITLE}
          zIndex={1060}
          placement={placement}
        >
          <ul className={ulCls}>
            {
              list.map((item, index) => {
                if (item.title === '-') {
                  // 分隔线
                  return <li className='hi-dropdown__divider' key={index} />
                }

                const liCls = classNames(
                  'hi-dropdown__item',
                  item.disabled && 'hi-dropdown__item--disabled',
                  String(item.title) === String(title) && 'hi-dropdown__item--active'
                )

                return <li className={liCls} key={index} onClick={this.handlerClick.bind(this, item)}>
                  {(prefix || item.prefix) && <div className='hi-dropdown__item-prefix'>{prefix || item.prefix}</div>}
                  <div className='hi-dropdown__item-title' title={item.title}>{item.title}</div>
                  {(suffix || item.suffix) && <div className='hi-dropdown__item-suffix'>{suffix || item.suffix}</div>}
                </li>
              })
            }
          </ul>
        </Popper>
      </div>
    )
  }
}

export default Provider(clickOutside(Dropdown))
