import React, { useContext, useState, useEffect, useCallback, useRef } from 'react'
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
  const { formProps, internalValuesChange, listname, _type, _Immutable } = useContext(FormContext)
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
    sort,
    uuid,
    column,
    row
  } = props

  const {
    showColon: shouldFormShowColon,
    initialValues = {},
    localeDatas: {
      form: { colon }
    }
  } = formProps || {}
  const _propsValue = children && children.props ? children.props[valuePropName] : ''
  // 初始化FormItem的内容
  const [value, setValue] = useState(_propsValue)
  const [error, setError] = useState('')
  const eventInfo = useRef()
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
    const { eventName, e, args, componentProps } = eventInfo.current || {}
    const _children = children || {}
    const _props = componentProps || _children.props
    eventName === 'onChange' && _props.onChange && _props.onChange(e, ...args)
    eventName === 'onBlur' && _props.onBlur && _props.onBlur(e, ...args)
    eventInfo.current = {}
  }, [value])

  useEffect(() => {
    setField(getItemfield())
  }, [propsField, name])
  // 兼容 2.x value
  useEffect(() => {
    if (typeof _propsValue !== 'undefined') {
      setValue(_propsValue)
      updateField(_propsValue)
    }
  }, [_propsValue, field])

  // 更新
  const updateField = (_value, triggerType) => {
    const childrenFiled = {
      value: _value,
      ...updateFieldInfoToReducer()
    }
    const { field } = childrenFiled
    if (field) {
      const _fields = _.cloneDeep(_Immutable.current.currentStateFields())
      _fields.forEach((item) => {
        if (item.field === field) {
          Object.assign(item, childrenFiled)
        }
      })
      const allValues = {}
      _fields.forEach((item) => {
        const { field, value } = item
        allValues[field] = value
      })
      _Immutable.current.setState({
        type: FILEDS_UPDATE,
        payload: _fields
      })
      triggerType === 'onChange' && internalValuesChange({ [field]: _value }, allValues)
    }
  }
  const resetValidate = useCallback((value = '') => {
    // 清空数据
    setValue(value)
    setError('')
    setValidating(false)
  })

  const clearValidate = useCallback(() => {
    // 清空数据
    setError('')
    setValidating(false)
  })

  // 获取该单元的规则
  const getRules = useCallback(() => {
    const selfRules = required ? Object.assign({}, props.rules, { required }) : props.rules
    let formRules = formProps.rules

    formRules = formRules ? formRules[field] : []
    // 修复 AsyncValidator 接收 jsx deepMerge 卡顿问题
    // https://github.com/yiminghe/async-validator/blob/bc18bca1d9422911dc5ac3ce2a99599821534bd9/src/util.js#L220
    const rulesArr = [].concat(selfRules || formRules || [])
    rulesArr.forEach((item) => {
      const { message } = item
      if (React.isValidElement(message)) {
        item.message = Object.assign({}, { ...message }, { _owner: null })
      }
    })
    return rulesArr.concat()
  }, [props, formProps, required, field])
  // 过滤含有该trigger触发方式的rules
  const getFilteredRule = useCallback(
    (trigger) => {
      const rules = getRules()
      return rules.filter((rule) => {
        return !rule.trigger || rule.trigger.indexOf(trigger) !== -1
      })
    },
    [getRules]
  )
  // 父级调用
  const validate = useCallback(
    /**
     * 触发Item校验
     * @param {Sting} trigger 触发事件 在什么情况下触发 'onChange, onBlur'
     * @param {Function} cb 自定义消息提示回调方法
     * @param {Any} currentValue 校验值
     * @param {Boolean} showError 静默检验，是否在界面中展示错误信息
     */
    (trigger, cb, currentValue, showError = true) => {
      const triggerRules = getFilteredRule(trigger)
      if (!triggerRules || triggerRules.length === 0) {
        if (cb instanceof Function) {
          cb()
        }
        return true
      }
      // Bug of `async-validator`
      const rules = getRules().map((item) => {
        if (currentValue !== '') {
          item.type = item.type || 'any'
        }
        return item
      })

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
          showError && setError(errors ? errors[0].message : '')
          setValidating(false)
          if (cb instanceof Function) {
            cb(errors)
          }
        }
      )
    },
    [props]
  )

  const updateFieldInfoToReducer = () => {
    return {
      field,
      rules: getRules(),
      resetValidate,
      setValue,
      clearValidate,
      validate,
      propsField,
      listname,
      sort,
      _type,
      uuid,
      column,
      row,
      name,
      updateField
    }
  }

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
  }, [getRules])

  // 对字段的操作
  const handleField = (triggerType, currentValue) => {
    // 同步数据 reducer
    updateField(currentValue, triggerType)
    const rules = getRules()
    const hasTriggerType = rules.some((rule) => {
      const { trigger = '' } = rule
      return trigger.includes(triggerType)
    })
    hasTriggerType && validate(triggerType, '', currentValue)
  }

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
    let value =
      beObject && e.target && Object.prototype.hasOwnProperty.call(e.target, valuePropName)
        ? e.target[valuePropName]
        : e
    if (displayName === 'Counter') {
      value = args[0]
    }
    eventInfo.current = { eventName, e, args, componentProps, value }
    handleField(eventName, value)
    setValue(value)
  }
  useEffect(() => {
    return () => {
      _type !== 'list' &&
        _Immutable.current.setState({
          type: FILEDS_REMOVE,
          payload: field
        })
    }
  }, [])
  // jsx渲染方式
  const renderChildren = () => {
    let _value = value
    const _fields = _Immutable.current.currentStateFields()
    const _field = _type === 'list' ? getItemfield() : field

    const isExist = _fields.some((item) => {
      return item.field === _field
    })
    if (_field && !isExist) {
      _value = initialValues && typeof initialValues[field] !== 'undefined' ? initialValues[_field] : _value
      if (_type === 'list' && listItemValue) {
        _value = Object.keys(listItemValue).includes(name) ? listItemValue[name] : listItemValue
      }
      _Immutable.current.setState({
        type: FILEDS_INIT,
        payload: {
          value: _value,
          ...updateFieldInfoToReducer(),
          field: _field
        }
      })
      updateField(_value)
    }

    const { component, componentProps } = props
    _fields.forEach((item) => {
      if (item.field === _field) {
        _value = item.value
      }
    })
    // 对ScheamaForm表单Item进行特殊处理
    if (_type === 'SchemaForm' && component) {
      if (HIUI[component]) {
        const HIUIComponent = HIUI[component]
        return React.createElement(HIUIComponent, {
          [valuePropName]: _value,
          ...componentProps,
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
    const propChild = children ? children.props : {}
    return Array.isArray(children) || !React.isValidElement(children)
      ? children
      : React.cloneElement(children, {
          [valuePropName]: _value,
          ...propChild,
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
  labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showColon: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
}

FormItem.defaultProps = {
  size: 'small'
}
export default depreactedPropsCompat([['field', 'prop']])(FormItem)
