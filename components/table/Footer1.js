import React, { Component } from 'react'
import prifix from './prefix'
import { Decimal } from 'decimal.js'

class Footer extends Component {
  getSum (item) {
    const {
      dataSource = [],
      advance: {
        suffix = [],
        prefix = []
      }
    } = this.props
    let res = [
      ...prefix,
      ...dataSource,
      ...suffix
    ].map(data => data[item.dataIndex])

    let total = new Decimal(0)
    res.forEach((item, index) => {
      total = total.plus(new Decimal(item))
    })
    return total.valueOf()
  }

  getSumNodes () {
    const {
      columns
    } = this.props
    const tds = columns.map((item, index) => {
      let key = 'sum-' + index
      if (item.type === 'number') {
        return (
          <td className={prifix('table-col')} key={key}>
            {this.getSum(item)}
          </td>
        )
      }
      if (index === 0) {
        return (
          <td key='sum-name'>合计</td>
        )
      }
      return <td className={prifix('table-col')} key={key} />
    })
    return <tr className={prifix('table-row')} key='sum-nodes'>{tds}</tr>
  }

  getAveNum (item) {
    const {
      dataSource = [],
      advance: {
        suffix = [],
        prefix = []
      }
    } = this.props
    let data = [
      ...prefix,
      ...dataSource,
      ...suffix
    ]
    return new Decimal(this.getSum(item)).dividedBy(data.length).toFixed(2).valueOf() * 1
  }

  getAveNodes () {
    const {
      columns
    } = this.props
    const tds = columns.map((item, index) => {
      let key = 'ave-' + index
      if (item.type === 'number') {
        return (
          <td key={key}>
            {this.getAveNum(item)}
          </td>
        )
      }
      if (index === 0) {
        return (
          <td className={prifix('table-col')} key={key}>均值</td>
        )
      }
      return <td className={prifix('table-col')} key={key} />
    })
    return <tr className={prifix('table-row')} key='ave-nodes'>{tds}</tr>
  }
  getSuffixNodes () {
    const {
      columns,
      advance
    } = this.props

    return advance.suffix.map((suf, index) => {
      let key = 'suf-' + index
      return (
        <tr className={prifix('table-row')} key={key}>{
          columns.map((item, j) => {
            return <td className={prifix('table-col')} key={`${key}-${item.dataIndex}-${index}-${j}`}>{suf[item.dataIndex]}</td>
          })
        }</tr>
      )
    })
  }

  render () {
    const {
      advance,
      dataSource
    } = this.props

    return (
      <React.Fragment >
        {advance && advance.suffix && this.getSuffixNodes()}
        {dataSource.length > 0 && advance && advance.sum && this.getSumNodes()}
        {dataSource.length > 0 && advance && advance.avg && this.getAveNodes()}
      </React.Fragment>
    )
  }
}

export default Footer
