/* @flow */

import React, { Component } from 'react'
import './index.scss'

export default class CascaderInput extends Component {
  render () {
    const {
      value,
      clear,
      onClick,
      dropdownDisplay,
      placeholder,
      disabled
    } = this.props

    return (
      <div className={`cascader-input-container  ${disabled ? 'disabled' : ''}`}>
        <div
          className={`dropdown-expand ${dropdownDisplay ? 'active' : ''}`}
        >
          <input
            type='text'
            ref={input => {
              this.searchInput = input
            }}
            placeholder={placeholder}
            readOnly='true'
            className='cascader-input'
            onClick={onClick}
            value={value}
          />
          <i className={`hi-icon icon-${dropdownDisplay ? 'up' : 'down'} icon-mark_arrow`} />
          {
            (value || value === 0)
              ? (
                <i
                  className={`hi-icon icon-close-circle icon-mark_close-circle`}
                  onClick={e => {
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()

                    clear()
                  }}
                />
              ) : ''
          }
        </div>
      </div>
    )
  }
}
