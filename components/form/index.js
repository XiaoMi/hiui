import React, { Component } from 'react'
import classNames from 'classnames'
import Item from './item'
import Provider from '../context'
import './style/index'
const PropTypes = require('prop-types')
class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fields: []
    }
  }

  getChildContext () {
    return {
      component: this
    }
  }

  getClassNames () {
    const { labelPosition, inline } = this.props

    const obj = {}

    if (labelPosition) {
      obj[`hi-form--label--${labelPosition}`] = true
    }

    if (inline) {
      obj[`hi-form--inline`] = true
    }

    return obj
  }

  addField (field) {
    this.setState((prevState) => ({
      fields: prevState.fields.concat(field)
    }))
  }

  removeField (prop) {
    this.setState((prevState) => {
      return {
        fields: prevState.fields.filter(function (field) {
          return field.props.prop !== prop
        })
      }
    })
  }

  validate (cb) {
    let valid = true
    let count = 0
    const fields = this.state.fields

    if (fields.length === 0 && cb) {
      cb(valid)
    }

    fields.forEach((field) => {
      field.validate('', (errors) => {
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

  validateField (key, cb) {
    const field = this.state.fields.filter(
      (field) => field.props.prop === key
    )[0]

    if (!field) {
      throw new Error('must call validate Field with valid key string!')
    }

    field.validate('', cb)
  }

  resetValidates () {
    this.state.fields.forEach((field) => {
      field.resetValidate()
    })
  }

  render () {
    const { children } = this.props

    return (
      <form className={classNames('hi-form', this.getClassNames())}>
        {children}
      </form>
    )
  }
}

Form.childContextTypes = {
  component: PropTypes.any
}

Form.propTypes = {
  model: PropTypes.object,
  rules: PropTypes.object,
  labelPosition: PropTypes.oneOf(['right', 'left', 'top']),
  labWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inline: PropTypes.bool,
  showColon: PropTypes.bool,
  onSubmit: PropTypes.func
}

Form.defaultProps = {
  size: 'small',
  labelPosition: 'right',
  showColon: true
}

const FormWrapper = Provider(Form)
FormWrapper.Item = Item

export default FormWrapper
