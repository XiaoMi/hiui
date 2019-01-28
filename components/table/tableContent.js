import React, { Component } from 'react'
import Body from './body'
import Header from './header'
import {getStyle} from './tool'

function configColumns (columns) {
  let totalWidth = 0
  columns = columns.filter(item => !item.hide).map(item => {
    item.width = item.width || '100'
    item.width = parseInt(item.width) + 'px'
    item.minWidth = item.width
    totalWidth += parseInt(item.width)
    return item
  })
  return [totalWidth, columns]
}

export default class TableContent extends Component {
  constructor (props) {
    super(props)
    this.dom = React.createRef()
  }
  render () {
    let {columns, className, style, head = true, body = true, ...rest} = this.props

    // 隐藏列
    let [totalWidth, col] = configColumns(columns)
    rest.columns = col
    // rest.headerColumns = rest.headerColumns.filter(item => !item.hide)
    style.minWidth = totalWidth + 'px'

    return (
      <table className={className} style={style} ref={this.dom}>
        <colgroup>
          {col.map((item, index) => {
            let sty = {}
            sty.minWidth = item.width
            sty.width = item.width
            sty.boxSizing = 'border-box'

            return (
              <col
                style={sty}
                key={'col-' + index} />
            )
          })}
        </colgroup>
        {head
          ? <Header {...rest} /> : null
        }
        {body
          ? <Body {...rest} /> : null
        }
      </table>
    )
  }

  fix () {
    let {columns} = this.props
    let [totalWidth, col] = configColumns(columns)
    let tr = this.dom.current.querySelector('tbody tr')
    if (!tr) {
      return
    }
    let td = tr.querySelectorAll('td')
    if (td.length === 0) {
      return
    }

    let sum = 0
    td.forEach((d, i) => {
      let realWidth = parseInt(getStyle(d, 'width'))
      let wrongWidth = parseInt(col[i].width)
      if (wrongWidth < realWidth) {
        sum += realWidth - wrongWidth
      }
    })
    totalWidth += sum
    this.dom.current.style.minWidth = totalWidth + 'px'
  }

  componentDidMount () {
    this.fix()
  }

  componentDidUpdate () {
    this.fix()
    //
  }
}
