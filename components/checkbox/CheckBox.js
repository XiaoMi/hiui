import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Base from './Base'
import MultipleCheckboxsOpera from './common'
class CheckBox extends Component {
  static _type = 'CheckBox'
  static propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    list: PropTypes.array
  }
  static defaultProps = {
    checked: false,
    value: ''
  }
  renderCheckBoxGroup (list) {
    return <div>
      {
        list && list.map((item, index) => {
          if (typeof item === 'object') {
            const {value, text, checked, disabled} = item
            return <Base
              ref={el => {
                this.props.name && MultipleCheckboxsOpera.add(this.props.name, el)
              }}
              content={text || ''}
              value={value || text}
              checked={checked}
              disabled={disabled}
              key={index}
              onChange={this.props.onChange}
              name={this.props.name}
            />
          } else if (typeof item === 'string') {
            return <Base
              ref={el => {
                this.props.name && MultipleCheckboxsOpera.add(this.props.name, el)
              }}
              content={item || ''}
              value={item || ''}
              checked={false}
              disabled={false}
              key={index}
              onChange={this.props.onChange}
              name={this.props.name}
            />
          }
        })
      }
    </div>
  }
  render () {
    const {list, checked, disabled, text, children, value, name, all, onChange} = this.props
    if (list) {
      return this.renderCheckBoxGroup(list)
    }
    return <Base
      ref={el => {
        this.props.name && MultipleCheckboxsOpera.add(this.props.name, el)
        this.props.all && MultipleCheckboxsOpera.addRoot(this.props.all, el)
      }}
      content={text || children}
      value={value || text || children}
      checked={checked}
      disabled={disabled}
      name={name}
      all={all}
      onChange={onChange}
    />
  }
}

export default CheckBox
