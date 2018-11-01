import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Popper from '../popper'
import SelectInput from './SelectInput'
import SelectDropdown from './SelectDropdown'
import $$ from './tool.js'
import './style/index.scss'

class Select extends Component {
  timer = null
  noHideDropdown = false

  static propTypes = {
    mode: PropTypes.oneOf(['single', 'multiple']),
    list: PropTypes.array,
    origin: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.string
    ]),
    autoload: PropTypes.bool,
    searchable: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func
  }

  static defaultProps = {
    mode: 'single',
    disabled: false,
    value: '',
    autoload: false
  }

  constructor (props) {
    super(props)

    let {
      list
    } = this.props
    const dropdownItems = list ? JSON.parse(JSON.stringify(list)) : []
    const selectedItems = this.resetSelectedItems()
    const searchable = this.getSearchable()
    // const focusedIndex = this.resetFocusedIndex(false)

    this.state = {
      searchable,
      queryLength: 1,
      focusedIndex: 0,
      selectedItems,
      dropdownItems,
      dropdownShow: false,
      keyword: '',
      searchInput: {
        width: '2px'
      }
    }
  }

  getChildContext () {
    return {
      component: this
    }
  }

  componentWillMount () {
    if (this.isRemote() && this.props.autoload) {
      this.remoteSearch()
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.hideDropdown.bind(this))
    this.resetFocusedIndex()
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.hideDropdown.bind(this))
  }

  getSearchable () {
    let {
      searchable
    } = this.props

    if (this.isRemote()) {
      return true
    }
    // if(mode==='multiple' && searchable===undefined) {
    //   return true
    // }
    return !!searchable
  }

  isRemote () {
    let {
      origin
    } = this.props
    return origin && !!origin.url
  }

  resetSelectedItems () {
    const {
      list,
      value
    } = this.props
    const values = value.split(',')
    let selectedItems = []

    list && list.map(item => {
      if (values.indexOf(item.id) !== -1) {
        selectedItems.push(item)
      }
    })
    return selectedItems
  }

  addOption (option) {
    const value = this.props.value
    const values = value.split(',')

    this.state.dropdownItems.push(option)
    values.indexOf(option.id) > -1 && this.state.selectedItems.push(option)
    this.forceUpdate()
  }

  onEnterSelect () {
    const {
      dropdownItems,
      focusedIndex
    } = this.state
    const item = dropdownItems[focusedIndex]

    this.onClickOption(item, focusedIndex)
  }

  onChange () {
    const {
      selectedItems
    } = this.state

    this.props.onChange && this.props.onChange(selectedItems)
  }

  onClickOption (item, index) {
    if (!item || item.disabled) return

    let selectedItems = this.state.selectedItems.concat()
    let focusedIndex = index

    if (this.props.mode === 'multiple') {
      let itemIndex = this.state.selectedItems.findIndex((sItem) => {
        return sItem.id === item.id
      })
      if (itemIndex === -1) {
        selectedItems.push(item)
      } else {
        selectedItems.splice(itemIndex, 1)
      }
    } else {
      selectedItems = [item]
    }

    this.setState({
      selectedItems,
      focusedIndex
    }, () => {
      if (this.props.mode !== 'multiple') {
        this.hideDropdown()
      } else {
        this.selectInput.focus()
      }

      this.selectInput.clearKeyword()
      this.onChange()
      // this.selectInput.clear()
    })
  }

  handleInputClick (e) {
    this.noHideDropdown = ReactDOM.findDOMNode(this.selectInput).contains(e.target)
    // if (e) {
    //   e.stopPropagation()
    // }

    if (this.props.disabled) {
      return
    }

    let {
      dropdownShow
    } = this.state

    if (!dropdownShow) {
      this.showDropdown()
    }
  }

  hideDropdown () {
    !this.noHideDropdown && this.setState({dropdownShow: false})
    this.noHideDropdown = false
  }

  showDropdown () {
    this.setState({dropdownShow: true})
    this.selectInput.focus()
  }

  deleteItem (id) {
    let selectedItems = this.state.selectedItems.concat()
    const sIndex = selectedItems.findIndex((obj, index, arr) => {
      return obj.id === id
    })

    selectedItems.splice(sIndex, 1)
    this.setState({
      selectedItems
    }, () => {
      this.selectInput.focus()
      this.onChange()
    })
  }
  // 全部删除
  deleteAllItems () {
    const focusedIndex = this.resetFocusedIndex()

    this.setState({
      focusedIndex,
      selectedItems: []
    }, () => {
      this.onChange()
      this.onFilterItems('')
    })
  }

  remoteSearch (keyword) {
    let dropdownItems = []
    clearTimeout(this.timer)
    const {
      url,
      func,
      type
    } = this.props.origin

    this.timer = setTimeout(() => {
      $$.ajax({
        url: url,
        type: type || 'GET',
        data: {
          keyword: keyword
        },
        success: data => {
          if (func) {
            dropdownItems = func(data)
          } else {
            dropdownItems = data
          }

          this.setState({
            dropdownItems
          })
        },
        error: ex => {}
      })
    }, 500)
  }

  onFilterItems (keyword) {
    this.setState({
      keyword,
      focusedIndex: 0
    })

    if (this.props.origin) {
      this.setState({
        dropdownItems: []
      })
      if (this.props.autoload || keyword.toString().length >= this.state.queryLength) {
        this.remoteSearch(keyword)
      }
    }
  }

  matchFilter (item) {
    const {
      searchable,
      keyword
    } = this.state

    return this.isRemote || (!searchable || !keyword) || (searchable && keyword && (String(item.id).match(keyword) || String(item.name).match(keyword)))
  }

  resetFocusedIndex (setState = true) {
    let focusedIndex = -1

    this.state.dropdownItems.every(item => {
      focusedIndex++
      if (!item.disabled && this.matchFilter(item)) {
        return false
      }
      return true
    })
    setState && this.setState({
      focusedIndex
    })
    return focusedIndex
  }

  setFocusedIndex (focusedIndex) {
    this.setState({focusedIndex})
  }

  moveFocusedIndex (direction) {
    let {
      focusedIndex
    } = this.state
    const {
      dropdownItems
    } = this.state

    if (direction === 'up') {
      dropdownItems.slice(0, focusedIndex).reverse().every(item => {
        focusedIndex--
        if (!item.disabled && this.matchFilter(item)) {
          return false
        }
        return true
      })
    } else {
      dropdownItems.slice(focusedIndex + 1).every(item => {
        focusedIndex++
        if (!item.disabled && this.matchFilter(item)) {
          return false
        }
        return true
      })
    }
    this.setState({
      focusedIndex
    })
  }

  render () {
    const {
      mode,
      placeholder,
      className,
      disabled,
      style,
      children
    } = this.props
    const {
      selectedItems,
      dropdownItems,
      keyword,
      searchable,
      dropdownShow,
      focusedIndex
    } = this.state
    const extraClass = {
      'is-multiple': mode === 'multiple',
      'is-single': mode === 'single'
    }

    return (
      <div className={classNames('hi-select', className, extraClass)} style={style}>
        <div className='hi-select__input-container' ref={node => { this.selectInputContainer = node }}>
          <SelectInput
            ref={node => { this.selectInput = node }}
            mode={mode}
            disabled={disabled}
            searchable={searchable}
            keyword={keyword}
            dropdownShow={dropdownShow}
            placeholder={placeholder}
            selectedItems={selectedItems}
            dropdownItems={dropdownItems}
            moveFocusedIndex={this.moveFocusedIndex.bind(this)}
            onClick={this.handleInputClick.bind(this)}
            onDelete={this.deleteItem.bind(this)}
            onClear={this.deleteAllItems.bind(this)}
            onSearch={this.onFilterItems.bind(this)}
            onEnterSelect={this.onEnterSelect.bind(this)}
          />
        </div>
        { children }
        <Popper show={dropdownShow} attachEle={this.selectInputContainer} className='hi-select__popper'>
          <SelectDropdown
            mode={mode}
            focusedIndex={focusedIndex}
            matchFilter={this.matchFilter.bind(this)}
            setFocusedIndex={this.setFocusedIndex.bind(this)}
            dropdownItems={dropdownItems}
            selectedItems={selectedItems}
            onClickOption={this.onClickOption.bind(this)}
          />
        </Popper>
      </div>
    )
  }
}
Select.childContextTypes = {
  component: PropTypes.any
}

export default Select
