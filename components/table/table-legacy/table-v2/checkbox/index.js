import React, { Component } from 'react'
import classNames from 'classnames'
import Provider from '../../../../context'

import '../../../../checkbox/checkbox-legacy/style'
class Checkbox extends Component {
  render () {
    let {
      checked,
      onChange,
      disabled,
      text = null,
      semi = false,
      onTitleClick,
      highlight,
      theme
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
        className={classNames(`theme__${theme}`, {
          'hi-checkbox-legacy': true,
          'hi-checkbox-legacy--part': semi,
          'hi-checkbox-legacy--checked': checked,
          'hi-checkbox-legacy--disabled': disabled
        })}
      >
        <span className='hi-checkbox-legacy__input' />
        {text && (
          <span
            className={classNames({
              'hi-checkbox-legacy__label': true,
              highlight
            })}
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

export default Provider(Checkbox)
