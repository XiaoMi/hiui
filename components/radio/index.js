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
    // let _checked = -1
    // const _disabled = []
    let {checked, list, disabled} = this.props
    // if (typeof checked === 'number') {
    //   _checked = checked
    // }
    // if (typeof disabled === 'number') {
    //   _disabled.push(disabled)
    // }
    // for (let i = 0; i < list.length; i++) {
    //   const item = list[i]
    //   if (typeof item === 'object') {
    //     if (item.checked) {
    //       _checked = i
    //     }
    //     if (item.disabled) {
    //       _disabled.push(i)
    //     }
    //     if (typeof checked === 'function') {
    //       if (checked(item)) {
    //         _checked = i
    //       }
    //     }
    //     if (typeof disabled === 'function') {
    //       if (disabled(item)) {
    //         _disabled.push(i)
    //       }
    //     }
    //   }
    // }
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
    mode: 'normal'
  }
  componentWillReceiveProps (props, state) {
    this.setState({
      checked: parse(props.checked, props.list, props.disabled).checked
    })
  }
  generateUUID () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  }
  handleChange (item, index) {
    // console.log(labelText, index, event)
    // event.stopPropagation()
    this.setState({
      checked: index
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(item.id || item.name, index)
      }
    })
  }
  render () {
    let {list, name, align, layout, mode} = this.props
    const {checked, disabled} = this.state
    name = name || this.generateUUID()
    return (
      <div className='hi-radio'>
        {
          list.map((item, index) => {
            let _item = item
            if (typeof item === 'string') {
              _item = {
                name: item,
                id: ''
              }
            }
            const _disabled = disabled.indexOf(index) > -1
            const groupBtnCls = classnames(index !== 0 && 'after-radio', (index !== 0 && index !== list.length - 1) && 'middle-radio')
            const disabledCls = classnames(
              'input-group',
              _disabled && 'disabled',
              checked === index && 'checked',
              layout === 'vertical' && (mode === 'button' ? 'input-group-button-vertical' : 'input-group-vertical'),
              mode === 'button' && groupBtnCls,
              index === 0 && list.length > 1 && 'first-radio'
            )
            return (
              <label className={disabledCls} key={index}>
                {
                  mode === 'normal' ? [
                    align === 'left' && <span className='label' key={'label' + index}> {_item.name} </span>,
                    <span className='radio-input' key={'radio' + index}>
                      <span className='hi-raido-simulation-input' />
                      <input
                        className='hi-radio-origin-input'
                        type='radio'
                        name={name}
                        index={index}
                        disabled={_disabled}
                        value={_item.id}
                        defaultChecked={checked === index}
                        onClick={this.handleChange.bind(this, _item, index)}
                      />
                    </span>,
                    align === 'right' && <span className='label' key={'label' + index}> {_item.name} </span>
                  ] : <Button type='default' disabled={_disabled} onClick={(e) => this.handleChange(_item, index)}>{_item.name}</Button>
                }
              </label>
            )
          })
        }
      </div>
    )
  }
}

export default Radio
