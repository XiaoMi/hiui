import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Button from '../button/index'
import './style/index'

const parse = (checked, list, disabled) => {
  let _checked = -1
  const _disabled = []
  if (typeof checked === 'number') {
    _checked = checked
  }
  if (typeof disabled === 'number') {
    _disabled.push(disabled)
  }
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (typeof item === 'object') {
      if (item.checked) {
        _checked = i
      }
      if (item.disabled) {
        _disabled.push(i)
      }
      if (typeof checked === 'function') {
        if (checked(item)) {
          _checked = i
        }
      }
      if (typeof disabled === 'function') {
        if (disabled(item)) {
          _disabled.push(i)
        }
      }
    }
  }
  return {
    checked: _checked,
    disabled: _disabled
  }
}
class Radio extends Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: 0,
      disabled: []
    }
  }
  componentDidMount () {
    let { checked, list, disabled } = this.props
    this.setState(parse(checked, list, disabled))
  }
  static propTypes = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]),
    list: PropTypes.array,
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    align: PropTypes.oneOf(['left', 'right']),
    layout: PropTypes.oneOf(['horizontal', 'vertical']),
    mode: PropTypes.oneOf(['normal', 'button'])
  }

  static defaultProps = {
    list: [],
    checked: -1,
    align: 'right',
    layout: 'horizontal',
    mode: 'normal',
    buttonStyle: 'default'
  }
  componentWillReceiveProps (props, state) {
    if (props.checked !== this.props.checked) {
      this.setState({
        checked: parse(props.checked, props.list, props.disabled).checked
      })
    }
  }
  generateUUID () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
  }
  handleChange (item, index, disabled) {
    if (disabled) return
    this.setState(
      {
        checked: index
      },
      () => {
        if (this.props.onChange) {
          const value = item.id || item.id === 0 ? item.id : item.name
          this.props.onChange(value, index, item)
        }
      }
    )
  }
  render () {
    let { list, align, layout, mode, buttonStyle } = this.props
    const { checked, disabled } = this.state
    const cls = classnames(
      'hi-radio',
      layout === 'vertical' && 'hi-radio--vertical',
      mode === 'button' && 'hi-radio--button'
    )
    return (
      <div className={cls}>
        {list.map((item, index) => {
          let _item = item
          if (typeof item === 'string') {
            _item = {
              name: item,
              id: ''
            }
          }
          const _disabled = disabled.indexOf(index) > -1
          const itemCls = classnames(
            'hi-radio__item',
            _disabled && 'hi-radio__item--disabled',
            checked === index && 'hi-radio__item--checked'
          )
          const eles = [
            <span className='hi-radio__label' key={'label' + index}>
              {_item.name}
            </span>,
            <span className='hi-radio__simulation-input' key={'input' + index} />
          ]
          return (
            <div
              className={itemCls}
              key={index}
              onClick={this.handleChange.bind(this, _item, index, _disabled)}
            >
              {mode === 'normal' ? (
                <React.Fragment>{align === 'left' ? eles : eles.reverse()}</React.Fragment>
              ) : (
                <Button
                  type={buttonStyle}
                  disabled={_disabled}
                  onClick={e => this.handleChange.bind(this, _item, index, _disabled)}
                >
                  {_item.name}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

export default Radio
