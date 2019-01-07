/* @flow */

import React, { Component } from 'react'
import classNames from 'classnames'
import { getTextWidth } from './common.js'
export default class SelectInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: '',
      inputStyle: {
        width: '2px'
      }
    }
    this.inputItems = React.createRef()
  }

  focus () {
    setTimeout(() => this.searchInput && this.searchInput.focus(), 0)
  }

  handleKeywordChange (evt) {
    var val = evt.target.value
    this.setState({
      value: val,
      inputStyle: {
        width: getTextWidth(val) + 'px'
      }
    })
    this.props.onSearch(evt.target.value)
  }

  clearInput () {
    this.searchInput && (this.searchInput.value = '')
    this.setState({
      value: ''
    })
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
    this.clearInput()
  }

  renderMultiple () {
    let {
      placeholder,
      selectedItems,
      dropdownShow,
      disabled,
      searchable,
      clearable,
      selectedShowMode
    } = this.props
    let icon = dropdownShow ? 'up' : 'down'
    let {
      value,
      inputStyle
    } = this.state

    if (!selectedItems.length) {
      inputStyle = {width: '100%'}
    }
    // const containerWidth = container && container.offsetWidth || 1000
    // let totalWidth = 0
    return (
      <div className={classNames('hi-select__input', 'multiple-values', {disabled})} onClick={this.props.onClick}>
        {
          selectedItems.length === 0 && !value &&
          <div className='hi-select__input--placeholder'>
            {placeholder}
          </div>
        }
        <div className='hi-select__input--items' ref={this.inputItems}>
          {
            selectedShowMode === 'number'
              ? selectedItems.length > 0 && <div className='hi-select__input--item'>
                <div className='hi-select__input--item__name'>已选择 {selectedItems.length} 项</div>
              </div>
              : selectedItems.map((item, index) => {
                const _item = <div key={index} className='hi-select__input--item'>
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
                return _item
              })
          }
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
          <i className={classNames(`hi-icon icon-${icon} hi-select__input--icon__expand`, {clearable: clearable && selectedItems.length > 0})} />
          { clearable && selectedItems.length > 0 && <i className={`hi-icon icon-close-circle hi-select__input--icon__close`} onClick={this.handleClear.bind(this)} /> }
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
      searchable,
      clearable
    } = this.props
    placeholder = selectedItems.length > 0 ? selectedItems[0].name : placeholder
    let icon = dropdownShow ? 'up' : 'down'

    return (
      <div className={classNames('hi-select__input', 'single-value', {disabled})} onClick={this.props.onClick}>
        <div className={classNames('hi-select__input--item', {'hi-select__hide': !(!dropdownShow && selectedItems.length > 0)})}>
          <div className='hi-select__input--item__name'>{selectedItems[0] && selectedItems[0].name}</div>
        </div>
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
          <i className={classNames(`hi-icon icon-${icon} hi-select__input--icon__expand`, {clearable: clearable && selectedItems.length > 0})} />
          { clearable && selectedItems.length > 0 && <i className={`hi-icon icon-close-circle hi-select__input--icon__close`} onClick={this.handleClear.bind(this)} /> }
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
