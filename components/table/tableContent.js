import React, { Component } from 'react'
import Body from './body'
import Header from './header'

export default class TableContent extends Component {
  render () {
    let {columns, className, style, head = true, body = true, ...rest} = this.props

    // 隐藏列
    columns = columns.filter(item => !item.hide)
    rest.columns = columns
    // rest.headerColumns = rest.headerColumns.filter(item => !item.hide)
    return (
      <table className={className} style={style}>
        <colgroup>
          {columns.map((item, index) => {
            let sty = {}
            if (item.width) {
              sty.width = item.width + 'px'
            }

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
}
