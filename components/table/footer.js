import React, { Component } from 'react'

class Footer extends Component {
  getSum (item) {
    const {
      dataSource
    } = this.props
    return dataSource.length > 0 ? dataSource.map(dataItem => dataItem[item.dataIndex]).reduce((pre, next) => pre + next) : 0
  }

  getSumNodes () {
    const {
      columns
    } = this.props
    const tds = columns.map((item, index) => {
      if (item.type === 'number') {
        return (
          <td>
            {this.getSum(item)}
          </td>
        )
      }
      if (index === 0) {
        return (
          <td>合计</td>
        )
      }
      return <td />
    })
    return <tr>{tds}</tr>
  }
  getAveNodes () {
    const {
      columns,
      dataSource
    } = this.props
    const tds = columns.map((item, index) => {
      if (item.type === 'number') {
        let num = this.getSum(item) / dataSource.length

        return (
          <td>
            {Math.round(num * 100) / 100}
          </td>
        )
      }
      if (index === 0) {
        return (
          <td>均值</td>
        )
      }
      return <td />
    })
    return <tr>{tds}</tr>
  }

  render () {
    const {
      advance,
      dataSource
    } = this.props

    return (
      <React.Fragment >
        {dataSource.length > 0 && advance && advance.sum && this.getSumNodes()}
        {dataSource.length > 0 && advance && advance.avg && this.getAveNodes()}
      </React.Fragment>
    )
  }
}

export default Footer
