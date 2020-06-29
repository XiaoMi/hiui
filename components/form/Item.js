import React, { useContext, useState, useEffect } from 'react'
import classNames from 'classnames'
import AsyncValidator from 'async-validator'
import PropTypes from 'prop-types'
import { depreactedPropsCompat } from '../_util'
import { FormContext } from './Form'
import { FILEDS_INIT, FILEDS_UPDATE } from './FormReducer'
import * as HIUI from '../'

/**
 * valuePropName 指定该表单的value 名称
 * rules 中 如果trigger 不传入 则 在最后点击时候时候校验规则
 * model 删除掉这个属性
 * 通过cloneEelement对value进行受控
 */

const FormItem = props => {
  const { formProps, removeField, formState, dispatch, _type } = useContext(
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
  // 更新
  const updateField = _value => {
    const { fields } = formState
    const childrenFiled = {
      field,
      value: _value,
      rules: getRules(),
      resetValidate,
      setValue,
      validate
    }
    const _fields = _.cloneDeep(fields)
    _fields.forEach(item => {
      if (item.field === childrenFiled.field) {
        Object.assign(item, childrenFiled)
      }
    })
    dispatch({ type: FILEDS_UPDATE, payload: _fields })
  }
  const resetValidate = (value = '') => {
    // 清空数据
    setValue(value)
    setError('')
    setValidating(false)
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
  // 父级调用
  const validate = (trigger, cb, currentValue) => {
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
    const model = { [field]: currentValue }
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
      dispatch({
        type: FILEDS_INIT,
        payload: {
          field,
          value: initialValues && initialValues[field],
          rules: getRules(),
          resetValidate,
          setValue,
          validate
        }
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
  const handleField = (triggerType, currentValue) => {
    // 更新数据给父级
    updateField(currentValue)
    let rules = getRules()
    const hasTriggerType = rules.some(rule => {
      const { trigger = '' } = rule
      return trigger.includes(triggerType)
    })
    hasTriggerType && validate(triggerType, '', currentValue)
  }

  const labelWidth = () => {
    const labelWidth = props.labelWidth || formProps.labelWidth
    return formProps.labelPosition === 'top'
      ? '100%'
      : !Number.isNaN(Number(labelWidth)) && Number(labelWidth)
  }
  const setEvent = (eventName, e, ...args) => {
    e.persist && e.persist()
    eventName === 'onChange' &&
      children.props.onChange &&
      children.props.onChange(e, ...args)
    eventName === 'onBlur' &&
      children.props.onBlur &&
      children.props.onBlur(e, ...args)
    const value =
      e.target && e.target.hasOwnProperty(valuePropName)
        ? e.target[valuePropName]
        : e
    setValue(value)
    setTimeout(() => {
      handleField(eventName, value)
    })
  }
  const setEventBySchema = (eventName, componentProps, e, ...args) => {
    e.persist && e.persist()
    eventName === 'onChange' &&
      componentProps.onChange &&
      componentProps.onChange(e, ...args)
    eventName === 'onBlur' &&
      componentProps.onBlur &&
      componentProps.onBlur(e, ...args)
    const value =
      e.target && e.target.hasOwnProperty(valuePropName)
        ? e.target[valuePropName]
        : e
    setValue(value)
    setTimeout(() => {
      handleField(eventName, value)
    })
  }
  // jsx渲染方式
  const renderChildren = () => {
    const { component, componentProps } = props
    if (_type === 'SchemaForm' && component) {
      if (HIUI[component]) {
        const ChildTag = HIUI[component]
        return React.createElement(ChildTag, {
          ...componentProps,
          [valuePropName]: value,
          onChange: (e, ...args) => {
            setEventBySchema('onChange', componentProps, e, ...args)
          },
          onBlur: (e, ...args) => {
            setEventBySchema('onBlur', componentProps, e, ...args)
          }
        })
      } else {
        throw new Error('not found ' + component)
      }
    }
    if (!children) {
      return null
    }
    return Array.isArray(children) || !React.isValidElement(children)
      ? children
      : React.cloneElement(children, {
          [valuePropName]: value,
          onChange: (e, ...args) => {
            setEvent('onChange', e, ...args)
          },
          onBlur: (e, ...args) => {
            setEvent('onBlur', e, ...args)
          }
        })
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
    <div
      className={classNames('hi-form-item', className, obj)}
      style={style}
      key={field}
    >
      {label || label === '' ? (
        <label className='hi-form-item__label' style={{ width: labelWidth() }}>
          {(typeof label === 'string' && label.trim()) || label}
          {shouldShowColon && colon}
        </label>
      ) : (
        <span className='hi-form-item__span' style={{ width: labelWidth() }} />
      )}
      <div className={'hi-form-item' + '__content'}>
        {renderChildren()}
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
