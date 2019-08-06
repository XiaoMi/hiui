import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './pover.css'
import {insertAfter} from './tool'

class Pover extends Component {
  state={
    value: ''
  }

  render () {
    let {slot, remove, onOk, action} = this.props
    let {value} = this.state

    let form = null
    switch (action) {
      case 'input':
        form = <input value={value} onChange={(e) => this.setState({value: e.target.value})} />
        break
      case 'select':
        form = (
          <select>
            <option value={'小孩'}>小孩</option>
            <option value={'青年'}>青年</option>
            <option value={'老年'}>老年</option>
          </select>
        )
        break

      default:
        break
    }

    return (

      <div >

        <div className={'title'}>
          {slot}
        </div>
        <div className={'form'}>
          {form}
        </div>
        <div className={'pover-action'}>
          <span
            onClick={remove}>取消</span>
          <span
            onClick={() => {
              onOk(value)
              remove()
            }}
          >确定</span>
        </div>
      </div>
    )
  }
}

export default ({ target, title, onOk, action = false }) => {
  target.parentNode.style.position = 'relative'
  let div = document.createElement('div')
  div.className = 'pover'
  div.style.position = 'absolute'

  insertAfter(div, target)

  let remove = () => {
    ReactDOM.unmountComponentAtNode(div)
    target.parentNode.removeChild(div)
  }

  ReactDOM.render(<Pover slot={title} remove={remove} onOk={onOk} action={action} />, div)
}
