import React, { Component } from 'react'
import prifix from './prefix'
import Icon from '../icon'
import Menu from './menu'

class Sorter extends Component {
  reversed = false
  sortAsec = () => {
    let {index, columns, kname, name} = this.props
    let sorter = columns[index].sorter
    let {cbs: {resetData}, dataSource} = this.props
    dataSource.sort(sorter)
    resetData(dataSource)
    this.reversed = false
    window.localStorage.setItem(name + '-sorter', [kname, 0])
  }

  sortDsec = () => {
    let {index, columns, name, kname} = this.props
    let sorter = columns[index].sorter
    let {cbs: {resetData}, dataSource} = this.props

    dataSource.sort(sorter)
    dataSource.reverse()
    resetData(dataSource)
    this.reversed = true
    window.localStorage.setItem(name + '-sorter', [kname, 1])
  }

  render () {
    return (
      <div>
        <span style={{display: 'block', height: '12px', lineHeight: '12px'}}><Icon name={'up'} onClick={this.sortAsec} style={{fontSize: '12px'}} /></span>
        <span style={{display: 'block', height: '12px', lineHeight: '12px'}}><Icon name={'down'} onClick={this.sortDsec} style={{fontSize: '12px'}} /></span>
      </div>
    )
  }
}

class ServerSorter extends Component {
  render () {
    return (
      <div>
        <span style={{display: 'block', height: '12px', lineHeight: '12px'}}>
          <Icon
            name={'up'}
            onClick={(e) => {
              let {item: {serverSort}, fetch} = this.props
              fetch(serverSort[0])
            }}
            style={{fontSize: '12px'}} /></span>
        <span style={{display: 'block', height: '12px', lineHeight: '12px'}}>
          <Icon
            name={'down'}
            onClick={(e) => {
              let {item: {serverSort}, fetch} = this.props
              fetch(serverSort[1])
            }}
            style={{fontSize: '12px'}}
          />
        </span>
      </div>
    )
  }
}

let HeaderCell = (props) => {
  let {item, index, contextMenu} = props
  return (
    <th colSpan={item.colSpan || 1} key={'head-' + item.key || item.dataIndex || item.title} onContextMenu={(e) => contextMenu(e, item.key)}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div>{typeof item.title === 'function' ? item.title() : item.title}</div>&nbsp;
        {item.sorter && <Sorter {...props} key={item.key} index={index} kname={item.key} />}
        {item.serverSort && <ServerSorter {...props} key={item.key} index={index} kname={item.key} />}
      </div>
    </th>
  )
}

let GroupCell = (props) => {
  let {item, index, contextMenu} = props
  return (
    <th colSpan={item.headColSpan} rowSpan={item.headRowSpan} key={'head-' + item.key || item.dataIndex || item.title} onContextMenu={(e) => contextMenu(e, item.key)}>
      <div style={{display: 'flex', alignItems: 'center'}}>&nbsp;
        <div>{typeof item.title === 'function' ? item.title() : item.title}</div>
        {item.sorter && <Sorter {...props} col={item} index={index} kname={item.key} />}
        {item.serverSort && 'sirt'}
      </div>
    </th>
  )
}

// 普通的表头
export default class Header extends Component {
  render () {
    let { columns, headerColumns } = this.props
    // 表头可以传组件，如果是文本就渲染文本
    let nodes = []
    // 固定表头分组，这里好难。。

    if (headerColumns && headerColumns.length > 1) {
      nodes = headerColumns.map((columns, k) => {
        let tr = []
        columns = columns.filter(item => !item.hide)
        for (let i = 0; i < columns.length; i++) {
          tr.push(<GroupCell {...this.props} item={columns[i]} index={i} contextMenu={this.contextMenu} key={columns[i].key} />)
        }
        return <tr key={k}>{tr}</tr>
      })
    } else {
      for (let i = 0; i < columns.length;) {
        let colSpan = columns[i].colSpan || 1
        nodes.push(<HeaderCell {...this.props} item={columns[i]} index={i} contextMenu={this.contextMenu} key={columns[i].key} />)
        i = i + colSpan
      }

      nodes = <tr>{nodes}</tr>
    }

    return (
      <thead className={prifix('table-thead')} ref={this.tableHeader}>
        {nodes}
      </thead>
    )
  }

  contextMenu = (e, key) => {
    e.preventDefault()
    let {cbs, scrollWidth, scrollX = false, scroll = false, size, origin} = this.props
    let sc = scrollWidth || scrollX || (scroll && scroll.x)
    if (origin && origin.url) {
      sc = false
    }
    Menu.show(e, cbs, key, !!sc, size, this.props.headerColumns.length === 1)
  }
}
