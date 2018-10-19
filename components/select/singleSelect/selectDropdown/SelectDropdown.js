/* @flow */

import React, { Component } from 'react'
import './index.scss'

export default class SelectDropdown extends Component {
  handleDropdownSelect (item, index, event) {
    if (item.disabled) {
      return
    }
    var dataSelect = event.target.getAttribute('data-selected')
    var isSelect = true
    if (dataSelect === 'true') {
      isSelect = false
    }
    this.props.onDropdownSelect(item, index, isSelect)
  }

  onMouseEnter (disabled, e) {
    let target = e.target
    let li = []

    const getLiNode = function (node) {
      if (node.tagName === 'LI') {
        li.push(node)
      } else {
        const parent = node.parentNode
        getLiNode(parent)
      }
    }

    getLiNode(target)
    const index = li[0].dataset.index
    this.props.setActive(index)
  }

  render () {
    const {
      mode,
      dropdownList,
      keyword,
      position
    } = this.props

    return (
      <div className='select-dropdown-container' style={{position: 'fixed', left: position.left, top: position.top + position.height, width: position.width}}>
        <ul className={`select-dropdown-menu  ${mode === 'label' ? 'mode-label' : 'mode-single'}`}>
          {dropdownList.map((item, index) => {
            return item.name.match(keyword) ? (
              <li
                className={`select-dropdown-item ${item.disabled ? 'disabled' : ''}`}
                onClick={this.handleDropdownSelect.bind(this, item, index)}
                data-enabled={item.enabled}
                data-filterfirst={item.isFirstFilter}
                data-selected={item.selected}
                key={'select-dropdown' + index}
                data-index={index}
                onMouseEnter={this.onMouseEnter.bind(this, item.disabled)}
              >
                <span className='left-text'
                >{item.name}</span>
                {
                  mode === 'label'
                    ? (
                      <span className={`right-text`}>{item.label}</span>
                    )
                    : (
                      <span className={`right-text ${item.selected ? '' : 'none'}`}>
                        <i className='hi-icon icon-check' />
                      </span>
                    )
                }
              </li>
            ) : null
          })}
        </ul>
      </div>
    )
  }
}
