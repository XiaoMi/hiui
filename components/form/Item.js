import React, { useContext, useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import AsyncValidator from 'async-validator'
import PropTypes from 'prop-types'
import { depreactedPropsCompat } from '../_util'
import { FormContext } from './Form'
/**
 * rules 中 如果trigger 不传入 则 在最后点击时候时候校验规则
 * model 删除掉这个属性
 * 通过cloneEelement对value进行受控
 */

const FormItem = props => {
  const { updateFieldValue, formProps, removeField, initFields } = useContext(
    FormContext
  )
  const {
    children,
    label,
    required,
    className,
    showColon: shouldItemShowColon,
    style,
    field,
    valuePropName = 'value'
  } = props
  const {
    showColon: shouldFormShowColon,
    initialValues = {},
    localeDatas: {
      form: { colon }
    }
  } = formProps || {}
  // 初始化FormItem的内容
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [validating, setValidating] = useState(false)

  const resetValidate = () => {
    setError('')
    setValidating(false)
  }
  // 跟新值到父级元素
  const updateFieldToParent = _value => {
    updateFieldValue({
      field,
      value: _value,
      rules: getRules(),
      resetValidate,
      setValue,
      validate
    })
  }

  // 获取该单元的规则
  const getRules = () => {
    const selfRules = required
      ? Object.assign({}, props.rules, { required })
      : props.rules
    let formRules = formProps.rules

    formRules = formRules ? formRules[props.field] : []
    return [].concat(selfRules || formRules || [])
  }
  // 过滤含有该trigger触发方式的rules
  const getFilteredRule = trigger => {
    const rules = getRules()
    return rules.filter(rule => {
      return !rule.trigger || rule.trigger.indexOf(trigger) !== -1
    })
  }

  const validate = (trigger, cb) => {
    const triggerRules = getFilteredRule(trigger)
    if (!triggerRules || triggerRules.length === 0) {
      if (cb instanceof Function) {
        cb()
      }
      return true
    }
    let rules = getRules()
    const validator = new AsyncValidator({
      [field]: rules
    })
    const model = { [field]: value }
    validator.validate(
      model,
      {
        firstFields: true
      },
      errors => {
        setError(errors ? errors[0].message : '')
        setValidating(false)
        if (cb instanceof Function) {
          cb(errors)
        }
      }
    )
  }

  useEffect(() => {
    if (field) {
      initFields({
        field,
        value: initialValues && initialValues[field],
        rules: getRules(),
        resetValidate,
        setValue,
        validate
      })
      valueInit()
    }
    return () => {
      removeField({ field })
    }
  }, [])
  const valueInit = () => {
    setValue(initialValues && initialValues[field])
  }
  // 判断是否含有Rules
  const isRequired = () => {
    let rules = getRules()
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

  // 对字段的操作
  const handleField = (triggerType, _value) => {
    // 更新数据给父级
    updateFieldToParent(_value)
    let rules = getRules()
    const hasTriggerType = rules.some(rule => {
      const { trigger = '' } = rule
      return trigger.includes(triggerType)
    })
    hasTriggerType && validate(triggerType)
  }

  const labelWidth = () => {
    const labelWidth = props.labelWidth || formProps.labelWidth

    return formProps.labelPosition === 'top'
      ? false
      : labelWidth && parseInt(labelWidth)
  }

  const shouldShowColon =
    shouldItemShowColon === undefined
      ? shouldFormShowColon && typeof label === 'string' && label.trim()
      : shouldItemShowColon
  const obj = {}
  obj['hi-form-item__error'] = error !== ''
  obj['hi-form-item--validating'] = validating
  obj['hi-form-item--required'] = isRequired() || required

  return (
    <div className={classNames('hi-form-item', className, obj)} style={style}>
      {label || label === '' ? (
        <label className='hi-form-item__label' style={{ width: labelWidth() }}>
          {(typeof label === 'string' && label.trim()) || label}
          {shouldShowColon && colon}
        </label>
      ) : (
        <span className='hi-form-item__span' style={{ width: labelWidth() }} />
      )}
      <div className={'hi-form-item' + '__content'}>
        {children && Array.isArray(children)
          ? children
          : React.cloneElement(children, {
            [valuePropName]: value,
            onChange: (e, ...args) => {
              children.props.onChange && children.props.onChange(e, ...args)
              const value = e.target.value
              setValue(value)
              setTimeout(() => {
                handleField('onChange', value)
              })
            },
            onBlur: (e, ...args) => {
              children.props.onBlur && children.props.onBlur(e, ...args)
              const value = e.target.value
              setValue(value)
              setTimeout(() => {
                handleField('onBlur', value)
              })
            }
          })}
        <div className='hi-form-item--msg__error'>{error}</div>
      </div>
    </div>
  )
}

FormItem.propTypes = {
  field: PropTypes.string,
  rules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  required: PropTypes.bool,
  label: PropTypes.string,
  labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showColon: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
}

FormItem.defaultProps = {
  size: 'small'
}
export default depreactedPropsCompat([['field', 'prop']])(FormItem)
