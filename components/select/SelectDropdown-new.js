import React, { Component } from 'react'
import classNames from 'classnames'
import Checkbox from '../checkbox'
import Loading from '../loading'
import Icon from '../icon'

class SelectDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filterItems: this.props.dropdownItems,
      searchbarValue: '',
      cachedropdownItems: this.props.dropdownItems
    }
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    const { selectedItems, mode, isOnSearch, dropdownItems, show } = nextProps
    const { searchbarValue, cachedropdownItems } = prevState
    const _filterItems =
      selectedItems.length > 0 &&
      searchbarValue.length === 0 &&
      mode === 'single' &&
      isOnSearch
        ? cachedropdownItems
        : dropdownItems
    const _searchbarValue = show ? searchbarValue : ''
    return { filterItems: _filterItems, searchbarValue: _searchbarValue }
  }
  componentDidMount () {
    this.focus()
  }
  focus = () => {
    this.props.searchable && setTimeout(() => this.searchbar.focus(), 0)
  }
  onClickOption (e, item, index) {
    e.stopPropagation()
    e.preventDefault()
    if (item.disabled) {
      return
    }
    this.props.mode === 'single' &&
      this.props.isOnSearch &&
      this.setState({
        cachedropdownItems: this.props.dropdownItems
      })
    this.props.onClickOption(item, index)
  }
  filterOptions = keyword => {
    const { dropdownItems, filterOption } = this.props
    let filterItems = []
    if (typeof filterOption === 'function' || keyword === '') {
      filterItems = dropdownItems
    } else {
      dropdownItems.map(item => {
        String(item.title).includes(keyword) && filterItems.push(item)
      })
    }
    this.setState({
      filterItems: filterItems,
      searchbarValue: keyword
    })
  }
  searchEvent (e) {
    const filterText = e.target.value
    this.filterOptions(filterText)
    this.props.onSearch(filterText)

    this.setState({
      searchbarValue: filterText
    })
  }
  hightlightKeyword (text, uniqueKey) {
    const { searchbarValue } = this.state
    let _keyword = this.state.searchbarValue
    _keyword = searchbarValue.includes('[')
      ? _keyword.replace(/\[/gi, '\\[')
      : _keyword
    _keyword = searchbarValue.includes('(')
      ? _keyword.replace(/\(/gi, '\\(')
      : _keyword
    _keyword = searchbarValue.includes(')')
      ? _keyword.replace(/\)/gi, '\\)')
      : _keyword

    let parts = text.split(new RegExp(`(${_keyword})`, 'gi'))
    return this.state.searchbarValue.length > 0 ? (
      <p key={uniqueKey}>
        {parts.map((part, i) =>
          part === searchbarValue ? (
            <span
              key={i}
              className={'hi-select__dropdown--item__name-hightlight'}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </p>
    ) : (
      text
    )
  }
  onMouseEnter (item, index) {
    !item.disabled && this.props.setFocusedIndex(index)
  }

  itemSelected (item) {
    const selectedItems = this.props.selectedItems

    return selectedItems.map(item => item.id).indexOf(item.id) > -1
  }
  cleanSearchbarValue (e) {
    e.stopPropagation()
    const filterText = ''
    this.filterOptions(filterText)
    this.props.onSearch(filterText)

    this.setState({
      searchbarValue: filterText
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
  renderOption (mode, isSelected, item) {
    if (item.children) {
      return item.children
    }
    if (this.props.dropdownRender) {
      return this.props.dropdownRender(item, isSelected)
    }
    const paddingNum = mode === 'multiple' ? 48 : 24
    const style = {
      width: this.props.optionWidth
        ? this.props.optionWidth - paddingNum
        : this.props.selectInputWidth
          ? this.props.selectInputWidth - paddingNum
          : null
    }

    return (
      <React.Fragment>
        {mode === 'multiple' && (
          <Checkbox
            className='hi-select__dropdown--item__checkbox'
            checked={isSelected}
            disabled={item.disabled}
          >
            <div className='hi-select__dropdown--item__name' style={style}>
              {this.props.isOnSearch
                ? item.title
                : this.hightlightKeyword(item.title, item.id)}
            </div>
          </Checkbox>
        )}
        {mode === 'single' && (
          <div className='hi-select__dropdown--item__name' style={style}>
            {this.props.isOnSearch
              ? item.title
              : this.hightlightKeyword(item.title, item.id)}
          </div>
        )}
        {mode === 'single' && isSelected && (
          <div className='hi-select__dropdown--item__check-icon'>
            <i className='hi-icon icon-check' />
          </div>
        )}
      </React.Fragment>
    )
  }

  render () {
    const {
      mode,
      focusedIndex,
      matchFilter,
      emptyContent,
      loading,
      optionWidth,
      showCheckAll,
      dropdownRender,
      theme,
      searchable,
      onFocus,
      onBlur,
      searchPlaceholder,
      localeMap
    } = this.props
    const { filterItems, searchbarValue } = this.state
    let matched = 0
    const style = optionWidth && {
      width: optionWidth
    }

    return (
      <div className='hi-select__dropdown' style={style}>
        {searchable && (
          <div className='hi-select__dropdown__searchbar'>
            <div className='hi-select__dropdown__searchbar--content'>
              <Icon name='search' />
              <input
                className='hi-select__dropdown__searchbar--input'
                placeholder={searchPlaceholder}
                clearable='true'
                ref={input => {
                  this.searchbar = input
                }}
                value={searchbarValue}
                onFocus={onFocus.bind(this)}
                onBlur={onBlur.bind(this)}
                clearabletrigger='always'
                onKeyDown={this.handleKeyDown.bind(this)}
                onInput={this.searchEvent.bind(this)}
                onChange={this.searchEvent.bind(this)}
              />
              {searchbarValue.length > 0 ? (
                <Icon
                  name='close-circle'
                  style={{ cursor: 'pointer' }}
                  onClick={this.cleanSearchbarValue.bind(this)}
                />
              ) : null}
            </div>
          </div>
        )}
        {loading && (
          <div className='hi-select__dropdown--loading'>
            <Loading size='small' />
          </div>
        )}
        {!loading && (
          <ul className='hi-select__dropdown--items'>
            {filterItems.map((item, index) => {
              if (matchFilter(item)) {
                matched++
                const isSelected = this.itemSelected(item)
                const isDisabled = item.disabled
                return (
                  <li
                    className={classNames(
                      'hi-select__dropdown--item',
                      `theme__${theme}`,
                      {
                        'is-active': isSelected,
                        'is-disabled': isDisabled,
                        'hi-select__dropdown--item-default':
                          !item.children && !dropdownRender
                      }
                    )}
                    onClick={e => this.onClickOption(e, item, index)}
                    key={item.id}
                    data-focused={focusedIndex === index}
                    onMouseEnter={() => this.onMouseEnter(item, index)}
                  >
                    {this.renderOption(mode, isSelected, item)}
                  </li>
                )
              }
            })}
            {matched === 0 && (
              <li
                className='hi-select__dropdown--item hi-select__dropdown-item--empty is-disabled'
                onClick={e => e.stopPropagation()}
              >
                {emptyContent}
              </li>
            )}
          </ul>
        )}
        {mode === 'multiple' && showCheckAll && (
          <div
            className={`hi-select__dropdown-check-all theme__${theme}`}
            onClick={this.props.checkAll.bind(this, filterItems)}
          >
            {localeMap['checkAll']}
          </div>
        )}
      </div>
    )
  }
}

export default SelectDropdown
