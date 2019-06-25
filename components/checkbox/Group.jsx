import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Checkbox from './Checkbox'
import Provider from '../context'

const prefixCls = 'hi-checkbox-group'

class Group extends Component {
  constructor (props) {
    super(props)
    this.state = getData(props)
  }
  static getDerivedStateFromProps (nextProps) {
    if (hasValue(nextProps)) {
      return getData(nextProps)
    }
    return null
  }
  handleCheckboxChange = (event) => {
    const updatedValue = event.target.value
    const updatedChecked = event.target.checked
    const { onChange } = this.props
    const { data } = this.state
    const newData = data.map(({ value, checked, ...rest }) => {
      const isValueEquel = isNaN(Number(updatedValue))
        ? updatedValue === value
        : Number(updatedValue) === value
      return {
        value,
        checked: isValueEquel ? updatedChecked : checked,
        ...rest
      }
    })
    const checkedList = newData
      .filter(({ checked }) => checked)
      .map(({ value }) => value)
    onChange && onChange(checkedList)
    hasValue(this.props) || this.setState({ data: newData })
  }
  render () {
    const { className, name, disabled, style } = this.props
    const { data } = this.state
    const groupCls = classNames(prefixCls, className)
    return (
      <div className={groupCls} style={style}>
        {data.map(({ label, value, checked, disabled: itemDisabled }, idx) => (
          <Checkbox
            key={idx}
            value={value}
            name={name}
            disabled={disabled || itemDisabled}
            onChange={(_, event) => this.handleCheckboxChange(event)}
            {...{
              [hasValue(this.props) ? 'checked' : 'defaultChecked']: checked
            }}
          >
            {label}
          </Checkbox>
        ))}
      </div>
    )
  }
}

function hasValue (props) {
  const has = (key) => Object.prototype.hasOwnProperty.call(props, key)
  return has('value')
}

function getData (props) {
  const { data, value, defaultValue } = props
  const _value = hasValue(props) ? value : defaultValue
  return {
    data: data.map((item) => {
      const isPlain = typeof item === 'string'
      const label = isPlain ? item : item.label
      const value = isPlain ? item : item.value
      const disabled = !isPlain && item.disabled
      return {
        label,
        value,
        disabled,
        checked: (_value || []).includes(value)
      }
    })
  }
}

const PropTypesArrayOfStringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

Group.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        label: PropTypesArrayOfStringOrNumber,
        value: PropTypesArrayOfStringOrNumber,
        disabled: PropTypes.bool
      })
    ])
  ),
  defaultValue: PropTypes.arrayOf(PropTypesArrayOfStringOrNumber),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  value: PropTypes.arrayOf(PropTypesArrayOfStringOrNumber)
}

Group.defaultProps = {
  data: [],
  defaultValue: []
}

export default Provider(Group)
