/* @flow */

import React, { Component } from 'react'
import { getTextWidth } from '../../common.js'
import './index.scss'
export default class SelectInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      // 已经选择的下拉选项
      selectedList: [],
      inputStyle: {
        width: '2px'
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      selectedList: nextProps.selectedList
    })
  }

  componentWillUnmount () {
    this.state = {}
  }

  focus () {
    this.searchInput.focus()
  }
  clear () {
    this.searchInput.value = ''
  }
  handleChange (evt) {
    var val = evt.target.value
    this.setState({
      inputStyle: {
        width: getTextWidth(val) + 'px'
      }
    })
    this.props.onSearch(evt)
  }
  handleKeyDown (evt) {
    // if (evt.keyCode === 8 && evt.target.value === '') {
    //   this.props.onEndDelete()
    // }

    if (evt.keyCode === 13) {
      var dropdownList = this.props.dropdownList.concat()
      var dIndex = dropdownList.findIndex((obj, index, arr) => {
        return obj.isFirstFilter === true
      })
      this.props.onEnterSelect(dropdownList[dIndex], dIndex, true)
    }

    if (evt.keyCode === 38) {
      evt.preventDefault()
      this.props.upDownSelect('up')
    }
    if (evt.keyCode === 40) {
      evt.preventDefault()
      this.props.upDownSelect('down')
    }
  }
  render () {
    let {
      placeholder,
      isActive,
      selectedList,
      disabled
    } = this.props
    let {
      inputStyle
    } = this.state

    if (!selectedList.length) {
      inputStyle = {width: '100%'}
    }

    placeholder = selectedList.length ? '' : placeholder

    return (
      <label className={`multiple-select-input-container ${isActive ? 'active' : ''}  ${disabled ? 'disabled' : ''}`} onClick={this.props.onClick}>
        <ul>
          {this.state.selectedList.map((item, index) => {
            return (
              <li key={'selecting-' + index} className='selected-item'>
                <div className='selected-item-name'>{item.name}</div>
                <span
                  className='selected-item-remove'
                  onClick={e => {
                    this.props.onDelete(item.id)
                  }}
                >
                  <i className='hi-icon icon-close' />
                </span>
              </li>
            )
          })}
          <li className='select-search'>
            <input
              type='text'
              className='multiple-input'
              style={inputStyle}
              ref={input => {
                this.searchInput = input
              }}
              placeholder={placeholder}
              onChange={this.handleChange.bind(this)}
              onFocus={this.props.onSearch}
              onKeyDown={this.handleKeyDown.bind(this)}
              disabled={disabled}
            />
          </li>
        </ul>
        {/* {
          selectedList.length
          ? (
              <span className='select-remove'>
                <i className='hi-icon icon-close' />
              </span>
          )
          : (
              <span className='select-mark_arrow'>
                {
                  isActive
                  ? (
                    <i className='hi-icon icon-down' />
                  )
                  : (
                    <i className='hi-icon icon-up' />
                  )
                }
              </span>
          )
        } */}
      </label>
    )
  }
}
