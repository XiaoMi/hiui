/* @flow */

import React, { Component } from 'react'
import classNames from 'classnames'
import Checkbox from '../checkbox'
import Loading from '../loading'

export default class SelectDropdown extends Component {
  onClickOption (e, item, index) {
    if (e) {
      e.stopPropagation()
    }
    if (item.disabled) {
      return
    }
    this.props.onClickOption(item, index)
  }

  onMouseEnter (item, index) {
    !item.disabled && this.props.setFocusedIndex(index)
  }

  itemSelected (item) {
    const selectedItems = this.props.selectedItems

    return selectedItems.map(item => item.id).indexOf(item.id) > -1
  }

  renderOption (mode, isSelected, item) {
    if (item.children) {
      return item.children
    }
    return (
      <React.Fragment>
        {
          mode === 'multiple' &&
          <div className='hi-select__dropdown--item__checkbox'>
            <Checkbox checked={isSelected} />
          </div>
        }
        <div className='hi-select__dropdown--item__name'>
          {item.name}
        </div>
        {
          mode === 'single' && isSelected &&
          <div className='hi-select__dropdown--item__check-icon'>
            <i className='hi-icon icon-check' />
          </div>
        }
      </React.Fragment>
    )
  }

  render () {
    const {
      mode,
      dropdownItems,
      focusedIndex,
      matchFilter,
      noFoundTip,
      loading,
      optionWidth
    } = this.props
    let matched = 0
    const style = optionWidth && {
      width: optionWidth
    }
    return (
      <div className='hi-select__dropdown' onClick={this.props.onClick} style={style}>
        {
          loading &&
          <div className='hi-select__dropdown--loading'>
            <Loading size='small' />
          </div>
        }
        {
          !loading &&
          <ul className='hi-select__dropdown--items'>
            {
              dropdownItems.map((item, index) => {
                if (matchFilter(item)) {
                  matched++
                  // const isSelected = selectedItems[item.id]
                  const isSelected = this.itemSelected(item)
                  const isDisabled = item.disabled
                  return (
                    <li
                      className={classNames('hi-select__dropdown--item', {'is-active': isSelected, 'is-disabled': isDisabled, 'hi-select__dropdown--item-default': !item.children})}
                      onClick={e => this.onClickOption(e, item, index)}
                      key={index}
                      data-focused={focusedIndex === index}
                      onMouseEnter={() => this.onMouseEnter(item, index)}
                    >
                      {
                        this.renderOption(mode, isSelected, item)
                      }
                    </li>
                  )
                }
              })
            }
            {
              matched === 0 &&
              <li
                className='hi-select__dropdown--item is-disabled'
                onClick={e => e.stopPropagation()}
              >
                { noFoundTip }
              </li>
            }
          </ul>
        }
      </div>
    )
  }
}
