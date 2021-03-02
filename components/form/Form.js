import React, { useEffect, useCallback, useReducer, forwardRef, useRef } from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Immutable, { FILEDS_UPDATE, FILEDS_UPDATE_LIST } from './FormReducer'
import FormContext from './FormContext'
import { transformValues } from './utils'

const getClassNames = (props) => {
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
const InternalForm = (props) => {
  const {
    children,
    className,
    style,
    innerRef: formRef,
    initialValues,
    onValuesChange,
    updateFormSchema,
    _type // SchemaForm 内部配置变量
  } = props
  const _Immutable = useRef(new Immutable())
  const [state, dispatch] = useReducer(_Immutable.current.FormReducer, {
    fields: [],
    listNames: [],
    listValues: {},
    ...props
  })

  const { fields, listNames, listValues } = state
  // 用户手动设置表单数据
  const setFieldsValue = useCallback(
    (values) => {
      const _fields = _Immutable.current.currentStateFields()
      _fields.forEach((item) => {
        const { field } = item
        // eslint-disable-next-line no-prototype-builtins
        if (values.hasOwnProperty(field)) {
          const value = values[field]
          item.value = value
          item.setValue(value)
        }
      })
      dispatch({
        type: FILEDS_UPDATE,
        payload: _fields.filter((item) => {
          return item._type !== 'list'
        })
      })
      // 处理 list value
      Object.keys(values).forEach((key) => {
        listNames.includes(key) &&
          dispatch({
            type: FILEDS_UPDATE_LIST,
            payload: Object.assign({}, { ...listValues }, { [key]: values[key] })
          })
      })
    },
    [fields, listValues]
  )
  // 转换值的输出
  const internalValuesChange = useCallback(
    (changeValues, allValues) => {
      const _transformValues = transformValues(allValues, fields)
      const _changeValues = _.cloneDeep(changeValues)

      Object.keys(changeValues).forEach((changeValuesKey) => {
        fields.forEach((filedItem) => {
          const { field, _type, listname } = filedItem
          if (field === changeValuesKey && _type === 'list') {
            _changeValues[listname] = _transformValues[listname]
            delete _changeValues[changeValuesKey]
          }
        })
      })

      onValuesChange && onValuesChange(_changeValues, _transformValues)
    },
    [onValuesChange, fields]
  )
  // 重置校验
  const resetValidates = useCallback(
    (cb, resetNames, toDefault) => {
      const changeValues = {}
      const cacheallValues = {}
      let _fields = _.cloneDeep(fields)
      fields.forEach((item) => {
        const { field, value } = item
        cacheallValues[field] = value
      })

      _fields = _fields.filter((childrenField) => {
        return Array.isArray(resetNames) ? resetNames.includes(childrenField.field) : true
      })

      _fields.forEach((childrenField) => {
        const value =
          toDefault && initialValues && initialValues[childrenField.field] ? initialValues[childrenField.field] : ''
        if (!_.isEqual(childrenField.value, value)) {
          changeValues[childrenField.field] = value
        }

        childrenField.value = value
        childrenField.resetValidate(value)
      })
      dispatch({ type: FILEDS_UPDATE, payload: _fields })
      cb instanceof Function && cb()
      // 比较耗性能
      internalValuesChange(changeValues, Object.assign({}, { ...cacheallValues }, { ...changeValues }))
    },
    [fields, initialValues, onValuesChange]
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
      const _fields = fields.filter((fieldChild) => {
        const { field, value } = fieldChild
        values[field] = value
        return Array.isArray(validateNames) ? validateNames.includes(field) : true
      })

      _fields.forEach((fieldChild) => {
        const { field, value } = fieldChild
        // 对指定的字段进行校验  其他字段过滤不校验
        fieldChild.validate(
          '',
          (error) => {
            if (error) {
              const errorsMsg = error.map((err) => {
                return err.message
              })
              errors[field] = { errors: errorsMsg }
            }
          },
          value
        )
      })
      errors = Object.keys(errors).length === 0 ? null : errors

      cb && cb(transformValues(values, _fields), errors)
    },
    [fields]
  )

  const validateField = useCallback(
    (key, cb) => {
      let value
      const field = fields.filter((fieldChild) => {
        if (fieldChild.field === key) {
          value = fieldChild.value
          return true
        }
      })[0]

      if (!field) {
        throw new Error('must call validate Field with valid key string!')
      }

      field.validate(
        '',
        (error) => {
          cb && cb(error)
        },
        value
      )
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
      setFieldsValue,
      updateFormSchema
    }
  }, [fields])

  return (
    <form
      className={classNames('hi-form', className, getClassNames(props))}
      style={style}
      onSubmit={(e) => {
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
          fields,
          validate,
          resetValidates,
          internalValuesChange,
          initialValues,
          _Immutable,
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
