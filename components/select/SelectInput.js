import React, { Component } from 'react'
import classNames from 'classnames'
import { getTextWidth } from './common.js'

class SelectInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showCount: 0,
      value: '',
      inputStyle: {
        width: 2
      },
      cacheselectedItems: []
    }
  }

  calShowCountFlag = true
  componentDidUpdate () {
    if (
      this.props.multipleMode === 'nowrap' &&
      this.calShowCountFlag &&
      this.itemsRef
    ) {
      // 多选超过一行时以数字显示
      const itemsRect = this.itemsRef.getBoundingClientRect()
      let width = 0
      let showCount = 0
      const items = this.itemsRef.querySelectorAll('.hi-select__input--item')

      for (const item of items) {
        const itemRect = item.getBoundingClientRect()
        width += itemRect.width
        if (
          width + 50 < itemsRect.width ||
          (width > itemsRect.width &&
            width + 50 <= itemsRect.width &&
            showCount + 1 === items.length)
        ) {
          // 50是留给显示剩余选项的空间
          ++showCount
        } else {
          break
        }
      }
      this.setState({ showCount })
      this.calShowCountFlag = false
    } else {
      this.calShowCountFlag = true
    }
  }

  static getDerivedStateFromProps (nextProps, nextState) {
    return nextProps.dropdownShow
      ? { cacheselectedItems: nextProps.selectedItems.length > 0 ? nextProps.selectedItems : nextState.cacheselectedItems } : { cacheselectedItems: nextProps.selectedItems }
  }
  focus () {
    setTimeout(() => this.searchInput && this.searchInput.focus(), 0)
  }

  handleKeywordChange (evt) {
    var val = evt.target.value
    this.setState({
      value: val,
      inputStyle: {
        width: getTextWidth(val)
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
    this.setState({
      cacheselectedItems: []
    })
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
      multipleMode,
      onFocus,
      theme,
      onBlur
    } = this.props
    let icon = dropdownShow ? 'up' : 'down'
    let { showCount, value, inputStyle } = this.state
    showCount =
      showCount === 0 || this.calShowCountFlag
        ? selectedItems.length
        : showCount

    if (!selectedItems.length) {
      inputStyle = { width: '100%' }
    }
    return (
      <div
        className={classNames('hi-select__input', 'multiple-values', `theme__${theme}`, {
          disabled
        })}
        onClick={this.props.onClick}
      >
        {selectedItems.length === 0 && !value && (
          <div className='hi-select__input--placeholder'>{placeholder}</div>
        )}
        <div
          className={classNames('hi-select__input-items', {
            'hi-select__input-items--all': multipleMode === 'wrap'
          })}
          ref={(node) => {
            this.itemsRef = node
          }}
        >
          {selectedItems.slice(0, showCount).map((item, index) => {
            const _item = (
              <div key={index} className='hi-select__input--item' style={{ maxWidth: this.itemsRef ? (this.itemsRef.getBoundingClientRect().width - 50) * 0.8 : '80%' }}>
                <div className='hi-select__input--item__name'>{item.title}</div>
                <span
                  className={classNames('hi-select__input--item__remove', {
                    disabled
                  })}
                  onClick={(e) => {
                    e.stopPropagation()
                    !disabled && this.props.onDelete(item)
                  }}
                >
                  <i className='hi-icon icon-close' />
                </span>
              </div>
            )
            return _item
          })}
          {showCount < selectedItems.length && (
            <div className={classNames('hi-select__input-items--left', {
              disabled
            })}>
              +
              <span className='hi-select__input-items--left-count'>
                {selectedItems.length - showCount}
              </span>
            </div>
          )}
          {searchable && !disabled && (
            <div className='hi-select__input--search'>
              <input
                type='text'
                style={inputStyle}
                ref={(input) => {
                  this.searchInput = input
                }}
                onChange={this.handleKeywordChange.bind(this)}
                onKeyDown={this.handleKeyDown.bind(this)}
                onFocus={onFocus.bind(this)}
                onBlur={onBlur.bind(this)}
                readOnly
              />
            </div>
          )}
        </div>
        <span className='hi-select__input--icon'>
          <i
            className={classNames(
              `hi-icon icon-${icon} hi-select__input--icon__expand`,
              { clearable: clearable && selectedItems.length > 0 }
            )}
          />
          {clearable && selectedItems.length > 0 && (
            <i
              className={`hi-icon icon-close-circle hi-select__input--icon__close`}
              onClick={this.handleClear.bind(this)}
            />
          )}
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
      clearable,
      onFocus,
      theme,
      onBlur
    } = this.props

    selectedItems = selectedItems.length > 0 ? selectedItems : this.state.cacheselectedItems
    placeholder =
      selectedItems.length > 0 ? selectedItems[0].title : placeholder
    let icon = dropdownShow ? 'up' : 'down'

    return (
      <div
        className={classNames('hi-select__input', 'single-value', `theme__${theme}`, { disabled })}
        onClick={this.props.onClick}
      >
        <div
          className={classNames('hi-select__input--item', {
            'hi-select__hide': !(!dropdownShow && selectedItems.length > 0)
          })}
        >
          <div className='hi-select__input--item__name'>
            {selectedItems[0] && selectedItems[0].title}
          </div>
        </div>
        {(dropdownShow || selectedItems.length === 0) && (
          <div className={classNames('hi-select__input--search', {'hi-select__input--search--value': selectedItems.length > 0})}>
            <input
              type='text'
              ref={(input) => {
                this.searchInput = input
              }}
              value={selectedItems.length > 0 ? placeholder : ''}
              placeholder={placeholder}
              onChange={this.handleKeywordChange.bind(this)}
              onKeyDown={this.handleKeyDown.bind(this)}
              onFocus={onFocus.bind(this)}
              onBlur={onBlur.bind(this)}
              readOnly
            />
          </div>
        )}
        <span className='hi-select__input--icon'>
          <i
            className={classNames(
              `hi-icon icon-${icon} hi-select__input--icon__expand`,
              { clearable: clearable && selectedItems.length > 0 }
            )}
          />
          {clearable && selectedItems.length > 0 && (
            <i
              className={`hi-icon icon-close-circle hi-select__input--icon__close`}
              onClick={this.handleClear.bind(this)}
            />
          )}
        </span>
      </div>
    )
  }

  render () {
    let { mode } = this.props

    if (mode === 'multiple') {
      return this.renderMultiple()
    } else {
      return this.renderSingle()
    }
  }
}

export default SelectInput
