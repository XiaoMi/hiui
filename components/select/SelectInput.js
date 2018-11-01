/* @flow */

import React, { Component } from 'react'
import classNames from 'classnames'
import { getTextWidth } from './common.js'
import './style/select-input.scss'

export default class SelectInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      inputStyle: {
        width: '2px'
      }
    }
  }

  focus () {
    setTimeout(() => this.searchInput && this.searchInput.focus(), 0)
  }

  handleKeywordChange (evt) {
    var val = evt.target.value
    this.setState({
      inputStyle: {
        width: getTextWidth(val) + 'px'
      }
    })
    this.props.onSearch(evt.target.value)
  }

  clearKeyword () {
    this.searchInput && (this.searchInput.value = '')
  }

  handleKeyDown (evt) {
    if (evt.keyCode === 13) {
      this.props.onEnterSelect()
    }

    if (evt.keyCode === 38) {
      evt.preventDefault()
      this.props.moveFocusedIndex('up')
    }
    if (evt.keyCode === 40) {
      evt.preventDefault()
      this.props.moveFocusedIndex('down')
    }
  }

  handleClear () {
    this.props.onClear()
    this.searchInput && (this.searchInput.value = '')
  }

  renderMultiple () {
    let {
      placeholder,
      selectedItems,
      dropdownShow,
      disabled,
      searchable,
      keyword
    } = this.props
    let icon = dropdownShow ? 'up' : 'down'
    let {
      inputStyle
    } = this.state

    if (!selectedItems.length) {
      inputStyle = {width: '100%'}
    }

    return (
      <div className={classNames('hi-select__input', 'multiple-values', {disabled})} onClick={this.props.onClick}>
        {
          selectedItems.length === 0 && !keyword &&
          <div className='hi-select__input--placeholder'>
            {placeholder}
          </div>
        }
        <div className='hi-select__input--items'>
          {selectedItems.map((item, index) => {
            return (
              <div key={index} className='hi-select__input--item'>
                <div className='hi-select__input--item__name'>{item.name}</div>
                <span
                  className='hi-select__input--item__remove'
                  onClick={e => {
                    this.props.onDelete(item)
                  }}
                >
                  <i className='hi-icon icon-close' />
                </span>
              </div>
            )
          })}
          {
            searchable && !disabled &&
            <div className='hi-select__input--search'>
              <input
                type='text'
                style={inputStyle}
                ref={input => {
                  this.searchInput = input
                }}
                onChange={this.handleKeywordChange.bind(this)}
                onKeyDown={this.handleKeyDown.bind(this)}
              />
            </div>
          }
        </div>
        <span className='hi-select__input--icon'>
          <i className={`hi-icon icon-${icon} hi-select__input--icon__expand`} />
          <i className={`hi-icon icon-close-circle hi-select__input--icon__close`} onClick={this.handleClear.bind(this)} />
        </span>
      </div>
    )
  }

  renderSingle () {
    let {
      placeholder,
      selectedItems,
      dropdownShow,
      disabled,
      searchable
    } = this.props
    placeholder = selectedItems.length > 0 ? selectedItems[0].name : placeholder
    let icon = dropdownShow ? 'up' : 'down'

    return (
      <div className={classNames('hi-select__input', 'single-value', {disabled})} onClick={this.props.onClick}>
        {
          !dropdownShow && selectedItems.length > 0 &&
          <div className='hi-select__input--item'>
            <div className='hi-select__input--item__name'>{selectedItems[0].name}</div>
          </div>
        }
        {
          (dropdownShow || selectedItems.length === 0) &&
          <div className='hi-select__input--search'>
            <input
              type='text'
              ref={input => {
                this.searchInput = input
              }}
              placeholder={placeholder}
              onChange={this.handleKeywordChange.bind(this)}
              onKeyDown={this.handleKeyDown.bind(this)}
              readOnly={disabled || !searchable}
            />
          </div>
        }
        <span className='hi-select__input--icon'>
          <i className={`hi-icon icon-${icon} hi-select__input--icon__expand`} />
          <i className={`hi-icon icon-close-circle hi-select__input--icon__close`} onClick={this.handleClear.bind(this)} />
        </span>
      </div>
    )
  }

  render () {
    let {
      mode
    } = this.props

    if (mode === 'multiple') {
      return this.renderMultiple()
    } else {
      return this.renderSingle()
    }
  }
}
