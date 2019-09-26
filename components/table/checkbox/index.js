import React, { Component } from 'react'
import classNames from 'classnames'
import './style'
export default class Checkbox extends Component {
  render () {
    let {
      checked,
      onChange,
      disabled,
      text = null,
      semi = false,
      onTitleClick,
      highlight
    } = this.props
    if (semi) {
      checked = false
    }
    return (
      <div
        onClick={e => {
          if (disabled) {
            return
          }
          onChange(e, !checked)
        }}
        className={classNames({
          'hi-table-checkbox': true,
          'hi-table-checkbox--part': semi,
          'hi-table-checkbox--checked': checked,
          'hi-table-checkbox--disabled': disabled
        })}
      >
        <span className='hi-table-checkbox__input' />
        {text && (
          <span
            className={classNames({ 'hi-checkbox-legacy__label': true, highlight })}
            onClick={e => {
              onTitleClick && onTitleClick(e)
            }}
          >
            {text}
          </span>
        )}
      </div>
    )
  }
}
