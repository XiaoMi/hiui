import React, { Component } from 'react'
import SelectInput from './selectInput/SelectInput'
import SelectDropdown from './selectDropdown/SelectDropdown'
import $$ from '../tool.js'
import './index.scss'

let timer = null

class GeneralSelect extends Component {
  constructor (props) {
    super(props)

    let list = this.props.list
    list = list ? JSON.parse(JSON.stringify(list)) : []

    this.state = {
      queryLength: 1,
      showDropdown: false,
      selectedList: [],
      dropdownList: list,
      dropdownDisplay: 'hide',
      keyword: '',
      searchInput: {
        width: '2px'
      }
    }
  }
  componentDidMount () {
    window.addEventListener('click', this.hideDrop.bind(this))
    this.propsUpdate(this.props)
  }

  hideDrop () {
    this.setState({dropdownDisplay: 'hide'})
  }

  showDrop () {
    this.setState({dropdownDisplay: 'show'})
  }

  handleInputClick (e) {
    if (e) {
      e.stopPropagation()
    }

    if (this.props.disabled) {
      return
    }

    let {
      dropdownDisplay
    } = this.state

    if (dropdownDisplay !== 'show') {
      this.showDrop()
    }
  }

  // 输入框键盘输入
  handleInputSearch (evt) {
    const keyword = evt.target.value
    let dropdownList = []

    if (this.props.origin) {
      clearTimeout(timer)
      const {
        url,
        func,
        type
      } = this.props.origin

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
  // 搜索输入框 删除某个
  handleSearchInputDelete (val) {
    var selectedList = this.state.selectedList.concat()
    var dropdownList = this.state.dropdownList.concat()
    const sIndex = selectedList.findIndex((obj, index, arr) => {
      return obj.id === val
    })
    selectedList.splice(sIndex, 1)
    var dIndex = dropdownList.findIndex((obj, index, arr) => {
      return obj.id === val
    })
    dropdownList[dIndex].selected = false
    this.setState({
      dropdownList,
      selectedList
    })
    this.props.onChange && this.props.onChange(selectedList)
  }

  // 全部删除
  deleteAll () {
    const dropdownList = this.state.dropdownList

    dropdownList.map((v) => {
      v.selected = false
    })

    this.setState({
      dropdownList,
      selectedList: []
    })
  }

  // 键盘删除
  handleEndDelete () {
    var selectedList = this.state.selectedList.concat()
    var sValue = selectedList[selectedList.length - 1].id
    var dropdownList = this.state.dropdownList.concat()
    var dIndex = dropdownList.findIndex((obj, index, arr) => {
      return obj.id === sValue
    })
    dropdownList[dIndex].selected = false
    selectedList.splice(selectedList.length - 1, 1)
    this.setState({
      dropdownList,
      selectedList
    }, () => {
      this.props.onChange && this.props.onChange(selectedList)
    })
  }

  // 下拉框选择(包括键盘输入enter选择)
  handleDropdownSelect (item, dropdownIndex) {
    if (!item || item.enabled === 'false') return
    let isOverIndex = this.state.selectedList.findIndex((sItem) => {
      return sItem.id === item.id
    })
    let isSelect = false
    if (isOverIndex === -1) isSelect = true
    var selectedList = this.state.selectedList.concat()
    var dropdownList = this.state.dropdownList.concat()

    dropdownList[dropdownIndex].selected = isSelect
    dropdownList[dropdownIndex].isFirstFilter = false
    this.refs.selectInputChild.focus()

    // 去重处理
    let newSelectedList = []
    if (isSelect) {
      newSelectedList = selectedList.concat()
      newSelectedList.push(item)
    } else {
      selectedList.map((sItem) => {
        if (sItem.id !== item.id) {
          newSelectedList.push(sItem)
        }
      })
    }

    this.setState({
      selectedList: newSelectedList,
      dropdownList
    }, () => {
      this.props.onChange && this.props.onChange(newSelectedList)
      // this.refs.selectInputChild.clear()
    })
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
      curActiveIndex > -1 && (dropdownList[curActiveIndex].isFirstFilter = false)
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

  dropClick (e) {
    if (e) {
      e.stopPropagation()
    }
  }

  renderDropdown () {
    return this.state.dropdownDisplay === 'show' ? (
      <SelectDropdown
        keyword={this.state.keyword}
        dropdownList={this.state.dropdownList}
        onDropdownSelect={this.handleDropdownSelect.bind(this)}
        setActive={this.setActive.bind(this)}
        onClick={this.dropClick.bind(this)}
      />
    ) : null
  }
  componentWillReceiveProps (nextProps) {
    this.propsUpdate(nextProps)
  }
  propsUpdate (nextProps) {
    const list = nextProps.list
    if (Array.isArray(list)) {
      if (nextProps.value !== undefined && nextProps.value !== null) {
        var selectedArr = nextProps.value.split(',')
        var selectedList = []
        var dropdownList = list ? JSON.parse(JSON.stringify(list)) : []

        dropdownList.map((item) => {
          item.selected = false
          selectedArr.map((sItem) => {
            if (sItem === item.id) {
              item.selected = true
              selectedList.push(item)
            }
          })
        })

        this.setState({
          selectedList: selectedList,
          dropdownList: dropdownList
        })
      } else if (JSON.stringify(nextProps.list) !== JSON.stringify(this.props.list)) {
        this.setState({
          dropdownList: nextProps.list
        })
      }
    }
    if (this.props.value !== nextProps.value) {
      nextProps.onChange && nextProps.onChange(selectedList)
    }
  }

  render () {
    const {
      placeholder,
      disabled
    } = this.props

    return (
      <div className='multiple-select-container'>
        <SelectInput
          ref='selectInputChild'
          selectedList={this.state.selectedList || []}
          dropdownList={this.state.dropdownList || []}
          onSearch={this.handleInputSearch.bind(this)}
          onDelete={this.handleSearchInputDelete.bind(this)}
          // onEndDelete={() => { this.handleEndDelete.bind(this) }}
          onEnterSelect={this.handleDropdownSelect.bind(this)}
          onClick={this.handleInputClick.bind(this)}
          deleteAll={this.deleteAll.bind(this)}
          isActive={this.state.dropdownDisplay === 'show'}
          upDownSelect={this.upDownSelect.bind(this)}
          placeholder={placeholder}
          disabled={disabled}
        />
        {this.renderDropdown()}
      </div>
    )
  }
}

export default GeneralSelect
