import React, { useCallback, useReducer, forwardRef, useRef, useImperativeHandle } from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Immutable, { FILEDS_UPDATE, FILEDS_UPDATE_LIST, FILEDS_UPDATE_STATE, FILEDS_REMOVE_LIST } from './FormReducer'
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
    innerRef: formRef = useRef(),
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

  const { fields, listNames, listValues } = _Immutable.current.currentState()
  // 用户手动设置表单数据
  const setFieldsValue = useCallback(
    (values = {}, listcoordinate) => {
      const _values = _.cloneDeep(values)
      const _fields = _Immutable.current.currentStateFields()
      const { listNames } = _Immutable.current.currentState()
      _fields.forEach((item) => {
        const { field } = item
        // eslint-disable-next-line no-prototype-builtins
        if (_values.hasOwnProperty(field)) {
          const value = values[field]
          item.value = value
          item.setValue(value)
        }
      })
      _Immutable.current.setState({
        type: FILEDS_UPDATE,
        payload: _fields.filter((item) => {
          return item._type !== 'list'
        })
      })
      // 处理 list value
      Object.keys(_values).forEach((key) => {
        if (listNames.includes(key)) {
          _Immutable.current.setState({ type: FILEDS_REMOVE_LIST, payload: key })
          _Immutable.current.setState({
            type: FILEDS_UPDATE_LIST,
            payload: { [key]: _values[key] }
          })
        }
      })
      dispatch({ type: FILEDS_UPDATE_STATE })
    },
    [fields, listValues, listNames, _Immutable]
  )
  // 更新指定listItem的值
  const setListItemFieldsValue = useCallback(
    (listcoordinate = []) => {
      const _fields = _Immutable.current.currentStateFields()

      if (listcoordinate && listcoordinate.length) {
        listcoordinate.forEach((coordinate) => {
          _fields.forEach((item) => {
            const { name, row, listname, setValue, updateField } = item
            const { name: updateName, listname: updateListName, row: updateRow, value } = coordinate
            if (updateListName === listname && name === updateName && row === updateRow) {
              setValue(value)
              updateField(value)
            }
          })
        })
      }
    },
    [fields]
  )
  // 转换值的输出
  const internalValuesChange = useCallback(
    (changeValues, allValues) => {
      const fields = _Immutable.current.currentStateFields()
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
  // 移除表单项的校验结果
  const clearValidates = useCallback(
    (resetNames) => {
      let _fields = _Immutable.current.currentStateFields()
      _fields = _fields.filter((childrenField) => {
        return Array.isArray(resetNames) ? resetNames.includes(childrenField.field) : true
      })
      _fields.forEach((item) => {
        item.clearValidate()
      })
    },
    [_Immutable]
  )
  // 重置校验
  const resetValidates = useCallback(
    (cb, resetNames, toDefault) => {
      const changeValues = {}
      const allValues = {}
      let _fields = _Immutable.current.currentStateFields()
      const { listNames, listValues } = _Immutable.current.currentState()
      _fields = _fields.filter((childrenField) => {
        return Array.isArray(resetNames) ? resetNames.includes(childrenField.field) : true
      })

      _fields.forEach((item) => {
        const { field, listname } = item
        const changeFieldkey = listname || field
        const isToDefault = toDefault && initialValues && typeof initialValues[changeFieldkey] !== 'undefined'
        const value = isToDefault ? initialValues[field] : ''
        const changeFieldVal = isToDefault ? initialValues[changeFieldkey] : ''
        changeValues[changeFieldkey] = changeFieldVal
        allValues[changeFieldVal] = value
        item.value = value
        item.setValue(value)
        item.resetValidate(value)
      })
      _Immutable.current.setState({
        type: FILEDS_UPDATE,
        payload: _fields.filter((item) => {
          return item._type !== 'list'
        })
      })
      // 处理 list value
      Object.keys(initialValues || {}).forEach((key) => {
        if (listNames.includes(key)) {
          _Immutable.current.setState({ type: FILEDS_REMOVE_LIST, payload: key })
          _Immutable.current.setState({
            type: FILEDS_UPDATE_LIST,
            payload: Object.assign({}, { ...listValues }, { [key]: initialValues[key] })
          })
        }
      })
      dispatch({ type: FILEDS_UPDATE_STATE })
      cb instanceof Function && cb()
      // 比较耗性能
      onValuesChange && onValuesChange(changeValues, changeValues)
    },
    [fields, initialValues, onValuesChange, internalValuesChange, listNames, _Immutable]
  )
  const validate = useCallback(
    /**
     * 对整个表单进行校验
     * @param {Function} cb callback: (fields: Object, errors: Object) => void
     * @param {Array} validateNames fields:Array
     * @param {Boolean} showError 静默检验，是否在界面中展示错误信息
     */
    (cb, validateNames, showError = true) => {
      const values = {}
      let errors = {}
      const fields = _.cloneDeep(_Immutable.current.currentStateFields())
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
          value,
          showError
        )
      })
      errors = Object.keys(errors).length === 0 ? null : errors

      cb && cb(transformValues(values, _fields), errors)
    },
    [fields, _Immutable]
  )
  // 错误信息 不触发校验
  const getFieldsError = useCallback(
    (validateNames) => {
      const errors = {}
      const fields = _.cloneDeep(_Immutable.current.currentStateFields())
      const _fields = fields.filter((fieldChild) => {
        const { field } = fieldChild
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
          value,
          false
        )
      })
      return Object.keys(errors).length === 0 ? null : errors
    },
    [fields, _Immutable]
  )
  // 静态获取表单数据，不触发数据校验
  const getFieldsValue = useCallback(
    (validateNames) => {
      const values = {}
      const fields = _.cloneDeep(_Immutable.current.currentStateFields())
      if (fields.length === 0) {
        return
      }
      fields
        .filter((fieldChild) => {
          const { field } = fieldChild
          return Array.isArray(validateNames) ? validateNames.includes(field) : true
        })
        .forEach((item) => {
          const { field, value } = item
          values[field] = value
        })
      return transformValues(values, fields)
    },
    [fields, _Immutable]
  )

  const validateField = useCallback(
    (key, cb) => {
      let value
      const fields = _.cloneDeep(_Immutable.current.currentStateFields())
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
    [fields, _Immutable]
  )
  useImperativeHandle(formRef, () => ({
    resetValidates,
    validateField,
    validate,
    setFieldsValue,
    getFieldsValue,
    clearValidates,
    getFieldsError,
    updateFormSchema,
    setListItemFieldsValue
  }))
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
