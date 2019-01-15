import React, {Component} from 'react'
import classNames from 'classnames'
import '../../checkbox/style'
export default class Checkbox extends Component {
  render () {
    let {
      checked,
      onChange,
      disabled,
      text = null,
      semi = false,
      onTitleClick
    } = this.props
    if (semi) {
      checked = false
    }
    return (
      <div style={{'position': 'relative'}} onClick={(e) => {
        if (disabled) {
          return
        }
        onChange(e, !checked)
      }} className={classNames({'hi-checkbox': true, 'hi-checkbox--part': semi, 'hi-checkbox--checked': checked, 'hi-checkbox--disabled': disabled})}>
        <span className='hi-checkbox__input' />
        {text && <span className='hi-checkbox__label' onClick={(e) => {
          onTitleClick && onTitleClick()
        }}>{text}</span>}
      </div>
    )
  }
}
