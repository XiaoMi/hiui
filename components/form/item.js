import React, { Component } from 'react'
import classNames from 'classnames'
import AsyncValidator from 'async-validator'
import PropTypes from 'prop-types'

class FormItem extends Component {
  constructor (props, context) {
    super(props)

    this.state = {
      error: '',
      valid: false,
      validating: false
    }

    this.initValue = ''

    this.parent = context.component
  }

  componentDidMount () {
    const { prop } = this.props
    if (prop) {
      this.parent.addField(this)
      this.valueInit()
    }
  }

  componentWillUnmount () {
    this.parent.removeField(this.props.prop)
  }

  valueInit () {
    const value = this.parent.props.model[this.props.prop]
    if (value === undefined) {
      this.initValue = value
    } else {
      this.initValue = JSON.parse(JSON.stringify(value))
    }
  }

  getRules () {
    let formRules = this.parent.props.rules
    let selfRules = this.props.rules

    formRules = formRules ? formRules[this.props.prop] : []

    return [].concat(selfRules || formRules || [])
  }

  getFilteredRule (trigger) {
    const rules = this.getRules()
    return rules.filter(rule => {
      return !rule.trigger || rule.trigger.indexOf(trigger) !== -1
    })
  }

  getfieldValue () {
    const model = this.parent.props.model
    if (!model || !this.props.prop) {
      return
    }

    const keyList = this.props.prop.split(':')
    return keyList.length > 1 ? model[keyList[0]][keyList[1]] : model[this.props.prop]
  }

  validate (trigger, cb) {
    const rules = this.getFilteredRule(trigger)

    if (!rules || rules.length === 0) {
      if (cb instanceof Function) {
        cb()
      }

      return true
    }

    this.setState({
      validating: true
    })

    const validator = new AsyncValidator({
      [this.props.prop]: rules
    })
    const model = { [this.props.prop]: this.getfieldValue() }
    validator.validate(
      model,
      {
        firstFields: true
      },
      errors => {
        this.setState(
          {
            error: errors ? errors[0].message : '',
            validating: false,
            valid: !errors
          },
          () => {
            if (cb instanceof Function) {
              cb(errors)
            }
          }
        )
      }
    )
  }

  resetValidate () {
    this.setState({
      error: '',
      valid: true
    })
  }

  isRequired () {
    let rules = this.getRules()
    let isRequired = false

    if (rules && rules.length) {
      rules.every(rule => {
        if (rule.required) {
          isRequired = true
          return false
        }
        return true
      })
    }
    return isRequired
  }

  handleFieldBlur () {
    const hasOnBlur = this.getRules().some(rule => (rule.trigger || '').includes('onBlur'))
    if (hasOnBlur) {
      this.validate('onBlur')
    }
  }

  handleFieldChange () {
    const hasOnChange = this.getRules().some(rule => (rule.trigger || '').includes('onChange'))
    if (hasOnChange) {
      this.validate('onChange')
    }
  }

  get labelWidth () {
    const labelWidth = this.props.labelWidth || this.parent.props.labelWidth

    return this.parent.props.labelPosition === 'top' ? false : labelWidth && parseInt(labelWidth)
  }

  render () {
    const { children, label, required, className, showColon: shouldItemShowColon } = this.props
    const { showColon: shouldFormShowColon, localeDatas: {
      form: { colon }
    } } = this.parent.props
    const { error, validating } = this.state
    const shouldShowColon = shouldItemShowColon === undefined
      ? (shouldFormShowColon && typeof label === 'string' && label.trim())
      : shouldItemShowColon
    const obj = {}
    obj['hi-form-item__error'] = error !== ''
    obj['hi-form-item--validating'] = validating
    obj['hi-form-item--required'] = this.isRequired() || required

    return (
      <div className={classNames('hi-form-item', className, obj)}>
        {
          // 如果有真值或空字符串，都输出 label 占位
          (label || label === '') ? (
            <label className='hi-form-item__label' style={{ width: this.labelWidth }}>
              { typeof label === 'string' && label.trim() }{ shouldShowColon && colon }
            </label>
          ) : (
            <span style={{ width: this.labelWidth }} />
          )
        }
        <div className={'hi-form-item' + '__content'}>
          {Array.isArray(children) || !children
            ? children
            : React.cloneElement(children, {
              onChange: (...args) => {
                children.props.onChange && children.props.onChange(...args)
                setTimeout(() => {
                  this.handleFieldChange()
                })
              },
              onBlur: (...args) => {
                children.props.onBlur && children.props.onBlur(...args)
                setTimeout(() => {
                  this.handleFieldBlur()
                })
              }
            })}
          <div className='hi-form-item--msg__error'>{error}</div>
        </div>
      </div>
    )
  }
}

FormItem.contextTypes = {
  component: PropTypes.any
}

FormItem.propTypes = {
  prop: PropTypes.string,
  rules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  required: PropTypes.bool,
  label: PropTypes.string,
  labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showColon: PropTypes.bool
}

FormItem.defaultProps = {
  size: 'small'
}

export default FormItem
