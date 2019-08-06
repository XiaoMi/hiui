import React, { Component } from 'react'
import classNames from 'classnames'
import '../../checkbox/checkbox-legacy/style'
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
        style={{ position: 'relative' }}
        onClick={e => {
          if (disabled) {
            return
          }
          onChange(e, !checked)
        }}
        className={classNames({
          'hi-checkbox-legacy': true,
          'hi-checkbox-legacy--part': semi,
          'hi-checkbox-legacy--checked': checked,
          'hi-checkbox-legacy--disabled': disabled
        })}
      >
        <span className='hi-checkbox-legacy__input' />
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
