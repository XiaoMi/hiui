import React, { Component } from 'react'
import Body from './Body'
import Header from './Header'

export default class TableContent extends Component {
  constructor (props) {
    super(props)
    this.dom = React.createRef()
  }
  render () {
    let {columns, className, style, head = true, body = true, parent, ...rest} = this.props
    rest.columns = columns
    let showColumns = rest.columns.filter(item => !item.hide)
    let showHeaderColumns = rest.headerColumns.filter(item => !item.hide)
    if (rest.headerColumns.length > 1 && parent.setting && parent.setting.current) {
      parent.setting.current.style.display = 'none'
    }

    return (
      <table className={className} style={style} ref={this.dom}>
        <colgroup>
          {showColumns.map((item, index) => {
            let sty = {}
            if (item.width) {
              sty.minWidth = parseInt(item.width) + 'px'
              sty.width = parseInt(item.width) + 'px'
            }

            return (
              <col
                style={sty}
                key={'col-' + index} />
            )
          })}
        </colgroup>
        {head
          ? <Header {...rest} columns={showColumns} showHeaderColumns={showHeaderColumns} parent={parent} ref={this.tableHeader} /> : null
        }
        {body
          ? <Body {...rest} columns={showColumns} showHeaderColumns={showHeaderColumns} parent={parent} /> : null
        }
      </table>
    )
  }
}
