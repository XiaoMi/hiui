import React, { Component } from 'react'
import classNames from 'classnames'
import Checkbox from '../checkbox'
import Loading from '../loading'
import Provider from '../context'
import Icon from '../icon'
import Input from '../input'

class SelectDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filterItems: this.props.dropdownItems,
      keyword: ''
    }
  }
  onClickOption (e, item, index) {
    e.stopPropagation()
    e.preventDefault()
    if (item.disabled) {
      return
    }
    this.props.onClickOption(item, index)
  }
  filterOptions = (keyword) => {
    const { dropdownItems } = this.props
    const filterItem = []
    dropdownItems.map((item) => {
      item.title.includes(keyword) && filterItem.push(item)
    })
    this.setState({
      filterItems: filterItem,
      keyword: keyword
    })
  }
  searchEvent (e) {
    const filterText = e.target.value
    this.filterOptions(filterText)
    this.props.onSearch(e.target.value)
  }
  hightlightKeyword (text, uniqueKey) {
    const { keyword } = this.state
    let _keyword = this.state.keyword
    _keyword = keyword.includes('[') ? _keyword.replace(/\[/gi, '\\[') : _keyword
    _keyword = keyword.includes('(') ? _keyword.replace(/\(/gi, '\\(') : _keyword
    _keyword = keyword.includes(')') ? _keyword.replace(/\)/gi, '\\)') : _keyword

    let parts = text.split(new RegExp(`(${_keyword})`, 'gi'))
    return (
      <span key={uniqueKey}>
        { parts.map((part, i) =>
          <span key={i} className={part === keyword ? 'hi-select__dropdown--item__name-hightlight' : ''}>
            { part }
          </span>
        )
        }
      </span>
    )
  }
  onMouseEnter (item, index) {
    !item.disabled && this.props.setFocusedIndex(index)
  }

  itemSelected (item) {
    const selectedItems = this.props.selectedItems

    return selectedItems.map((item) => item.id).indexOf(item.id) > -1
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
    return (
      <React.Fragment>
        {mode === 'multiple' && (
          <Checkbox
            className='hi-select__dropdown--item__checkbox'
            checked={isSelected}
            disabled={item.disabled}
          >
            <div className='hi-select__dropdown--item__name'>{
              this.hightlightKeyword(item.title, item.id)
            }</div>
          </Checkbox>
        )}
        {mode === 'single' && (
          <div className='hi-select__dropdown--item__name'>{
            this.hightlightKeyword(item.title, item.id)
          }</div>
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
      noFoundTip,
      loading,
      optionWidth,
      showCheckAll,
      checkAll,
      dropdownRender,
      theme,
      searchable,
      onFocus,
      onBlur
    } = this.props
    const { filterItems } = this.state
    let matched = 0
    const style = optionWidth && {
      width: optionWidth
    }

    return (
      <div
        className='hi-select__dropdown'
        style={style}
      >
        {searchable &&
        <div className='hi-select__dropdown__searchbar'>
          <div className='hi-select__dropdown__searchbar--content'>
            <Icon name='search' />
            <Input
              placeholder='搜索'
              clearable='true'
              autoFocus
              onKeyDown={this.handleKeyDown.bind(this)}
              onFocus={onFocus.bind(this)}
              onBlur={onBlur.bind(this)}
              clearabletrigger='always'
              onInput={this.searchEvent.bind(this)}
              onChange={this.searchEvent.bind(this)}
            />
          </div>
        </div>}
        {loading && (
          <div className='hi-select__dropdown--loading'>
            <Loading size='small' />
          </div>
        )}
        {!loading && (
          <ul className='hi-select__dropdown--items'>

            {
              filterItems.map((item, index) => {
                if (matchFilter(item)) {
                  matched++
                  // const isSelected = selectedItems[item.id]
                  const isSelected = this.itemSelected(item)
                  const isDisabled = item.disabled
                  return (
                    <li
                      className={classNames('hi-select__dropdown--item', `theme__${theme}`, {
                        'is-active': isSelected,
                        'is-disabled': isDisabled,
                        'hi-select__dropdown--item-default':
                          !item.children && !dropdownRender
                      })}
                      onClick={(e) => this.onClickOption(e, item, index)}
                      key={item.id}
                      data-focused={focusedIndex === index}
                      onMouseEnter={() => this.onMouseEnter(item, index)}
                    >
                      {this.renderOption(mode, isSelected, item)}
                    </li>
                  )
                }
              })
            }
            {matched === 0 && (
              <li
                className='hi-select__dropdown--item hi-select__dropdown-item--empty is-disabled'
                onClick={(e) => e.stopPropagation()}
              >
                {noFoundTip}
              </li>
            )}
          </ul>
        )}
        {mode === 'multiple' && showCheckAll && (
          <div className={`hi-select__dropdown-check-all theme__${theme}`} onClick={checkAll}>
            全选
          </div>
        )}
      </div>
    )
  }
}

export default Provider(SelectDropdown)
