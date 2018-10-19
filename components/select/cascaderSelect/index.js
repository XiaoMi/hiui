import React, { Component } from 'react'
import CascaderInput from './cascaderInput/CascaderInput'
import CascaderDropDown from './cascadertDropdown'

import './index.scss'
class CascaderSelect extends Component {
  constructor (props) {
    super(props)

    let value = ''
    if (props.value) {
      value = this.setDefaultValue(props.value, props.list)
    }

    this.state = {
      dropdownDisplay: false,
      value: value
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.hideDrop.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.hideDrop.bind(this))
  }

  setDefaultValue (value, list) {
    let val = value
    let tmp = {}

    if (typeof value === 'string') {
      val = value.splite(',').replace(' ', '')
    }

    for (let i = 0; i < val.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (list && +list[j].id === +val[i]) {
          tmp = list[j]
          list = list[j].children || []
        }
      }
    }
    return tmp.name
  }

  hideDrop (e) {
    if (this.state.dropdownDisplay) {
      e.stopPropagation()

      this.setState({dropdownDisplay: false})
    }
  }

  showDrop (e) {
    e.stopPropagation()

    this.setState({dropdownDisplay: true})
  }

  changeValue (selectedTrace) {
    const value = selectedTrace[selectedTrace.length - 1].name

    this.setState({value}, () => {
      this.props.onChange(selectedTrace)
    })
  }

  clear () {
    this.setState({value: ''})
  }

  renderDropdown (list) {
    return this.state.dropdownDisplay ? (
      <CascaderDropDown
        list={list}
        changeValue={selectedTrace => {
          this.changeValue(selectedTrace)
        }}
        hideDrop={this.hideDrop.bind(this)}
      />
    ) : null
  }

  render () {
    const {
      list = [],
      placeholder,
      disabled
    } = this.props

    return (
      <div className='cascader-container'>
        <CascaderInput
          ref='selectInputChild'
          dropdownDisplay={this.state.dropdownDisplay}
          onClick={(e) => {
            if (disabled) {
              e.stopPropagation()
              return
            }
            this.showDrop(e)
          }}
          clear={this.clear.bind(this)}
          value={this.state.value}
          placeholder={placeholder}
          disabled={disabled}
        />
        {this.renderDropdown(list)}
      </div>
    )
  }
}

export default CascaderSelect
