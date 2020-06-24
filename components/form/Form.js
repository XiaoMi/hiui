import React, { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import PropTypes from 'prop-types'

// Form hooks
const getClassNames = props => {
  const { labelPlacement, labelPosition, placement, inline } = props
  const _className = {}

  if (labelPlacement || labelPosition) {
    _className[`hi-form--label--${labelPlacement || labelPosition}`] = true
  }
  if (placement === 'horizontal' || inline) {
    _className[`hi-form--inline`] = true
  }
  return _className
}
export const FormContext = React.createContext({})
const Form = props => {
  const { children, className, style, innerRef: formRef, initialValues } = props
  const [fields, setFileds] = useState([])
  // 获取子节点的所有filed
  const initFields = childrenFiled => {
    setFileds(preState => {
      const isIncludes = preState.some(item => {
        return item.field === childrenFiled.field
      })
      return preState.concat(isIncludes ? [] : childrenFiled)
    })
  }
  // 更新所有子节点的
  const updateFieldValue = childrenFiled => {
    const _fields = _.cloneDeep(fields)
    _fields.forEach(item => {
      if (item.field === childrenFiled.field) {
        Object.assign(item, childrenFiled)
      }
    })
    setFileds(_fields)
  }
  const removeField = childrenFiled => {
    setFileds(
      fields.filter(fieldItem => fieldItem.field !== childrenFiled.field)
    )
  }
  // 用户手动设置表单数据
  const setFieldsValue = values => {
    const _fields = _.cloneDeep(fields)
    _fields.forEach(item => {
      const { field } = item
      if (values.hasOwnProperty(field)) {
        const value = values[field]
        item.value = value
        item.setValue(value)
      }
    })
    setFileds(_fields)
  }
  // 重置校验
  const resetValidates = useCallback(
    (cb, resetNames, toDefault) => {
      let _fields = _.cloneDeep(fields)
      _fields = _fields.filter(childrenField => {
        return Array.isArray(resetNames)
          ? resetNames.includes(childrenField.field)
          : true
      })
      _fields.forEach(childrenField => {
        childrenField.value = toDefault
          ? initialValues[childrenField.field]
          : ''
        childrenField.resetValidate(
          toDefault ? initialValues[childrenField.field] : ''
        )
      })
      setFileds(_fields)
      cb instanceof Function && cb()
    },
    [fields, initialValues]
  )
  // 对整个表单进行校验
  const validate = (cb, validateNames) => {
    const values = {}
    let errors = {}

    if (fields.length === 0 && cb) {
      cb(values, errors)
      return
    }

    const _fields = fields.filter(fieldChild => {
      const { field, value } = fieldChild
      values[field] = value
      return Array.isArray(validateNames) ? validateNames.includes(field) : true
    })
    _fields.forEach(fieldChild => {
      const { field, value } = fieldChild
      // 对指定的字段进行校验  其他字段直接提交
      fieldChild.validate(
        '',
        error => {
          if (error) {
            const errorsMsg = error.map(err => {
              return err.message
            })
            errors[field] = { errors: errorsMsg }
          }
        },
        value
      )
    })
    errors = Object.keys(errors).length === 0 ? null : errors
    cb && cb(values, errors)
  }

  const validateField = (key, cb) => {
    const field = fields.filter(fieldChild => fieldChild.field === key)[0]
    if (!field) {
      throw new Error('must call validate Field with valid key string!')
    }
    field.validate('', cb)
  }

  useEffect(() => {
    if (!formRef) {
      return
    }
    formRef.current = {
      resetValidates,
      validateField,
      validate,
      setFieldsValue
    }
  }, [fields])
  return (
    <form
      className={classNames('hi-form', className, getClassNames(props))}
      style={style}
    >
      <FormContext.Provider
        value={{
          formProps: props,
          updateFieldValue,
          removeField,
          initFields,
          fields,
          validate,
          resetValidates
        }}
      >
        {children}
      </FormContext.Provider>
    </form>
  )
}
Form.propTypes = {
  model: PropTypes.object,
  rules: PropTypes.object,
  labelPlacement: PropTypes.oneOf(['right', 'left', 'top']),
  labelPosition: PropTypes.oneOf(['right', 'left', 'top']),
  labWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placement: PropTypes.oneOf(['horizontal', 'vertical']),
  inline: PropTypes.bool,
  onSubmit: PropTypes.func,
  showColon: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
}
Form.defaultProps = {
  size: 'small',
  showColon: true
}

export default Form
