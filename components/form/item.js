import React, {Component} from 'react'
import classNames from 'classnames'
import AsyncValidator from 'async-validator'
import PropTypes from 'prop-types'

class FormItem extends Component {
  static defaultProps = {
    prefixCls: 'hi',
    size: 'small',
    name: 'form-item'
  }

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
    const {prop} = this.props
    if (prop) {
      this.parent.addField(this)
      this.valueInit()
    }
  }

  componentWillUnmount () {
    this.parent.removeField(this)
  }

  valueInit () {
    const value = this.parent.props.model[this.props.prop]
    if (value === undefined) {
      this.initValue = value
    } else {
      this.initValue = JSON.parse(JSON.stringify(value))
    }
  }

  labelStyle () {
    const obj = {}

    if (this.parent.props.labelPosition === 'top') return obj

    const labelWidth = this.props.labelWidth || this.parent.props.labelWidth
    if (labelWidth) {
      obj.width = parseInt(labelWidth)
    }
    return obj
  }

  contentStyle () {
    const obj = {}

    if (this.parent.props.labelPosition === 'top') return obj

    const labelWidth = this.props.labelWidth || this.parent.props.labelWidth
    if (labelWidth) {
      obj.marginLeft = parseInt(labelWidth)
    }
    return obj
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
    const model = {[this.props.prop]: this.getfieldValue()}

    validator.validate(model, {
      firstFields: true
    }, errors => {
      this.setState({
        error: errors ? errors[0].message : '',
        validating: false,
        valid: !errors
      }, () => {
        if (cb instanceof Function) {
          cb(errors)
        }
      })
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
    this.validate('blur')
  }

  handleFieldChange () {
    setTimeout(() => {
      this.validate('change')
    })
  }

  render () {
    const {prefixCls, name, children, label, required} = this.props
    const {error, validating} = this.state

    const obj = {}
    obj[prefixCls + '-' + name] = true
    obj['is-error'] = error !== ''
    obj['is-validating'] = validating
    obj['is-required'] = this.isRequired() || required

    return (
      <div className={classNames(obj)} onBlur={this.handleFieldBlur.bind(this)} onChange={this.handleFieldChange.bind(this)}>
        {
          label && (
            <label className={prefixCls + '-' + name + '_label'} style={this.labelStyle()}>
              {label}
            </label>
          )
        }
        <div className={prefixCls + '-' + name + '__content'} style={this.contentStyle()}>
          {children}
          { error && <div className='hi-form-item__error'>{error}</div> }
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
  labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default FormItem
