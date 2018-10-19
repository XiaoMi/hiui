/* @flow */

import React, { Component } from 'react'

export default class SelectDropdown extends Component {
  constructor (props) {
    super(props)

    this.state = {
      // 下拉选项
      dropdownList: []
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dropdownList: nextProps.dropdownList
    })
  }

  onMouseEnter (e) {
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

  handleDropdownSelect (item, index, e) {
    if (e) {
      e.stopPropagation()
    }
    if (item.disabled) {
      return
    }
    this.props.onDropdownSelect(item, index)
  }

  render () {
    return (
      <div className='select-dropdown-container' onClick={this.props.onClick}>
        <ul className='select-dropdown-menu'>
          {this.props.dropdownList.map((item, index) => {
            return item.name.match(this.props.keyword) ? (
              <li
                className={`select-dropdown-item ${item.disabled ? 'disabled' : ''}`}
                onClick={this.handleDropdownSelect.bind(this, item, index)}
                data-enabled={item.enabled}
                data-filterfirst={item.isFirstFilter}
                data-selected={item.selected}
                key={index}
                data-index={index}
                onMouseEnter={this.onMouseEnter.bind(this)}
              >
                <span className='left-text'
                >{item.name}</span>
                <span className={`right-text ${item.selected ? '' : 'none'}`}>
                  <i className='hi-icon icon-check' />
                </span>
              </li>
            ) : null
          })}
        </ul>
      </div>
    )
  }
}
