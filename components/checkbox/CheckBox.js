import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Base from './Base'
import MultipleCheckboxsOpera from './common'
import isEqual from 'lodash/isEqual'
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
  componentWillReceiveProps (nextProps) {
    const groups = MultipleCheckboxsOpera.getAll(nextProps.name)
    const list = this.props.list
    const arr = []
    list && list.length > 0 && list.forEach((item) => {
      const value = item.value || item.text
      groups && groups.length > 0 && groups.forEach((g) => {
        if (g.state.value === value) {
          arr.push(g)
        }
      })
    })
    MultipleCheckboxsOpera.replace(nextProps.name, arr)
  }
  componentWillUnmount () {
    MultipleCheckboxsOpera.remove(this.props.name || this.props.all)
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.list && isEqual(this.props.list, nextProps.list)) {
      return false
    }
    return true
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
              key={(value || text)}
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
              key={item}
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
