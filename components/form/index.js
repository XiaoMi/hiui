import React, {Component} from 'react'
import classNames from 'classnames'
import Item from './item'
import './style/index'
const PropTypes = require('prop-types')
class Form extends Component {
  static defaultProps = {
    prefixCls: 'hi',
    size: 'small',
    name: 'form',
    labelPosition: 'right'
  }

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

  getClass () {
    const {prefixCls, name, labelPosition, inline} = this.props

    const obj = {}

    obj[prefixCls + '-' + name] = true

    if (labelPosition) {
      obj[`${prefixCls}-${name}-label-${labelPosition}`] = true
    }

    if (inline) {
      obj[`${prefixCls}-${name}-inline`] = true
    }

    return obj
  }

  addField (field) {
    this.setState(prevState => ({
      fields: prevState.fields.concat(field)
    }))
  }

  removeField (field) {
    const {fields} = this.state
    fields.splice(fields.indexOf(field), 1)

    this.setState({
      fields
    })
  }

  validate (cb) {
    let valid = true
    let count = 0
    const fields = this.state.fields

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

  validateField (key, cb) {
    const field = this.state.fields.filter(field => field.props.prop === key)[0]

    if (!field) {
      throw new Error('must call validateField with valid key string!')
    }

    field.validate('', cb)
  }

  render () {
    const {children} = this.props

    return (
      <form className={classNames(this.getClass())}>
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
  onSubmit: PropTypes.func
}

Form.Item = Item

export default Form
