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
    this.groupRef = React.createRef(null)
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
  onKeyDown = (radioRef, radioIdx) => e => {
    if (e.keyCode === 32) {
      e.preventDefault()
      radioRef.current.click()
    }
    const { data } = this.state
    const prevArr = []
    const nextArr = []
    data.forEach((item, idx) => {
      if (!item.disabled) {
        if (idx < radioIdx) {
          prevArr.push(idx)
        }
        if (idx > radioIdx) {
          nextArr.push(idx)
        }
      }
    })

    let prev
    let next
    if (prevArr.length > 0) {
      prev = prevArr[prevArr.length - 1]
    } else if (prevArr.length === 0 && nextArr.length > 0) {
      prev = nextArr[nextArr.length - 1]
    }
    if (nextArr.length > 0) {
      next = nextArr[0]
    } else if (nextArr.length === 0 && prevArr.length > 0) {
      next = prevArr[0]
    }
    if([37, 38].includes(e.keyCode)) {
      e.preventDefault()
      this.groupRef.current && this.groupRef.current.querySelectorAll('.hi-radio')[prev].focus()
      this.groupRef.current && this.groupRef.current.querySelectorAll('.hi-radio')[prev].querySelector('input').click()
    }
    if([39, 40].includes(e.keyCode)) {
      e.preventDefault()
      this.groupRef.current &&  this.groupRef.current.querySelectorAll('.hi-radio')[next].focus()
      this.groupRef.current &&  this.groupRef.current.querySelectorAll('.hi-radio')[next].querySelector('input').click()
    }
  }

  // getDefaultFocus = data => {
  //   let idx, checkedIdx
  //   const _data = data.map((d, index)=> {
  //     // if ()
  //     return d.checked })

  //   if(_data.length === 0) {
  //     idx = data.findIndex(d => !d.disabled)
  //   }
  //   // if (_data.length === 1 && )
  //   return idx
  // }
  render () {
    const { className, style, disabled, type, placement } = this.props
    const { data } = this.state
    const groupCls = classNames(className, prefixCls, { vertical: placement === 'vertical' })
    // const defaultFocus = originValue === undefined && !disabled && data.findIndex(d=> !d.disabled)
    // 如果单选组没有选中项或选中项刚好也是禁用项，需要提供一个默认的可以获取焦点的项
    return (
      <GroupWrapper className={groupCls} style={style} type={type} ref={this.groupRef}>
        {data.map(({ label, value, checked, disabled: itemDisabled }, idx) => (
          <Radio
            key={idx}
            value={value}
            tabIdx={(checked && !disabled && !itemDisabled) ? 0 : -1}
            type={type}
            checked={checked}
            onChange={this.handleCheckboxChange}
            disabled={disabled || itemDisabled}
            onKeyDown={this.onKeyDown}
            index={idx}
          >
            {label}
          </Radio>
        ))}
      </GroupWrapper>
    )
  }
}

const GroupWrapper = React.forwardRef(({ children, type, ...restProps }, ref) => {
  const shouldUseButton = type === 'button'
  return shouldUseButton ? (
    <Button.Group {...restProps}>{children}</Button.Group>
  ) : (
    <div ref={ref} {...restProps}>{children}</div>
  )
})

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
