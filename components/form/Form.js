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
  const { children, className, style, formRef } = props
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

  // 对整个表单进行校验
  const validate = cb => {
    let valid = true
    let count = 0
    const fieldModel = {}
    if (fields.length === 0 && cb) {
      cb(valid)
      return
    }
    fields.forEach(fieldChild => {
      const { field, value } = fieldChild
      fieldModel[field] = value
      fieldChild.validate('', errors => {
        if (errors) {
          valid = false
        } else {
          cb instanceof Function &&
            ++count === fields.length &&
            cb(valid, fieldModel)
        }
      })
    })
  }

  const validateField = (key, cb) => {
    const field = fields.filter(fieldChild => fieldChild.field === key)[0]
    if (!field) {
      throw new Error('must call validate Field with valid key string!')
    }

    field.validate('', cb)
  }
  // 重置校验
  const resetValidates = useCallback(() => {
    fields.forEach(field => {
      field.resetValidate()
    })
  }, [fields])

  useEffect(() => {
    formRef.current = {
      resetValidates,
      validateField,
      validate
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
          initFields
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
