import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import shallowEqual from 'shallowequal'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import Popper from '../popper'
import SelectInput from './SelectInput'
import SelectDropdown from './SelectDropdown'
import Provider from '../context'
import fetchJsonp from 'fetch-jsonp'
class Select extends Component {
  autoloadFlag = true // 第一次自动加载数据标识

  static propTypes = {
    type: PropTypes.oneOf(['single', 'multiple']),
    multipleWrap: PropTypes.oneOf(['wrap', 'nowrap']),
    data: PropTypes.array,
    dataSource: PropTypes.object,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number
    ]),
    showCheckAll: PropTypes.bool,
    autoload: PropTypes.bool,
    searchable: PropTypes.bool,
    clearable: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    emptyContent: PropTypes.string,
    optionWidth: PropTypes.number,
    style: PropTypes.object,
    onChange: PropTypes.func,
    render: PropTypes.func,
    open: PropTypes.bool
  }

  static defaultProps = {
    data: [],
    type: 'single',
    multipleWrap: 'nowrap',
    disabled: false,
    clearable: true,
    defaultValue: '',
    autoload: false,
    placeholder: '请选择',
    emptyContent: '无内容',
    showCheckAll: false,
    open: true,
    onClick: () => {},
    onBlur: () => {},
    onFocus: () => {}
  }

  constructor (props) {
    super(props)

    const { data, value, defaultValue } = props
    const dropdownItems = cloneDeep(data)
    const initialValue = value === undefined ? defaultValue : value
    const selectedItems = this.resetSelectedItems(initialValue, dropdownItems)
    const searchable = this.getSearchable()
    this.debouncedFilterItems = debounce(this.onFilterItems.bind(this), 300)
    this.clickOutsideHandel = this.clickOutside.bind(this)

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
        width: 2
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
    const selectInput = ReactDOM.findDOMNode(this.selectInput)
    if (selectInput && selectInput.contains(e.target)) {
      return
    }
    this.hideDropdown()
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.value, this.props.value)) {
      const selectedItems = this.resetSelectedItems(
        nextProps.value,
        this.state.dropdownItems
      ) // 异步获取时会从内部改变dropdownItems，所以不能从list取

      this.setState({
        selectedItems
      })
    }
    if (!shallowEqual(nextProps.data, this.props.data)) {
      const selectedItems = this.resetSelectedItems(
        nextProps.value,
        nextProps.data,
        true
      )
      this.setState({
        selectedItems,
        dropdownItems: cloneDeep(nextProps.data)
      })
    }
  }

  getSearchable () {
    const { searchable } = this.props

    if (this.isRemote()) {
      return true
    }
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
    const { dataSource } = this.props
    return dataSource && !!dataSource.url
  }

  resetSelectedItems (value, dropdownItems, listChanged = false) {
    const values = this.parseValue(value)
    const selectedItems =
      listChanged && this.props.type === 'multiple'
        ? this.state.selectedItems
        : [] // 如果是多选，dropdownItems有改动，需要保留之前的选中值

    dropdownItems &&
      dropdownItems.map((item) => {
        if (values.indexOf(item.id) !== -1) {
          const itemIndex = selectedItems.findIndex((sItem) => {
            // 多选时检查是否已选中
            return sItem.id === item.id
          })

          itemIndex === -1 && selectedItems.push(item)
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
    const { dropdownItems, focusedIndex } = this.state
    const item = dropdownItems[focusedIndex]

    this.onClickOption(item, focusedIndex)
  }

  onChange (selectedItems, changedItems, callback) {
    const { onChange, value } = this.props
    value === undefined &&
      this.setState(
        {
          selectedItems
        },
        callback
      )
    const selectedIds = selectedItems.map(({ id }) => id)
    onChange && onChange(selectedIds, changedItems)
  }

  checkAll (e) {
    // 全选
    e && e.stopPropagation()

    const { dropdownItems, selectedItems } = this.state
    let _selectedItems = [...selectedItems]
    let changedItems = []
    dropdownItems.forEach((item) => {
      if (!item.disabled && this.matchFilter(item)) {
        if (
          !_selectedItems.map((selectItem) => selectItem.id).includes(item.id)
        ) {
          _selectedItems.push(item)
          changedItems.push(item)
        }
      }
    })
    this.onChange(_selectedItems, changedItems)
    this.selectInput.focus()
  }

  onClickOption (item, index) {
    if (!item || item.disabled) return

    let selectedItems = this.state.selectedItems.concat()
    let focusedIndex = index

    if (this.props.type === 'multiple') {
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

    this.onChange(selectedItems, item, () => {
      this.setState(
        {
          focusedIndex
        }
      )
    })
    if (this.props.type !== 'multiple') {
      this.hideDropdown()
    } else {
      this.selectInput.focus()
      this.clearKeyword() // 多选状态清空筛选
    }
  }

  clearKeyword () {
    this.setState(
      {
        keyword: ''
      },
      () => {
        this.selectInput.clearInput()
      }
    )
  }

  handleInputClick = (e) => {
    let { dropdownShow } = this.state

    if (dropdownShow) {
      this.hideDropdown()
      return
    }

    this.selectInput.focus()
    if (this.props.disabled) {
      return
    }

    if (!dropdownShow) {
      this.showDropdown()
    }
  }

  hideDropdown () {
    this.state.dropdownShow === true &&
      this.setState({ dropdownShow: false }, () => {
        this.clearKeyword()
      })
  }

  showDropdown () {
    this.state.dropdownShow === false && this.setState({ dropdownShow: true })
    this.selectInput.focus()
  }

  deleteItem (item) {
    if (item.disabled) return

    let selectedItems = this.state.selectedItems.concat()
    const sIndex = selectedItems.findIndex((obj, index, arr) => {
      return obj.id === item.id
    })

    selectedItems.splice(sIndex, 1)
    this.onChange(selectedItems, item, () => {
      this.selectInput.focus()
    })
  }
  // 全部删除
  deleteAllItems () {
    const { type } = this.props
    const focusedIndex = this.resetFocusedIndex()
    const changedItems = [...this.state.selectedItems]
    this.onChange(
      [],
      type === 'multiple' ? changedItems : changedItems[0],
      () => {
        this.setState({ focusedIndex })
        this.onFilterItems('')
      }
    )
  }

  remoteSearch (keyword) {
    let {
      url,
      transformResponse,
      error,
      params,
      headers,
      mode,
      data = {},
      type = 'GET',
      key = 'keyword',
      jsonpCallback = 'callback',
      ...options
    } = this.props.dataSource
    keyword =
      !keyword && this.autoloadFlag && this.props.autoload
        ? this.props.dataSource.keyword
        : keyword
    this.autoloadFlag = false // 第一次自动加载数据后，输入的关键词即使为空也不再使用默认关键词

    const queryParams = (() => {
      if (!queryParams) {
        return ''
      }
      if (typeof params === 'string') {
        return params
      }
      if (Object.prototype.toString.call(params) === '[object Object]') {
        return Object.keys(params)
          .map((key) => `&${key}=${params[key]}`)
          .join('')
      }
    })()

    url =
      url.indexOf('?') === -1
        ? `${url}?${[key]}=${keyword}${queryParams}`
        : `${url}&${[key]}=${keyword}${queryParams}`

    if (type.toUpperCase() === 'POST') {
      options.body = JSON.stringify(data)
    }
    this.setState({
      fetching: true
    })

    if (type.toUpperCase() === 'JSONP') {
      const _o = {
        jsonpCallback: jsonpCallback,
        jsonpCallbackFunction: jsonpCallback
      }
      fetchJsonp(url, _o)
        .then((res) => res.json())
        .then((json) => {
          this._setDropdownItems(json, transformResponse)
        })
    } else {
      /* eslint-disable */
      fetch(url, {
        method: type,
        ...options
      })
        .then((response) => response.json())
        .then(
          (res) => {
            this._setDropdownItems(res, transformResponse)
          },
          (err) => {
            error && error(err)
            this.setState({
              fetching: false
            })
          }
        )
    }
  }
  _setDropdownItems(res, func) {
    let dropdownItems = []
    if (func) {
      dropdownItems = func(res)
    } else {
      dropdownItems = res.data
    }
    if (Array.isArray(dropdownItems)) {
      const selectedItems = this.resetSelectedItems(
        this.props.value,
        dropdownItems,
        true
      )
      this.setState({
        dropdownItems,
        selectedItems
      })
    }
    this.setState({
      fetching: false
    })
  }
  onFilterItems(keyword) {
    this.setState(
      {
        keyword
      },
      () => this.resetFocusedIndex()
    )

    if (this.props.dataSource) {
      if (
        this.props.autoload ||
        keyword.toString().length >= this.state.queryLength
      ) {
        this.remoteSearch(keyword)
      }
    }
  }

  matchFilter(item) {
    const { searchable, keyword } = this.state
    return (
      this.isRemote() ||
      (!searchable || !keyword) ||
      (searchable &&
        keyword &&
        (String(item.id).includes(keyword) ||
          String(item.title).includes(keyword)))
    )
  }

  resetFocusedIndex(setState = true) {
    let focusedIndex = -1

    this.state.dropdownItems.every((item) => {
      focusedIndex++
      if (!item.disabled && this.matchFilter(item)) {
        return false
      }
      return true
    })
    setState &&
      this.setState({
        focusedIndex
      })
    return focusedIndex
  }

  setFocusedIndex(focusedIndex) {
    this.setState({ focusedIndex })
  }

  moveFocusedIndex(direction) {
    let { focusedIndex } = this.state
    const { dropdownItems } = this.state

    if (direction === 'up') {
      dropdownItems
        .slice(0, focusedIndex)
        .reverse()
        .every((item) => {
          focusedIndex--
          if (!item.disabled && this.matchFilter(item)) {
            return false
          }
          return true
        })
    } else {
      dropdownItems.slice(focusedIndex + 1).every((item) => {
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

  localeDatasProps(key) {
    const { localeDatas } = this.props
    if (this.props[key]) {
      return this.props[key]
    } else {
      return localeDatas.select[key]
    }
  }

  render() {
    const {
      type,
      showCheckAll,
      className,
      disabled,
      clearable,
      style,
      children,
      emptyContent,
      optionWidth,
      render,
      multipleWrap,
      onClick,
      onBlur,
      onFocus
    } = this.props
    const placeholder = this.localeDatasProps('placeholder')
    const {
      selectedItems,
      dropdownItems,
      searchable,
      dropdownShow,
      focusedIndex,
      fetching
    } = this.state
    const extraClass = {
      'is-multiple': type === 'multiple',
      'is-single': type === 'single'
    }

    return (
      <div
        className={classNames('hi-select', className, extraClass)}
        style={style}
      >
        <div
          className="hi-select__input-container"
          ref={(node) => {
            this.selectInputContainer = node
          }}
        >
          <SelectInput
            ref={(node) => {
              this.selectInput = node
            }}
            mode={type}
            disabled={disabled}
            searchable={searchable}
            clearable={clearable}
            dropdownShow={dropdownShow}
            placeholder={placeholder}
            selectedItems={selectedItems}
            dropdownItems={dropdownItems}
            multipleMode={multipleWrap}
            container={this.selectInputContainer}
            moveFocusedIndex={this.moveFocusedIndex.bind(this)}
            onClick={() => {
              if (this.props.open) {
                this.handleInputClick()
              }
              onClick()
            }}
            onBlur={onBlur}
            onFocus={onFocus}
            onDelete={this.deleteItem.bind(this)}
            onClear={this.deleteAllItems.bind(this)}
            onSearch={this.debouncedFilterItems.bind(this)}
            onEnterSelect={this.onEnterSelect.bind(this)}
          />
        </div>
        {children}
        <Popper
          show={dropdownShow && this.props.open}
          attachEle={this.selectInputContainer}
          zIndex={1050}
          topGap={5}
          className="hi-select__popper"
          placement="top-bottom-start"
        >
          <SelectDropdown
            noFoundTip={emptyContent}
            mode={type}
            showCheckAll={showCheckAll}
            checkAll={this.checkAll.bind(this)}
            loading={fetching}
            focusedIndex={focusedIndex}
            matchFilter={this.matchFilter.bind(this)}
            setFocusedIndex={this.setFocusedIndex.bind(this)}
            optionWidth={optionWidth}
            dropdownItems={dropdownItems}
            selectedItems={selectedItems}
            dropdownRender={render}
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
