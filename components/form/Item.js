import React, { useContext, useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import AsyncValidator from 'async-validator'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { depreactedPropsCompat } from '../_util'
import FormContext from './FormContext'
import { FILEDS_INIT, FILEDS_UPDATE, FILEDS_REMOVE } from './FormReducer'
import * as HIUI from '../'

// 指定子元素位置
const getItemPosition = (itemPosition) => {
  let _itemPosition = 'flex-end'
  switch (itemPosition) {
    case 'top':
      _itemPosition = 'flex-start'
      break
    case 'center':
      _itemPosition = 'center'
      break
    case 'bottom':
      _itemPosition = 'flex-end'
      break
    default:
      _itemPosition = 'center'
  }
  return _itemPosition
}

const FormItem = (props) => {
  const { formProps, formState, dispatch, internalValuesChange, listname, _type, _Immutable } = useContext(FormContext)
  const {
    children,
    label,
    required,
    className,
    showColon: shouldItemShowColon,
    style,
    field: propsField,
    valuePropName = 'value',
    contentPosition = 'center',
    name,
    listItemValue,
    sort
  } = props

  const {
    showColon: shouldFormShowColon,
    initialValues = {},
    localeDatas: {
      form: { colon }
    }
  } = formProps || {}
  // 初始化FormItem的内容
  const { fields } = formState
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const getItemfield = useCallback(() => {
    let _propsField = propsField
    if (_type === 'list' && name) {
      _propsField = _propsField + '#' + name
    }
    return Array.isArray(propsField) ? propsField[propsField.length - 1] : _propsField
  }, [propsField, name])

  const [field, setField] = useState(getItemfield())
  const [validating, setValidating] = useState(false)
  useEffect(() => {
    setField(getItemfield())
  }, [propsField])
  // 更新
  const updateField = useCallback(
    (_value, triggerType) => {
      const childrenFiled = {
        value: _value,
        ...updateFieldInfoToReducer()
      }

      if (childrenFiled.field) {
        const _fields = _.cloneDeep(_Immutable.current.currentStateFields())

        _fields.forEach((item) => {
          if (item.field === childrenFiled.field) {
            Object.assign(item, childrenFiled)
          }
        })
        const allValues = {}
        _fields.forEach((item) => {
          const { field, value } = item
          allValues[field] = value
        })
        dispatch({ type: FILEDS_UPDATE, payload: _fields })
        triggerType === 'onChange' && internalValuesChange({ [field]: _value }, allValues)
      }
    },
    [fields, formState, internalValuesChange]
  )

  const resetValidate = useCallback((value = '') => {
    // 清空数据
    setValue(value)
    setError('')
    setValidating(false)
  })

  // 获取该单元的规则
  const getRules = useCallback(() => {
    const selfRules = required ? Object.assign({}, props.rules, { required }) : props.rules
    let formRules = formProps.rules

    formRules = formRules ? formRules[field] : []
    return [].concat(selfRules || formRules || [])
  }, [props, formProps, required])
  // 过滤含有该trigger触发方式的rules
  const getFilteredRule = useCallback((trigger) => {
    const rules = getRules()
    return rules.filter((rule) => {
      return !rule.trigger || rule.trigger.indexOf(trigger) !== -1
    })
  })
  // 父级调用
  const validate = useCallback((trigger, cb, currentValue) => {
    const triggerRules = getFilteredRule(trigger)
    if (!triggerRules || triggerRules.length === 0) {
      if (cb instanceof Function) {
        cb()
      }
      return true
    }
    const rules = getRules()
    const validator = new AsyncValidator({
      [field]: rules
    })
    const model = { [field]: currentValue }
    validator.validate(
      model,
      {
        firstFields: true
      },
      (errors) => {
        setError(errors ? errors[0].message : '')
        setValidating(false)
        if (cb instanceof Function) {
          cb(errors)
        }
      }
    )
  })

  const updateFieldInfoToReducer = () => {
    return {
      field,
      rules: getRules(),
      resetValidate,
      setValue,
      validate,
      propsField,
      listname,
      sort,
      _type
    }
  }
  // initValue
  useEffect(() => {
    const isExist = fields.some((item) => {
      return item.field === field
    })
    if (field && !isExist) {
      let value = initialValues && initialValues[field] ? initialValues[field] : ''
      if (_type === 'list' && listItemValue) {
        value = typeof listItemValue[name] !== 'undefined' ? listItemValue[name] : listItemValue
      }
      dispatch({
        type: FILEDS_INIT,
        payload: {
          value: value,
          ...updateFieldInfoToReducer()
        }
      })
      setValue(value)
    }
    return () => {
      _type !== 'list' && dispatch({ type: FILEDS_REMOVE, payload: field })
    }
  }, [field])

  // 判断是否含有Rules
  const isRequired = useCallback(() => {
    const rules = getRules()
    let isRequired = false

    if (rules && rules.length) {
      rules.every((rule) => {
        if (rule.required) {
          isRequired = true
          return false
        }
        return true
      })
    }
    return isRequired
  })

  // 对字段的操作
  const handleField = useCallback(
    (triggerType, currentValue) => {
      // 同步数据 reducer
      updateField(currentValue, triggerType)
      const rules = getRules()
      const hasTriggerType = rules.some((rule) => {
        const { trigger = '' } = rule
        return trigger.includes(triggerType)
      })
      hasTriggerType && validate(triggerType, '', currentValue)
    },
    [fields, formState]
  )

  const labelWidth = useCallback(() => {
    const labelWidth = props.labelWidth || formProps.labelWidth
    return formProps.labelPlacement === 'top'
      ? '100%'
      : !Number.isNaN(Number(labelWidth))
      ? Number(labelWidth)
      : labelWidth
  }, [props.labelWidth, formProps.labelWidth])

  const setEvent = (eventName, component, componentProps, e, ...args) => {
    const beObject = Object.prototype.toString.call(e) === '[object Object]'
    beObject && Object.prototype.toString.call(e.persist) === '[object Function]' && e.persist()
    const displayName = component && component.type && component.type.displayName

    const _props = componentProps || children.props
    eventName === 'onChange' && _props.onChange && _props.onChange(e, ...args)
    eventName === 'onBlur' && _props.onBlur && _props.onBlur(e, ...args)
    let value =
      beObject && e.target && Object.prototype.hasOwnProperty.call(e.target, valuePropName)
        ? e.target[valuePropName]
        : e
    if (displayName === 'Counter') {
      value = args[0]
    }
    setValue(value)
    handleField(eventName, value)
  }

  // jsx渲染方式
  const renderChildren = () => {
    const { component, componentProps } = props

    let _value = value
    if (_type === 'list') {
      const _fields = _.cloneDeep(fields)
      _fields.forEach((item) => {
        if (item.field === field) {
          _value = item.value
        }
      })
    }
    // 对ScheamaForm表单Item进行特殊处理
    if (_type === 'SchemaForm' && component) {
      if (HIUI[component]) {
        const HIUIComponent = HIUI[component]
        return React.createElement(HIUIComponent, {
          ...componentProps,
          [valuePropName]: _value,
          onChange: (e, ...args) => {
            setEvent('onChange', HIUIComponent, componentProps, e, ...args)
          },
          onBlur: (e, ...args) => {
            setEvent('onBlur', HIUIComponent, componentProps, e, ...args)
          }
        })
      } else {
        throw new Error('not found ' + component)
      }
    }
    if (!children) {
      return null
    }
    console.log('render item to state')
    return Array.isArray(children) || !React.isValidElement(children)
      ? children
      : React.cloneElement(children, {
          [valuePropName]: _value,
          onChange: (e, ...args) => {
            setEvent('onChange', children, '', e, ...args)
          },
          onBlur: (e, ...args) => {
            setEvent('onBlur', children, '', e, ...args)
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
  const _labelWidth = labelWidth()
  const contentWidth = formProps.labelPlacement === 'top' ? '100%' : `calc(100% - ${_labelWidth}px)`
  return (
    <div className={classNames('hi-form-item', className, obj)} style={style} key={field}>
      {console.log('render item')}
      {label || label === '' ? (
        <label className="hi-form-item__label" style={{ width: _labelWidth }} key={field + 'label'}>
          {(typeof label === 'string' && label.trim()) || label}
          {shouldShowColon && colon}
        </label>
      ) : (
        <span className="hi-form-item__span" style={{ width: _labelWidth }} key={field + 'label'} />
      )}
      <div className={'hi-form-item' + '__content'} key={field + '__content'} style={{ width: contentWidth }}>
        <div className={'hi-form-item' + '__children'} style={{ alignItems: getItemPosition(contentPosition) }}>
          {renderChildren()}
        </div>
        <div
          className={classNames('hi-form-item--msg__error', {
            'hi-form-item--msg__error__show': error !== ''
          })}
          key={field + 'error'}
        >
          {error}
        </div>
      </div>
    </div>
  )
}

FormItem.propTypes = {
  field: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
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
