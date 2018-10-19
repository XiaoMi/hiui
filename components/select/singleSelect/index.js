import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SelectInput from './selectInput/SelectInput'
import SelectDropdown from './selectDropdown/SelectDropdown'
import $$ from '../tool.js'
import './index.scss'
function Guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

let timer = null

class SingleSelect extends Component {
  static propTypes = {
    mode: PropTypes.string,
    width: PropTypes.string,
    name: PropTypes.string,
    list: PropTypes.array,
    onChange: PropTypes.func
  }

  static defaultProps = {}

  constructor (props) {
    super(props)
    this.state = {
      queryLength: 1,
      showDropdown: false,
      selectedItem: {},
      dropdownList: this.props.list || [],
      dropdownDisplay: false,
      keyword: '',
      searchInput: {
        width: '2px'
      },
      uuid: Guid()
    }
  }
  componentDidMount () {
    window.addEventListener('click', this.hideDrop.bind(this))
    this.propsUpdate(this.props, false)
  }

  hideDrop () {
    this.setState({dropdownDisplay: false})
  }

  showDrop () {
    this.setState({dropdownDisplay: true})
  }

  handleInputClick (e) {
    if (e) {
      e.stopPropagation()
    }

    const disabled = this.props.disabled

    if (disabled) {
      return
    }

    let {
      dropdownDisplay
    } = this.state

    if (!dropdownDisplay) {
      this.showDrop()
    }
  }

  // 输入框键盘输入
  handleInputSearch (evt) {
    const keyword = evt.target.value
    let dropdownList = []

    if (this.props.origin) {
      clearTimeout(timer)
      dropdownList = []

      const {
        url,
        func,
        type
      } = this.props

      if (keyword.toString().length < this.state.queryLength) return

      timer = setTimeout(() => {
        $$.ajax({
          url: url,
          type: type || 'GET',
          data: {
            keyword: keyword
          },
          success: data => {
            if (func) {
              dropdownList = func(data)
            } else {
              dropdownList = data
            }

            if (dropdownList[0]) {
              dropdownList[0].isFirstFilter = true
            }

            this.setState({
              keyword,
              dropdownList
            })
          },
          error: ex => {}
        })
      }, 500)
    } else {
      dropdownList = this.state.dropdownList

      for (var i = 0; i < dropdownList.length; i++) {
        var item = dropdownList[i]
        if (item.name.match(keyword) && keyword !== '') {
          item.isFirstFilter = true
          break
        } else {
          item.isFirstFilter = false
        }
      }

      this.setState({
        keyword,
        dropdownList
      })
    }
  }

  // 下拉框选择(包括键盘输入enter选择)
  handleDropdownSelect (item, dropdownIndex, selected) {
    const { onChange } = this.props
    var dropdownList = this.state.dropdownList.concat()
    this.resetDropdownList(dropdownList)
    dropdownList[dropdownIndex].selected = true
    dropdownList[dropdownIndex].isFirstFilter = false
    if (item.enabled === 'false') return
    this.refs.selectInputChild.setInputVisbility(false)
    this.setState({
      selectedItem: item,
      dropdownList,
      keyword: '',
      dropdownDisplay: false
    })
    this.refs.selectInputChild.searchInput.value = ''
    this.refs.selectInputChild.searchInput.blur()
    onChange && onChange(item)
  }
  resetDropdownList (dropdownList) {
    dropdownList.forEach(item => {
      item.selected = false
      item.itemisFirstFilter = false
    })
  }

  handleFocus () {
    let {
      origin
    } = this.props
    let {
      dropdownList
    } = this.state

    if (origin) {
      dropdownList = []
    }

    dropdownList[0] && (dropdownList[0].isFirstFilter = true)

    setTimeout(() => {
      this.setState({
        dropdownList
      })
    }, 50)
  }
  handleClear () {
    var dropdownList = this.state.dropdownList.concat()
    this.resetDropdownList(dropdownList)
    if (this.props.origin) {
      dropdownList = []
    } else {
      dropdownList = this.state.dropdownList.concat()
      this.resetDropdownList(dropdownList)
    }
    this.setState({
      selectedItem: {},
      dropdownList
    })
    this.props.onChange && this.props.onChange(null)
  }
  upDownSelect (arrow) {
    const dropdownList = this.state.dropdownList.concat()
    let curActiveIndex = dropdownList.findIndex((obj, index, arr) => {
      return obj.isFirstFilter === true
    })

    if (arrow === 'up' && curActiveIndex - 1 > -1) {
      dropdownList[curActiveIndex].isFirstFilter = false
      dropdownList[curActiveIndex - 1].isFirstFilter = true
    } else if (arrow === 'down' && curActiveIndex + 1 < dropdownList.length) {
      dropdownList[curActiveIndex].isFirstFilter = false
      dropdownList[curActiveIndex + 1].isFirstFilter = true
    }

    this.setState({
      dropdownList
    })
  }

  setActive (index) {
    const dropdownList = this.state.dropdownList

    dropdownList.map((v, i) => {
      if (i === +index && !v.disabled) {
        v.isFirstFilter = true
      } else {
        v.isFirstFilter = false
      }
    })

    this.setState({dropdownList})
  }

  renderDropdown () {
    const mode = this.props.mode
    const pos = this.refs.selectRoot ? this.refs.selectRoot.getBoundingClientRect() : {left: 0, top: 0, width: 0}
    return this.state.dropdownDisplay ? (
      <SelectDropdown
        keyword={this.state.keyword}
        dropdownList={this.state.dropdownList}
        onDropdownSelect={this.handleDropdownSelect.bind(this)}
        mode={mode}
        setActive={this.setActive.bind(this)}
        position={pos}
      />
    ) : null
  }
  componentWillReceiveProps (nextProps) {
    this.propsUpdate(nextProps, true)
  }
  propsUpdate (nextProps, canChange) {
    if (this.props.value === nextProps.value && this.props.list === nextProps.list && canChange) {
      return
    }

    if (Array.isArray(nextProps.list)) {
      if (nextProps.value !== undefined && nextProps.value !== null) {
        var arr = []
        var selectedItem = {}
        nextProps.list.map((item) => {
          if (item.id === nextProps.value) {
            item.selected = true
            selectedItem = item
          } else {
            item.selected = false
          }
          arr.push(item)
        })
        this.setState({
          selectedItem: selectedItem,
          dropdownList: arr
        })
      } else if (JSON.stringify(nextProps.list) !== JSON.stringify(this.props.list)) {
        this.setState({
          dropdownList: nextProps.list
        })
      }
    }

    if (this.props.value !== nextProps.value && canChange) {
      nextProps.onChange && nextProps.onChange(JSON.stringify(selectedItem) === '{}' ? '' : selectedItem)
    }
  }

  render () {
    return (
      <div className={`single-select-container`} ref='selectRoot'>
        <SelectInput
          ref='selectInputChild'
          placeholder={this.props.placeholder}
          selectedItem={this.state.selectedItem || {}}
          dropdownList={this.state.dropdownList || []}
          onSearch={this.handleInputSearch.bind(this)}
          onEnterSelect={this.handleDropdownSelect.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onClick={this.handleInputClick.bind(this)}
          onClear={this.handleClear.bind(this)}
          upDownSelect={this.upDownSelect.bind(this)}
          isActive={this.state.dropdownDisplay}
          disabled={this.props.disabled}
        />
        {this.renderDropdown()}
      </div>
    )
  }
}

export default SingleSelect
