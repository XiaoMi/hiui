import React, { useEffect, useCallback, useReducer, forwardRef } from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import FormReducer, { FILEDS_UPDATE } from './FormReducer'
import FormContext from './FormContext'

const getClassNames = props => {
  const { labelPlacement, labelPosition, placement, inline, readOnly } = props
  const _className = {}

  if (labelPlacement || labelPosition) {
    _className[`hi-form--label--${labelPlacement || labelPosition}`] = true
  }
  if (placement === 'horizontal' || inline) {
    _className[`hi-form--inline`] = true
  }
  _className[`hi-form--readOnly`] = readOnly
  return _className
}


const InternalForm = props => {
  const {
    children,
    className,
    style,
    innerRef: formRef,
    initialValues,
    onValuesChange,
    _type // SchemaForm 内部配置变量
  } = props
  const [state, dispatch] = useReducer(FormReducer, {
    fields: [],
    ...props
  })
  const { fields } = state

  const removeField = useCallback(
    childrenFiled => {
      dispatch({
        type: FILEDS_UPDATE,
        payload: fields.filter(
          fieldItem => fieldItem.field !== childrenFiled.field
        )
      })
    },
    [fields]
  )
  // 用户手动设置表单数据
  const setFieldsValue = useCallback(
    values => {
      const _fields = _.cloneDeep(fields)
      _fields.forEach(item => {
        const { field } = item
        if (values.hasOwnProperty(field)) {
          const value = values[field]
          item.value = value
          item.setValue(value)
        }
      })
      dispatch({ type: FILEDS_UPDATE, payload: _fields })
    },
    [fields]
  )
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
        const value =
          toDefault && initialValues && initialValues[childrenField.field]
            ? initialValues[childrenField.field]
            : ''
        childrenField.value = value
        childrenField.resetValidate(value)
      })
      dispatch({ type: FILEDS_UPDATE, payload: _fields })
      cb instanceof Function && cb()
    },
    [fields, initialValues]
  )
  // 对整个表单进行校验
  const validate = useCallback(
    (cb, validateNames) => {
      const values = {}
      let errors = {}

      if (fields.length === 0 && cb) {
        cb(values, errors)
        return
      }

      const _fields = fields.filter(fieldChild => {
        const { field, value } = fieldChild
        values[field] = value
        return Array.isArray(validateNames)
          ? validateNames.includes(field)
          : true
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
    },
    [fields]
  )

  const validateField = useCallback(
    (key, cb) => {
      let value 
      const field = fields.filter(fieldChild => {
        if(fieldChild.field === key){
          value = fieldChild.value
          return true
        }
      })[0]

      if (!field) {
        throw new Error('must call validate Field with valid key string!')
      }

      field.validate('', (error)=>{
        cb && cb(error)
      },value)
    },
    [fields]
  )

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
      onSubmit={(e)=>{
        // 阻止只有一个表单时候；回车会触发form的提交操作
        e.preventDefault()
        return false
      }}
    >
      <FormContext.Provider
        value={{
          formProps: props,
          formState: state,
          dispatch: dispatch,
          removeField,
          fields,
          validate,
          resetValidates,
          onValuesChange,
          _type
        }}
      >
        {children}
      </FormContext.Provider>
    </form>
  )
}
InternalForm.propTypes = {
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
InternalForm.defaultProps = {
  size: 'small',
  showColon: true
}

const Form = forwardRef((props, ref) => {
  return <InternalForm {...props} innerRef={ref} />
})
export default Form
