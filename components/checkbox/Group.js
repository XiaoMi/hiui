import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Checkbox from './Checkbox'
import Provider from '../context'

const prefixCls = 'hi-checkbox-group'

class Group extends Component {
  constructor (props) {
    super(props)
    this.state = { data: getData(props), value: props.value }
  }
  static getDerivedStateFromProps (nextProps, state) {
    if (nextProps.value !== state.value || getData(nextProps) !== state.data) {
      return { data: getData(nextProps), value: nextProps.value }
    }
    return null
  }
  handleCheckboxChange = (event) => {
    const updatedValue = event.target.value
    const updatedChecked = event.target.checked
    const { onChange } = this.props
    const { data } = this.state
    const newData = data.map(({ value, checked, ...rest }) => {
      const isValueEquel =
        updatedValue === value || Number(updatedValue) === value
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
            onChange={this.handleCheckboxChange}
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
  return props.value !== undefined
}

function getData (props) {
  const { data, value, defaultValue } = props
  const _value = hasValue(props) ? value : defaultValue
  return data.map((item) => {
    const isPlain = ['string', 'number'].includes(typeof item)
    const label = isPlain ? item : item.content
    const value = isPlain ? item : item.id
    const disabled = !isPlain && item.disabled
    return {
      label,
      value,
      disabled,
      checked: (_value || []).includes(value)
    }
  })
}

const PropTypesArrayOfStringOrNumber = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
])

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
