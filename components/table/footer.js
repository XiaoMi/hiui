import React, { Component } from 'react'

class Footer extends Component {
  getSum (item) {
    const {
      dataSource
    } = this.props
    return dataSource.map(dataItem => dataItem[item.dataIndex]).reduce((pre, next) => pre + next)
  }
  getAve (item) {
    const {
      dataSource
    } = this.props
    return this.getSum(item) / (dataSource.length)
  }
  render () {
    const {
      columns,
      dataSource
    } = this.props

    let nodes = columns.map((item, index) => {
      if (item.type === 'sum') {
        return (
          <td>
            合计：{this.getSum(item)}
          </td>
        )
      }
      if (item.type === 'ave') {
        return (
          <td>
            均值：{this.getAve(item)}
          </td>
        )
      }

      if (index === 0) {
        return (
          <td>记录：{dataSource.length}条数据</td>
        )
      }
      return <td />
    })

    return (
      <tr>
        {nodes}
      </tr>
    )
  }
}

export default Footer
