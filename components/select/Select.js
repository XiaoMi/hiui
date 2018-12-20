import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import shallowEqual from 'shallowequal'
import debounce from 'lodash/debounce'
import Popper from '../popper'
import SelectInput from './SelectInput'
import SelectDropdown from './SelectDropdown'
import Provider from '../context'

class Select extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(['single', 'multiple']),
    list: PropTypes.array,
    origin: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number
    ]),
    autoload: PropTypes.bool,
    searchable: PropTypes.bool,
    clearable: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    noFoundTip: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func
  }

  static defaultProps = {
    list: [],
    mode: 'single',
    disabled: false,
    clearable: true,
    value: '',
    autoload: false,
    placeholder: '请选择',
    noFoundTip: '无内容'
  }

  constructor (props) {
    super(props)

    let {
      list
    } = this.props
    const dropdownItems = list
    const selectedItems = this.resetSelectedItems(this.props)
    const searchable = this.getSearchable()
    this.debouncedFilterItems = debounce(this.onFilterItems.bind(this), 300)
    this.clickOutsideHandel = this.clickOutside.bind(this)
    // const focusedIndex = this.resetFocusedIndex(false)

    this.state = {
      searchable,
      queryLength: 1,
      focusedIndex: 0,
      selectedItems,
      dropdownItems,
      dropdownShow: false,
      fetching: false,
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
    window.addEventListener('click', this.clickOutsideHandel)
    this.resetFocusedIndex()
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.clickOutsideHandel)
  }

  clickOutside (e) {
    if (ReactDOM.findDOMNode(this.selectInput) && ReactDOM.findDOMNode(this.selectInput).contains(e.target)) {
      return
    }
    this.hideDropdown()
  }

  componentWillReceiveProps (props) {
    if (!shallowEqual(props.value, this.props.value)) {
      const selectedItems = this.resetSelectedItems(props)

      this.setState({
        selectedItems
      }, () => {
        // this.onChange()
      })
    }
    if (!shallowEqual(props.list, this.props.list)) {
      this.setState({
        dropdownItems: props.list
      })
    }
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

  parseValue (value = this.props.value) {
    if (Array.isArray(value)) {
      return value.slice()
    } else if (typeof value === 'string') {
      return value.split(',')
    } else {
      return [value]
    }
  }

  isRemote () {
    let {
      origin
    } = this.props
    return origin && !!origin.url
  }

  resetSelectedItems (props) {
    const {
      list
    } = props
    const values = this.parseValue(props.value)
    let selectedItems = []

    list && list.map(item => {
      if (values.indexOf(item.id) !== -1) {
        selectedItems.push(item)
      }
    })
    return selectedItems
  }

  addOption (option) {
    const values = this.parseValue()

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
        this.clearKeyword() // 多选状态清空筛选
      }

      this.onChange()
    })
  }

  clearKeyword () {
    this.setState({
      keyword: ''
    }, () => {
      this.selectInput.clearInput()
    })
  }

  handleInputClick (e) {
    this.selectInput.focus()
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
    this.state.dropdownShow === true && this.setState({dropdownShow: false}, () => {
      this.clearKeyword()
    })
  }

  showDropdown () {
    this.state.dropdownShow === false && this.setState({dropdownShow: true})
    this.selectInput.focus()
  }

  deleteItem (item) {
    if (item.disabled) return

    let selectedItems = this.state.selectedItems.concat()
    const sIndex = selectedItems.findIndex((obj, index, arr) => {
      return obj.id === item.id
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
    let {
      url,
      func,
      error,
      data = {},
      type = 'GET',
      key = 'keyword'
    } = this.props.origin
    url = url.indexOf('?') === -1 ? `${url}?${[key]}=${keyword}` : `${url}&${[key]}=${keyword}`
    const options = {}

    if (type.toUpperCase === 'POST') {
      options.body = JSON.stringify(data)
    }
    this.setState({
      fetching: true
    })

    /* eslint-disable */ 
    fetch(url, {
      method: type,
      ...options
    })
      .then(response => response.json())
      .then(res => {
        if (func) {
          dropdownItems = func(res)
        } else {
          dropdownItems = res.data
        }
        Array.isArray(dropdownItems) && this.setState({
          dropdownItems
        })
        this.setState({
          fetching: false
        })
      }, err => {
        error && error(err)
        this.setState({
          fetching: false
        })
      })
  }

  onFilterItems (keyword) {
    this.setState({
      keyword,
      focusedIndex: 0
    })

    if (this.props.origin) {
      // this.setState({
      //   dropdownItems: []
      // })
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

    return this.isRemote() || (!searchable || !keyword) || (searchable && keyword && (String(item.id).match(keyword) || String(item.name).match(keyword)))
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

  localeDatasProps (key) {
    const {
      localeDatas
    } = this.props
    if (this.props[key]) {
      return this.props[key]
    } else {
      return localeDatas.select[key]
    }
  }

  render () {
    const {
      mode,
      className,
      disabled,
      clearable,
      style,
      children,
      noFoundTip
    } = this.props
    const placeholder = this.localeDatasProps('placeholder')
    const {
      selectedItems,
      dropdownItems,
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
            clearable={clearable}
            dropdownShow={dropdownShow}
            placeholder={placeholder}
            selectedItems={selectedItems}
            dropdownItems={dropdownItems}
            moveFocusedIndex={this.moveFocusedIndex.bind(this)}
            onClick={this.handleInputClick.bind(this)}
            onDelete={this.deleteItem.bind(this)}
            onClear={this.deleteAllItems.bind(this)}
            onSearch={this.debouncedFilterItems.bind(this)}
            onEnterSelect={this.onEnterSelect.bind(this)}
          />
        </div>
        { children }
        <Popper show={dropdownShow} attachEle={this.selectInputContainer} className='hi-select__popper'>
          <SelectDropdown
            noFoundTip={noFoundTip}
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

export default Provider(Select)
