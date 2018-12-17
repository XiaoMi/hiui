import React, {Component} from 'react'
import classNames from 'classnames'
import '../../checkbox/style'

export default class Checkbox extends Component {
  render () {
    const {
      checked,
      onChange,
      disabled = false
    } = this.props
    return (
      <label className={classNames({'hi-checkbox': true, 'hi-checkbox-disabled': disabled})}>
        <span className={classNames({'hi-checkbox-input': true, 'hi-checkbox-input-checked': checked})} >
          <input disabled={disabled} onChange={(e) => {
            if (disabled) {
              return
            }
            onChange(e)
          }} type='checkbox' className='hi-checkbox-origin-input' checked={checked} />
        </span>
      </label>
    )
  }
}
