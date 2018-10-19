import React, { Component } from 'react'
import SingleSelect from './singleSelect'
import CascaderSelect from './cascaderSelect'
import MultipleSelect from './multipleSelect'

import './index.scss'

class Select extends Component {
  renderSelect () {
    var mode = this.props.mode

    if (mode === 'single' || mode === 'label' || !mode) {
      return <SingleSelect {...this.props} />
    } else if (mode === 'cascader') {
      return <CascaderSelect {...this.props} />
    } else if (mode === 'multiple') {
      return <MultipleSelect {...this.props} />
    }
  }
  render () {
    const {
      style,
      disabled
    } = this.props

    return (
      <div className={`input-group hi-select ${disabled ? 'disabled' : ''}`} style={style}>
        {this.renderSelect()}
      </div>
    )
  }
}

export default Select
