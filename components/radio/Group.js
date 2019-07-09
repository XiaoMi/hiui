import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Provider from '../context'
import Radio from './Radio'
import Button from '../button'

const prefixCls = 'hi-radio-group'

class Group extends React.Component {
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
    let callbackValue
    const { onChange } = this.props
    const { data } = this.state
    const newData = data.map(({ value, checked, ...rest }) => {
      const isValueEquel =
        updatedValue === value || Number(updatedValue) === value
      if (isValueEquel) {
        callbackValue = value
      }
      return {
        value,
        checked: isValueEquel,
        ...rest
      }
    })
    onChange && onChange(callbackValue)
    hasValue(this.props) || this.setState({ data: newData })
  }
  render () {
    const { className, style, disabled, type } = this.props
    const { data } = this.state
    const groupCls = classNames(className, prefixCls)
    return (
      <GroupWrapper className={groupCls} style={style} type={type}>
        {data.map(({ label, value, checked, disabled: itemDisabled }, idx) => (
          <Radio
            key={idx}
            value={value}
            type={type}
            checked={checked}
            onChange={this.handleCheckboxChange}
            disabled={disabled || itemDisabled}
          >
            {label}
          </Radio>
        ))}
      </GroupWrapper>
    )
  }
}

function GroupWrapper ({ children, type, ...restProps }) {
  const shouldUseButton = type === 'button'
  return shouldUseButton ? (
    <Button.Group {...restProps}>{children}</Button.Group>
  ) : (
    <div {...restProps}>{children}</div>
  )
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
      const label = isPlain ? item : item.content
      const value = isPlain ? item : item.id
      const disabled = !isPlain && item.disabled
      return {
        label,
        value,
        disabled,
        checked: _value === value || Number(_value) === value
      }
    })
  }
}

const PropTypesOfStringOrNumber = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
])

Group.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  defaultValue: PropTypesOfStringOrNumber,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        content: PropTypesOfStringOrNumber,
        id: PropTypesOfStringOrNumber,
        disabled: PropTypes.bool
      })
    ])
  ),
  size: PropTypes.oneOf(['small', 'large']),
  type: PropTypes.oneOf(['default', 'button']),
  value: PropTypesOfStringOrNumber,
  onChange: PropTypes.func
}

Group.defaultProps = {}

export default Provider(Group)
