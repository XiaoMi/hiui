/* @flow */

import React, { Component } from 'react'
import './index.scss'
export default class SelectInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      // 已经选择的下拉选项
      selectedList: [],
      isFocus: false,
      inputVisbility: true
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
    this.setState({
      isFocus: true
    })
  }
  handleFocus (evt) {
    this.props.onFocus(evt)
    this.setState({
      isFocus: true,
      inputVisbility: true
    })
  }
  handleBlur () {
    this.setState({isFocus: false})
  }
  handleClear () {
    this.props.onClear()
    this.searchInput.value = ''
  }
  setInputVisbility (flag) {
    this.setState({
      inputVisbility: flag
    })
  }
  handleKeyDown (evt) {
    if (evt.keyCode === 13) {
      var dropdownList = this.props.dropdownList.concat()
      var dIndex = dropdownList.findIndex((obj, index, arr) => {
        return obj.isFirstFilter === true
      })
      if (dIndex === -1) {
        return
      }
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
    const {
      isActive,
      disabled
    } = this.props

    const selected = this.props.dropdownList.filter((item) => item.selected)
    if (selected.length) {
      this.state.hasSelected = true
    } else {
      this.state.hasSelected = false
    }

    return (
      <div className={`single-select-input-container ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`} onClick={this.props.onClick}>
        <label>
          <ul>
            {
              // 有选择并且当前不是输入状态才显示已选择项
              this.state.isFocus === false ? (
                selected.map((item, index) => {
                  return (
                    <li className='selected-item' key={'single-dropdownList-' + index}>
                      <div className='selected-item-name'>
                        {item.name}
                      </div>
                    </li>
                  )
                })
              ) : null
            }
            {
              <li className={'select-search '}>
                <input
                  type='text'
                  className='single-input'
                  data-visbility={
                    (this.state.inputVisbility && this.state.isFocus) || !this.state.hasSelected
                  }
                  ref={input => {
                    this.searchInput = input
                  }}
                  placeholder={this.props.selectedItem.name || this.props.placeholder}
                  onChange={this.props.onSearch}
                  onFocus={this.handleFocus.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  onKeyDown={this.handleKeyDown.bind(this)}
                  disabled={this.props.disabled}
                />
              </li>
            }
          </ul>
        </label>
        {this.props.dropdownList.filter((item) => item.selected).length > 0 ? (
          <span
            className='icon__mark icon__mark_remove'
            onClick={this.handleClear.bind(this)}
          >
            <i className='hi-icon icon-close-circle' />
          </span>
        ) : ''
        }
        (
        <span className='icon__mark icon__mark_arrow'>
          <i className={`hi-icon icon-${isActive ? 'up' : 'down'}`} />
        </span>
        )
      </div>
    )
  }
}
