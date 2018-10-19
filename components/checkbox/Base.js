import React, { Component } from 'react'
import classnames from 'classnames'
class Base extends Component {
  static propTypes = {
  }
  static defaultProps = {
    checked: false
  }
  constructor (props) {
    super(props)
    this.state = {
      checked: props.checked,
      selectStatus: 'none'
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount () {
  }
  componentWillReceiveProps (nextProps) {
    if ('checked' in nextProps) {
      this.setState({
        checked: nextProps.checked
      })
    }
  }
  handleChange (e) {
    // e.persist()
    let {disabled, onChange, falseValue, all, name} = this.props
    onChange = onChange || (() => {})
    let tar = e.target
    const isChecked = tar.checked
    let val = tar.value
    if (disabled) {
      return
    }
    if (falseValue && !isChecked) {
      val = falseValue
    }
    if (all) {
      let nList = document.querySelectorAll(`[name=${all}]`)
      let checkedList = []
      Array.from(nList).forEach(item => {
        if (item.disabled) {
          checkedList.push(item.value)
          return
        }
        item.setAttribute('all', 1)
        item.checked = !isChecked
        !item.disabled && item.click()
        isChecked && checkedList.push(item.value)
      })
      this.setState({
        checked: isChecked
      }, () => {
        // onChange(null, checkedList, name, true)
        onChange({
          value: checkedList,
          name,
          all: true,
          target: tar
        })
      })
      return
    }
    this.setState({
      checked: isChecked
    }, () => {
      let {selectStatus} = this.state
      let l1 = document.querySelectorAll(`[name=${name}]`)
      let l2 = document.querySelectorAll(`[name=${name}]:checked`)
      if (l1.length === l2.length) {
        selectStatus = 'all'
      }
      if (l2.length < l1.length) {
        selectStatus = 'part'
      }
      if (l2.length === 0) {
        selectStatus = 'none'
      }
      this.setState({
        selectStatus
      })
      const isParentChecked = tar.getAttribute('all')
      isParentChecked !== '1' && onChange({
        checked: isChecked,
        value: val,
        name,
        target: tar
      })
      tar.setAttribute('all', 0)
    })
  }
  render () {
    const {value, text, trueValue, disabled, children, name, all} = this.props
    const {selectStatus} = this.state
    const {checked} = this.state
    const checkedClass = classnames(
      'hi-checkbox-input',
      checked && 'hi-checkbox-input-checked'
    )
    const p = document.querySelector(`[all=${name}]`)
    const _checkedClass = classnames(
      'hi-checkbox-input',
      selectStatus && `hi-checkbox-input-${selectStatus}`
    )
    p && selectStatus && (p.parentNode.className = _checkedClass)
    const labelClass = classnames(
      'hi-checkbox',
      disabled && 'hi-checkbox-disabled'
    )
    let _value = trueValue || value || text || children
    return (
      <label
        className={labelClass}
      >
        <span
          className={checkedClass}
        >
          <input
            type='checkbox'
            className='hi-checkbox-origin-input'
            value={_value}
            all={all || ''}
            name={this.props.name}
            disabled={disabled}
            checked={this.state.checked}
            onChange={this.handleChange}
          />
        </span>
        <span className='hi-checkbox-label'>{text || children}</span>
      </label>
    )
  }
}

export default Base
