import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Base from './Base'
import EventManager from './common'
class CheckBox extends Component {
  static _type = 'CheckBox'
  static propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    trueValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    falseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    list: PropTypes.array
  }
  static defaultProps = {
    checked: false,
    value: ''
  }
  constructor (props) {
    super(props)
    this.state = {
      checked: props.checked,
      checkedList: [],
      selectStatus: props.all ? 'none' : undefined// none 无  part 部分  all 全部
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount () {
    EventManager.setEvent(this.props.all || this.props.name, this.props.onChange)
    // this.parseNode()
  }
  parseNode () {
    const {list} = this.props
    list && list.map((item) => {
      if (item.checked) {
        // array.push(props.trueValue || props.value || props.children)
        this.groupChangeEvent(true, item.trueValue || item.value || item.text)
      }
    })
  }
  groupChangeEvent (isChecked, val) {
    // let {checkedList} = this.state
    // if (isChecked) {
    //   checkedList.push(val)
    // } else {
    //   checkedList.splice(checkedList.indexOf(val), 1)
    // }
    // this.setState({
    //   checkedList
    // }, () => {
    //   this.props.onChange && this.props.onChange(this.state.checkedList)
    // })
  }
  handleChange (data) {
    const {all, value, name, target} = data
    let onChange = this.props.onChange || (() => {})
    if (all) {
      onChange(value)
    } else if (name) {
      let checkedList = []
      let nList = document.querySelectorAll(`[name=${name}]`)
      Array.from(nList).forEach(item => {
        item.checked && checkedList.push(item.value)
      })
      onChange = EventManager.getEvent(name)
      onChange && onChange(checkedList, target)
    } else {
      onChange(target)
    }
    // if (oneOf || oneOfAll) {
    //   let checkedList = []
    //   let nList = document.querySelectorAll(`[name=${name}]`)
    //   Array.from(nList).forEach(item => {
    //     item.checked && checkedList.push(item.value)
    //   })
    //   console.log('多个中的', checkedList)
    // }
    // if (isAll) {
    //   this.props.onChange && this.props.onChange(val)
    //   console.log('执行全选事件', val)
    // } else {
    //   let nList = document.querySelectorAll(`[name=${name}]`)
    //   let checkedList = []
    //   Array.from(nList).forEach(item => {
    //     item.checked && checkedList.push(item.value)
    //   })
    //   console.log('全选中的单选', val, checkedList)
    // }
  }
  renderCheckBoxGroup (list) {
    return <div>
      {
        list && list.map((item, index) => {
          if (typeof item === 'object') {
            return <Base {...item} key={index} onChange={this.handleChange} name={this.props.name} />
          } else if (typeof item === 'string') {
            return <Base text={item} key={index} onChange={this.handleChange} name={this.props.name} />
          }
        })
      }
    </div>
  }
  render () {
    const {list} = this.props
    if (list) {
      return this.renderCheckBoxGroup(list)
    }
    // if (all) {
    //   return <Base {...this.props} onChange={this.handleChange}/>
    // }
    return <Base {...this.props} onChange={this.handleChange} />
    // return (
    //   list ? this.renderCheckBoxGroup(list) : <Base {...this.props} onChange={this.handleChange} />
    // )
  }
}

export default CheckBox
