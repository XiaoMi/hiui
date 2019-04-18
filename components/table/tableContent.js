import React, { Component } from 'react'
import Body from './body'
import Header from './header'

export default class TableContent extends Component {
  constructor (props) {
    super(props)
    this.dom = React.createRef()
  }
  render () {
    let {columns, className, style, head = true, body = true, ...rest} = this.props
    rest.columns = columns

    return (
      <table className={className} style={style} ref={this.dom}>
        <colgroup>
          {columns.map((item, index) => {
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
          ? <Header {...rest} /> : null
        }
        {body
          ? <Body {...rest} /> : null
        }
      </table>
    )
  }
}
