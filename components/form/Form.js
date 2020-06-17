import React, { Component, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

// Form hooks
const getClassNames = props => {
  const { labelPlacement, labelPosition, placement, inline } = props

  const obj = {}

  if (labelPlacement || labelPosition) {
    obj[`hi-form--label--${labelPlacement || labelPosition}`] = true
  }
  if (placement === 'horizontal' || inline) {
    obj[`hi-form--inline`] = true
  }

  return obj
}
export const FormContext = React.createContext({})
const Form = props => {
  const { children, className, style } = props
  const [fields, setFileds] = useState([])
  const addField = childrenFiled => {
    setFileds(fields.concat(childrenFiled))
  }
  const removeField = childrenFiled => {
    setFileds(
      fields.filter(fieldItem => fieldItem.field !== childrenFiled.field)
    )
  }

  const validate = cb => {
    let valid = true
    let count = 0
    if (fields.length === 0 && cb) {
      cb(valid)
    }

    fields.forEach(field => {
      field.validate('', errors => {
        if (errors) {
          valid = false
        } else {
          if (typeof cb === 'function' && ++count === fields.length) {
            cb(valid)
          }
        }
      })
    })
  }

  const validateField = (key, cb) => {
    const field = fields.filter(field => field.props.field === key)[0]
    if (!field) {
      throw new Error('must call validate Field with valid key string!')
    }

    field.validate('', cb)
  }

  const resetValidates = () => {
    fields.forEach(field => {
      field.resetValidate()
    })
  }

  return (
    <form
      className={classNames('hi-form', className, getClassNames(props))}
      style={style}
    >
      <FormContext.Provider
        value={{
          formProps: props,
          addField,
          removeField
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
