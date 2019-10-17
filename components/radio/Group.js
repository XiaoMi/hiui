import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import Provider from '../context'
import Radio from './Radio'
import Button from '../button'

const prefixCls = 'hi-radio-group'

class Group extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: getData(props), originValue: props.value, originData: props.data }
  }
  static getDerivedStateFromProps (nextProps, state) {
    if (!isEqual(nextProps.value, state.originValue)) {
      return { data: getData(nextProps), originValue: nextProps.value }
    }
    if (!isEqual(nextProps.data, state.originData)) {
      return { data: getData(nextProps), originData: nextProps.data }
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
      isValueEquel && (callbackValue = value)
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
    const { className, style, disabled, type, placement } = this.props
    const { data } = this.state
    const groupCls = classNames(className, prefixCls, { vertical: placement === 'vertical' })
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
      checked: _value === value || Number(_value) === value
    }
  })
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
