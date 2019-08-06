import React, { Component } from 'react'
import Icon from '../icon'
import '../icon/style'
import prifix from './prefix'
import Footer from './Footer'
// 点击后会展开的那个图标
class Expand extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }
  render () {
    let {rowItem} = this.props

    return (
      <div onClick={this.handleClick} data-open={false} >
        {rowItem.ishiuitableopen
          ? <Icon name={'down'} style={{fontSize: '14px'}} />
          : <Icon name={'right'} style={{fontSize: '14px'}} />}
      </div>
    )
  }
  handleClick = (e) => {
    let {addExpand, colItem, index, rowItem} = this.props
    addExpand(e, rowItem, index, colItem)
  }
}

let defaultRender = (text, record, index) => {
  return text
}

class Row extends Component {
  constructor (props) {
    super(props)
    this.state = {
      picked: false
    }
  }

  render () {
    const {
      selectedRowKeys,
      expand,
      k,
      parent,
      highlightRows
    } = this.props
    let classNames = {
      'table-row': true,
      picked: selectedRowKeys.includes(k) || highlightRows.includes(k),
      expand,
      test: 't'
    }

    return (
      <tr key={k} onDoubleClick={(e) => {
        if (!k.toString()) {
          return
        }
        if (highlightRows.includes(k)) {
          highlightRows.splice(highlightRows.indexOf(k), 1)
        } else {
          highlightRows.push(k)
        }
        parent.setState({
          highlightRows
        })
      }} className={prifix(classNames)}>{this.props.children}</tr>
    )
  }
}

export default class Body extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pickedRows: []
    }
  }

  render () {
    let {columns, dataSource, cbs: {addExpand}, rowSelection = { }, highlightCols, advance, ...rest} = this.props
    columns = columns.filter(item => !item.hide)
    let selectedRowKeys = rowSelection.selectedRowKeys || []
    // 表头分组
    let i = 0
    let pureData = dataSource.filter(item => !item.expand)
    let nodes = dataSource.map((item, k) => {
      let colSpan = 1
      let tr = []
      // 点击后展开的那一行
      if (item.expand) {
        let obj = pureData.find(o => o.key === item.parent)
        let expand = columns.find(o => o.type === 'expand')
        tr = expand ? <td colSpan={columns.length} key={'key-' + item.parent} className={prifix('table-col', highlightCols.includes(item.key) ? 'picked' : null)} >
          {expand.render(obj[item.dataIndex], obj, pureData.indexOf(obj))}
        </td> : null
      } else {
        // 扩展项的占位dom

        // 这里只能用for循环，因为会有表格 行列 合并的情况，要改变循环的顺序
        for (let j = 0; j < columns.length;) {
          let obj = columns[j]
          let td

          let rowSpan = 1

          // 点击后会展开的那个图标
          if (obj.type === 'expand') {
            // {/*<div key={'td-' + k + '-' + j} onClick={(e) => addExpand(e, obj)} data-index={k} data-open={false}> > </div>*/}
            td = <Expand key={k} addExpand={addExpand} data-index={k} data-open={false} colItem={obj} index={k} rowItem={item} />
          } else {
            obj.render = obj.render || defaultRender
            td = obj.render(item[obj.dataIndex], item, i)

            // 做判断的原因是？
            if (td && td.props && td.props.colSpan) {
              colSpan = td.props.colSpan
            }
            if (td && td.props && td.props.hasOwnProperty('rowSpan')) {
              rowSpan = td.props.rowSpan
            }
            if (td && td.children) {
              td = td.children
            }
            // j=j+colSpan
            // 表格溢出开关
            // if(colSpan>0){
            //   j=j+colSpan-1
            // }
          }
          if (parseInt(rowSpan) !== 0) {
            tr.push(<td className={prifix('table-col', highlightCols.includes(obj.key) ? 'picked' : null)} rowSpan={rowSpan} colSpan={colSpan} data-span={colSpan} key={'td-' + k + '-' + j} >{td}</td>)
          } else {
            tr.push(null)
          }
          j = j + colSpan
        }
        // 这个i 是在动态插入行的时候，给render的回掉函数的 索引
        i++
        // 动态插入的组件不累加
      }
      return <Row selectedRowKeys={selectedRowKeys} k={item.key || k} expand={item.expand} key={item.key || 'tr-' + k} {...rest}>{tr}</Row>
    })

    return (
      <tbody className={prifix('table-tbody')}>
        {advance && advance.prefix && this.getPrefixNodes()}
        {nodes}
        <Footer className={'table-footer'} {...this.props} />
      </tbody>
    )
  }

  getPrefixNodes () {
    const {
      columns,
      advance
    } = this.props
    return advance.prefix.map((suf, index) => {
      return (
        <tr className={prifix('table-row')} key={`suf-${index}`}>{
          columns.map((item, j) => {
            return <td className={prifix('table-col')} key={`suf-${item.dataIndex}-${index}-${j}`}>{suf[item.dataIndex]}</td>
          })
        }</tr>
      )
    })
  }
}
