import React, {Component} from 'react'
import classNames from 'classnames'
import '../../checkbox/style'
export default class Checkbox extends Component {
  render () {
    const {
      checked,
      onChange,
      disabled
    } = this.props
    return (
      <div style={{'position': 'relative'}} onClick={(e) => {
        if (disabled) {
          return
        }
        onChange(e, !checked)
      }} className={classNames({'hi-checkbox': true, 'hi-checkbox--checked': checked, 'hi-checkbox--disabled': disabled})}>
        <span className='hi-checkbox__input' />
        <span style={{position: 'absolute', left: 0, top: 0}} className='hi-checkbox__label' />
      </div>
    )
  }
}
