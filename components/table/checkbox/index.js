import React, {Component} from 'react'
import classNames from 'classnames'
import '../../checkbox/style'
export default class Checkbox extends Component {
  render () {
    const {
      checked,
      onChange,
      disabled,
      text = null
    } = this.props
    return (
      <div style={{'position': 'relative'}} onClick={(e) => {
        if (disabled) {
          return
        }
        onChange(e, !checked)
      }} className={classNames({'hi-checkbox': true, 'hi-checkbox--checked': checked, 'hi-checkbox--disabled': disabled})}>
        <span className='hi-checkbox__input' />
        {text && <span className='hi-checkbox__label' >{text}</span>}
      </div>
    )
  }
}
