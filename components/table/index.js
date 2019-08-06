import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ClickOutside from './ClickOuterside'
import TableContent from './TableContent'
import prifix from './prefix'
import Checkbox from './checkbox'
import Pagination from '../pagination'
import Icon from '../icon'
import './style'
import loading from '../loading'
import '../pagination/style'
import '../icon/style'
import {setKey, scrollTop, getStyle, getPosition, offset} from './tool'
import request from 'axios'
import qs from 'qs'

class Table extends Component {
  static propTypes = {
    data: PropTypes.array,
    useFixedHeader: PropTypes.bool,
    columns: PropTypes.array,

    bodyStyle: PropTypes.object,
    style: PropTypes.object,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onRow: PropTypes.func,
    onHeaderRow: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    showHeader: PropTypes.bool,
    title: PropTypes.func,
    id: PropTypes.string,
    footer: PropTypes.func,
    emptyText: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    scroll: PropTypes.object
  }

  static defaultProps = {
    data: [],
    columns: [],
    useFixedHeader: false,
    rowKey: 'key',
    rowClassName: () => '',
    onRow () {},
    onHeaderRow () {},
    bodyStyle: {},
    style: {},
    showHeader: true,
    scroll: {x: undefined, y: undefined},
    rowRef: () => null,
    emptyText: () => 'No Data'
  }
  constructor (props) {
    super(props)
    // 只有dataSource,columns重造
    let {data = [], scroll} = props
    data = setKey(data, 'id')
    this.dom = React.createRef()
    this.fixLeft = React.createRef()
    this.fixRight = React.createRef()
    this.fixRight = React.createRef()
    this.setting = React.createRef()
    this.state = {
      dataSource: data,
      highlightCols: [],
      highlightRows: [],
      scroll,
      columnMenu: false,
      // 由外部属性重构为内部状态
      leftFiexColumns: [],
      rightFixColumns: [],
      columns: [],
      headerColumns: [],
      serverPagination: null
    }
  }

  runMemory () {
    let {name} = this.props
    if (!name) {
      return
    }
    let {dataSource} = this.state
    let {columns, headerColumns, highlightCols} = this.state
    let col = window.localStorage.getItem(name + '-col')
    if (col) {
      col = col.split(',').filter(item => item)
      // 列隐藏记忆
      columns.map(item => {
        if (col.includes(item.key.toString())) {
          item.hide = false
        } else {
          item.hide = true
        }
        return item
      })

      headerColumns.map(item => {
        if (col.includes(item.key)) {
          item.hide = false
        } else {
          item.hide = true
        }
        return item
      })
    }
    // 排序记忆
    let sorter = window.localStorage.getItem(name + '-sorter')
    if (sorter) {
      sorter = sorter.split(',').filter(item => !!item)
      let cb = columns.find(item => item.key === sorter[0])
      if (cb) {
        cb = cb.sorter
        dataSource.sort(cb)
        if (sorter[1] === '1') {
          dataSource.reverse()
        }
      }
    }
    // 高亮记忆
    let highlight = window.localStorage.getItem(name + '-highlight')
    if (highlight) {
      highlightCols = highlight.split(',').filter(item => !!item)
    }
    // 冻结记忆
    let freezeCol = window.localStorage.getItem(name + '-freeze')
    if (freezeCol) {
      this.cbs.freezeCol(freezeCol)
    }

    this.setState({columns, headerColumns, dataSource, highlightCols})
  }

  // noinspection JSAnnotator
  cbs = {
    highlighCol: (key) => {
      let {highlightCols} = this.state
      let col = highlightCols.indexOf(key)
      if (col > -1) {
        highlightCols.splice(col, 1)
      } else {
        highlightCols.push(key)
      }
      // 设置操作记忆
      let {name} = this.props
      window.localStorage.setItem(name + '-highlight', highlightCols)
      this.setState({highlightCols})
    },

    freezeCol: (key) => {
      // let col =
      let {scrollWidth, scroll, scrollX, name} = this.props
      let {columns} = this.state
      let pin = false
      columns = columns.map(item => {
        delete item.fixed
        return item
      })

      columns = columns.map(item => {
        if (item.key !== key && !pin) {
          item.fixed = 'left'
        }
        if (item.key === key) {
          item.fixed = 'left'
          pin = true
        }
        return item
      })

      let columnsDetail = this.setColumnsDetail(columns)

      if (scrollWidth || scrollX || (scroll && scroll.x)) {
        columnsDetail.scrollX = true
      }
      this.setState({...columnsDetail}, () => {
        this.xscroll()
      })
      window.localStorage.setItem(name + '-freeze', key)
    },
    hideCol: (key) => {
      let {columns, headerColumns} = this.state
      columns.map(item => {
        if (item.key === key) {
          item.hide = !item.hide
        }
        return item
      })
      headerColumns.map(item => {
        if (item.key === key) {
          item.hide = !item.hide
        }
        return item
      })

      let colMemory = columns.filter(item => !item.hide).map(item => item.key)

      // 设置操作记忆
      let {name} = this.props
      window.localStorage.setItem(name + '-col', colMemory)
      this.setState({columns, headerColumns})
    },

    resetData: (dataSource) => {
      this.setState({dataSource})
    },

    resetColumns: (columns) => {
      this.setState({columns})
    },

    addExpand: (e, item, index, col) => {
      let {dataSource, columns} = this.state
      let columnsDetail = this.setColumnsDetail(columns)

      if (!item.ishiuitableopen) {
        dataSource.splice(index + 1, 0, {expand: true, dataIndex: col.dataIndex, parent: item.key, width: col.width || '50px', render: col.render})
      } else {
        dataSource.splice(index + 1, 1)
      }
      let obj = dataSource.find(o => o.key === item.key)
      obj.ishiuitableopen = !obj.ishiuitableopen
      this.setState({dataSource: dataSource, ...columnsDetail})
      // let {index, open} = e.target.dataset
      // index = parseInt(index)
      // open = open === 'true'
      //
      // let {data} = this.props
      // if (!open) {
      //   data.splice(index + 1, 0, {expand: true, parent: index, ...{width: '50px'}, ...item})
      // } else {
      //   data.splice(index + 1, 1)
      // }
      // e.target.dataset.open = !open
      // this.setState({dataSource: data})
    }
  }

  getScrollXContent () {
    let scrollTable
    let {dataSource, highlightCols, columns, headerColumns, leftFiexColumns, rightFixColumns, highlightRows} = this.state
    // let {scroll} = this.state
    let {style = {}, ...props} = this.props
    let handleScroll = (e) => {
      let onLeft = e.target.scrollLeft === 0
      let onRight = Math.abs(e.target.scrollWidth - e.target.scrollLeft - parseInt(getStyle(e.target, 'width'))) < 2
      let left = this.fixLeft.current
      let right = this.fixRight.current
      if (left) {
        if (onLeft) {
          left.style.display = 'none'
        } else {
          left.style.display = 'table'
        }
      }

      if (right) {
        if (onRight) {
          right.style.display = 'none'
        } else {
          right.style.display = 'table'
        }
      }
    }
    if (leftFiexColumns.length === 0 && rightFixColumns.length === 0) {
      scrollTable = this.getBaseContent()
    } else {
      scrollTable = [
        <div className={prifix('table-scroll')} onScroll={handleScroll} key='content'>

          <div className={prifix('table-body')} style={{overflowX: 'auto'}}>
            <TableContent style={{...style}} {...Object.assign({}, {...props}, {columns}, {dataSource, highlightCols, highlightRows}, {parent: this, cbs: this.cbs, fetch: this.fetch, t: this}, {headerColumns, name: this.props.name})} />
          </div>
          {
            dataSource.length === 0 ? this.getEmptyContent() : null
          }
        </div>
      ]

      if (leftFiexColumns.length > 0) {
        scrollTable.push(
          <div className={prifix('table-fixed-left')} ref={this.fixLeft} style={{display: 'none'}} key='left'>
            <div className={prifix('table-outer')}>
              <div className={prifix('table-inner')}>
                <TableContent style={{width: 'auto', ...style}} className={prifix('table-fixed')} {...Object.assign({}, {...props}, {highlightRows, parent: this, columns: leftFiexColumns, headerColumns, name: this.props.name}, {dataSource, highlightCols}, {cbs: this.cbs, fetch: this.fetch, t: this})} />
              </div>
            </div>
          </div>
        )
      }

      if (rightFixColumns.length > 0) {
        scrollTable.push(
          <div className={prifix('table-fixed-right')} ref={this.fixRight} key='right'>
            <div className={prifix('table-outer')}>
              <div className={prifix('table-inner')}>
                <TableContent style={{width: 'auto', ...style}} className={prifix('table-fixed')} {...Object.assign({}, {...props}, {highlightRows, parent: this, columns: rightFixColumns, headerColumns, name: this.props.name}, {dataSource, highlightCols}, {cbs: this.cbs, fetch: this.fetch, t: this})} />
              </div>
            </div>
          </div>
        )
      }
    }

    return (
      <div className={prifix('table-content')}>
        {scrollTable}
      </div>
    )
  }

  showColumsPanel= (e) => {

  }

  getScrollYContent () {
    let {dataSource, highlightCols, columns, headerColumns, highlightRows} = this.state
    let {scroll} = this.state
    let {style = {}, ...props} = this.props
    return (
      <div className={prifix('table-content')}>
        <div className={prifix('table-scroll')}>
          <div className={prifix('table-head')}>
            <TableContent {...Object.assign({}, {...props}, {style: {...style}}, {columns}, {dataSource, highlightCols, highlightRows}, {parent: this, body: false, cbs: this.cbs, fetch: this.fetch, t: this})} />
          </div>
          <div className={prifix('table-body')} style={{maxHeight: scroll.y + 'px', overflow: 'auto'}} >
            <TableContent {...Object.assign({}, {...props}, {style: {...style}}, {columns}, {dataSource, highlightCols, highlightRows}, {parent: this, head: false, cbs: this.cbs, fetch: this.fetch, t: this}, {headerColumns})} />
          </div>
        </div>
        {
          dataSource.length === 0 ? this.getEmptyContent() : null
        }
      </div>
    )
  }

  getBaseContent () {
    let {dataSource, highlightCols, columns, headerColumns, highlightRows} = this.state

    let {style = {}, ...props} = this.props
    return (
      <div className={prifix('table-content')}>

        <div className={prifix('table-body')} style={{overflowX: 'auto'}}>
          <TableContent {...Object.assign({}, {style: {...style}}, {...props}, {columns}, {dataSource, highlightCols, highlightRows}, {parent: this, cbs: this.cbs, fetch: this.fetch, t: this}, {headerColumns})} />
        </div>
        {
          this.isEmpty ? this.getEmptyContent() : null
        }
      </div>
    )
  }
  get isEmpty () {
    let dataLen = this.state.dataSource.length
    if (dataLen > 0) {
      return false
    }

    if (!this.props.advance) {
      return true
    }
    let {
      advance
    } = this.props
    let prefixLen = 0
    let suffixLen = 0
    if (advance.prefix) {
      prefixLen = advance.prefix.length
    }
    if (advance.suffix) {
      suffixLen = advance.suffix.length
    }
    if (prefixLen + suffixLen > 0) {
      return false
    }

    return true
  }

  getEmptyContent () {
    let {emptyText} = this.props
    let text = typeof emptyText === 'string' ? emptyText : emptyText()
    return <div className='hi-table-placeholder'>{text}</div>
  }

  componentDidUpdate () {
    const {
      fixTop,
      height
    } = this.props
    let leftFixTable = this.dom.current.querySelectorAll('.hi-table-fixed-left table tr')
    let rightFixTable = this.dom.current.querySelectorAll('.hi-table-fixed-right table tr')
    let scrollTable = this.dom.current.querySelectorAll('.hi-table-scroll table tr')

    // if(fixTable && scrollTable){
    //

    // }
    if (scrollTable) {
      scrollTable.forEach((tr, index) => {
        if (leftFixTable.length > index) {
          leftFixTable[index].style.height = getStyle(tr, 'height')
        }
        if (rightFixTable.length > index) {
          rightFixTable[index].style.height = getStyle(tr, 'height')
        }
      })
    }

    if (!fixTop && height) {
      let hiTableBody = this.dom.current.querySelectorAll('.hi-table-body')
      hiTableBody && hiTableBody.length > 0 && hiTableBody.forEach(item => {
        item.style.maxHeight = height
        item.style.overflowY = 'auto'
        item.onscroll = (e) => {
          let thead = item.querySelectorAll('thead')
          thead.forEach(h => {
            h.style.transform = `translate(0,${item.scrollTop}px)`
          })

          let fixTableBodyArr = this.dom.current.querySelectorAll('.hi-table-inner')
          fixTableBodyArr && fixTableBodyArr.length > 0 && fixTableBodyArr.forEach(fixTableBody => {
            fixTableBody.style.maxHeight = (parseInt(height) - '18') + 'px'
            fixTableBody.style.overflowY = 'hidden'
            fixTableBody.scrollTop = item.scrollTop
            fixTableBody.querySelector('thead').style.transform = `translate(0,${item.scrollTop}px)`
          })
        }
      })
    }
  }

  render () {
    // 多选配置
    // noinspection JSAnnotator

    let {pagination, name, size = 'normal', bordered = false, striped = false, scrollX, header = null, footer = null} = this.props
    // noinspection JSAnnotator
    let {scroll, columnMenu, serverPagination} = this.state
    let content
    // 不滚动
    if (!scroll.x && !scroll.y) {
      content = this.getBaseContent()
    }

    // 列滚动
    if (scroll.x && !scroll.y) {
      // 将多选框放到最左边
      content = this.getScrollXContent()
    }

    if (scroll.y && !scroll.x) {
      content = this.getScrollYContent()
    }

    if (scroll.x && scroll.y) {
      // todo x和y同时滚动有bug
      content = this.getBaseContent()
      // content = this.getScrollXYContent()
    }

    if (scrollX) {
      content = this.getScrollXContent()
    }

    let {columns} = this.state

    let pagePosition = 'flex-end'
    let serverPagePosition = 'flex-end'
    if (pagination) {
      if (pagination.position === 'left') {
        pagePosition = 'start'
      }
      if (pagination.position === 'middle') {
        pagePosition = 'center'
      }
      if (pagination.position === 'right') {
        pagePosition = 'flex-end'
      }
    }
    if (serverPagination) {
      if (serverPagination.position === 'left') {
        serverPagePosition = 'start'
      }
      if (serverPagination.position === 'middle') {
        serverPagePosition = 'center'
      }
      if (serverPagination.position === 'right') {
        serverPagePosition = 'flex-end'
      }
    }
    let serverPaginationConfig = serverPagination
    return (
      <div className={prifix({table: true, [size]: size, bordered, striped})} ref={this.dom}>
        {header && <div className={prifix({'table-pre-header': true})}>{header()}</div>}
        <div className={prifix({'table-container': true})}>
          <div >{content}</div>
          { name &&
          <div className={prifix('table-setting')} ref={this.setting}>
            <div onClick={(e) => {
              let {columnMenu} = this.state
              this.setState({columnMenu: !columnMenu})
            }}>
              <Icon name='menu' style={{color: '#4284F5', fontSize: '24px'}}
              />
            </div>
            {
              columnMenu && <ClickOutside onClickOutside={(e) => this.setState({columnMenu: false})} >
                <div className={prifix('table-setting-menu column-menu')} >
                  {
                    columns.map(item => (
                      <div key={item.key}>
                        <div>
                          {
                            (function () {
                              if (item.type === 'select') {
                                return '多选'
                              }
                              if (item.type === 'expand') {
                                return '展开'
                              }
                              if (typeof item.title === 'function') {
                                return item.title()
                              }
                              return item.title
                            }())
                          }
                        </div>
                        <div>
                          <Checkbox checked={!item.hide} onChange={(e) => {
                            this.cbs.hideCol(item.key)
                          }} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </ClickOutside>
            }
          </div>
          }
        </div>
        {footer && <div className={prifix({'table-pre-footer': true})}>{footer()}</div>}
        {(pagination || columns) && <br /> }
        {
          pagination && <div style={{display: 'flex', justifyContent: pagePosition}}>
            {
              <div className={prifix('table-page')} >
                <Pagination
                  {...pagination}
                />
              </div>
            }
          </div>
        }
        {serverPaginationConfig && <div style={{display: 'flex', justifyContent: serverPagePosition}} a='1'>
          {
            <div className={prifix('table-page')} >
              <Pagination
                {...serverPaginationConfig}
                onChange={(current) => {
                  serverPaginationConfig.onChange && serverPaginationConfig.onChange(current)
                  this.setState({
                    serverPagination: {
                      ...serverPagination,
                      current
                    }
                  }, this.fetch)
                }}
              />
            </div>
          }
        </div>
        }
      </div>
    )
  }

  xscroll () {
    let {fixTop = false, name} = this.props
    if (typeof fixTop === 'boolean') {
      fixTop = 0
    } else {
      fixTop = parseFloat(fixTop)
    }
    let dom = this.dom.current
    let thead = dom ? dom.querySelectorAll('thead') : null

    let offsetTop = offset(dom).top

    //     表格距离顶部的位置 < 表格+ 自己的高度
    if (thead) {
      if (scrollTop() + fixTop > offsetTop && offsetTop + fixTop < offsetTop + parseInt(getStyle(dom, 'height')) - parseInt(thead ? getStyle(thead[0], 'height') : 0)) {
        thead.forEach(th => {
          th.style.display = 'table-header-group'
          // let h = (dom.offsetTop - scrollTop() - fixTop) * -1
          let h = getPosition(dom).y * -1 + fixTop
          th.style.transform = `translate(0,${h}px)`
          if (name) {
            this.setting.current.style.display = `none`
          }
        })
      } else {
        thead.forEach(th => {
          th.style.transform = `translate(0,0)`
          if (name) {
            this.setting.current.style.display = `block`
            let h = parseInt(getStyle(dom.querySelector('thead'), 'height')) + 'px'
            this.setting.current.style.height = h
            this.setting.current.style.lineHeight = h
          }
        })
      }
    }
  }
  getColumns (columns) {
    let select = columns.find(({type}) => type === 'select')
    let leftFiexColumns = columns.filter(({fixed}) => !!fixed && fixed === 'left')
    // 将多选框放到左边，如果没有就放个null

    // 去掉null,否则遍历会报错
    leftFiexColumns = leftFiexColumns.filter(col => !!col)
    const rightFixColumns = columns.filter(({fixed}) => !!fixed && fixed === 'right')
    const commanColumns = columns.filter(({fixed}) => !fixed || (fixed !== 'left' && fixed !== 'right'))

    // 讲表格重新排序，并且去掉slelect ，因为是null
    columns = [...leftFiexColumns, ...commanColumns, ...rightFixColumns]
      .filter(item => item !== select)
      .filter(col => !!col)

    // leftFiexColumns.unshift(select)
    select && columns.unshift(select) && leftFiexColumns.unshift(select)
    return {
      leftFiexColumns,
      rightFixColumns,
      columns
    }
  }

  getHeaderGroup (columns) {
    columns = columns.map((item) => {
      item.title = item.title || item.dataIndex
      item.key = item.key || item.dataIndex || item.title || item.id
      if (item.type === 'expand') {
        item.open = !!item.open
      }
      return item
    })
    let bodyColumns = []
    let headerColumns = []
    let deepMap = (columns, parent) => {
      for (let key in columns) {
        columns[key].key = columns[key].key || columns[key].title
        columns[key].depth = parent.depth + 1
        let children = columns[key].children
        if (children && children.length > 0) {
          columns[key].isLast = false
          deepMap(children, columns[key])
          // delete columns[key].children
        } else {
          columns[key].isLast = true
        }
        bodyColumns.push(columns[key])
      }
    }

    deepMap(columns, {depth: 0, children: []})
    let getNum = (obj) => {
      let num = 0
      let getn = (list) => {
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (item.isLast) {
            num++
          }
          if (item.children) {
            getn(item.children)
          }
        }
      }
      getn([obj])
      return num
    }

    for (let key in bodyColumns) {
      bodyColumns[key].headColSpan = getNum(bodyColumns[key])
    }

    let maxArray = [...bodyColumns].sort((pre, next) => (next.depth - pre.depth))
    let max = maxArray.length > 0 ? maxArray[0].depth : 0
    // 设置header-rowSpan
    let bd = bodyColumns.map(item => {
      if (item.isLast) {
        item.headRowSpan = max + 1 - item.depth
      }
      return item
    })

    for (let i = 1; i < max + 1; i++) {
      let arr = bd.filter(({depth}) => depth === i)
      headerColumns.push(arr)
    }

    bodyColumns = bodyColumns.filter(({isLast}) => isLast)
    return [headerColumns, bodyColumns]
  }

  setColumnsDetail (bool, prop, c) {
    let props = prop || this.props
    let leftFiexColumns = []
    let rightFixColumns = []
    let [headerColumns, columns] = this.getHeaderGroup(c || props.columns)

    let {rowSelection, scroll, name, scrollX} = props

    if (rowSelection) {
      let {selectedRowKeys = [], dataName = 'key'} = rowSelection
      columns.unshift({
        width: '50px',
        type: 'select',
        key: 'hi-table-select-' + name,
        title: () => {
          let {getCheckboxProps = (record) => ({ disabled: false }), onChange} = rowSelection
          return (
            <Checkbox type='checkbox'
              checked={selectedRowKeys.length === this.state.dataSource.filter(record => !getCheckboxProps(record).disabled).length && this.state.dataSource.filter(record => !getCheckboxProps(record).disabled).length > 0}
              onChange={(e, checked) => {
                let data = this.state.dataSource.filter(record => !getCheckboxProps(record).disabled)
                if (checked) {
                  selectedRowKeys.splice(0, selectedRowKeys.length)
                  for (let i = 0; i < data.length; i++) {
                    selectedRowKeys.push(data[i][dataName])
                  }
                } else {
                  selectedRowKeys.splice(0, selectedRowKeys.length)
                }
                onChange(selectedRowKeys, data.filter(record => selectedRowKeys.includes(record[dataName])))
              }}
            />
          )
        },
        render: (text, record, index) => {
          let {getCheckboxProps = (record) => ({ disabled: false }), onChange} = rowSelection
          // todo dataName 是干嘛的不明白

          return (
            <Checkbox type='checkbox'
              che={selectedRowKeys.includes(record[dataName])}
              checked={selectedRowKeys.includes(record[dataName])}
              disabled={getCheckboxProps(record).disabled}
              onChange={(e, checked) => {
                let data = this.state.dataSource.filter(record => !getCheckboxProps(record).disabled)
                if (checked) {
                  selectedRowKeys.push(record[dataName])
                } else {
                  selectedRowKeys = selectedRowKeys.filter(key => record[dataName] !== key)
                }
                onChange(selectedRowKeys, data.filter(record => selectedRowKeys.includes(record[dataName])))
              }}
              key={record[dataName]}
            />
          )
        }
      })
    }

    // TODO 这里的逻辑要优化
    if (scroll.x || scrollX || bool) {
      let obj = this.getColumns(columns)
      leftFiexColumns = obj.leftFiexColumns
      rightFixColumns = obj.rightFixColumns
      columns = obj.columns
    }

    return {
      leftFiexColumns,
      rightFixColumns,
      columns,
      headerColumns
    }
  }

  fetch = (extra) => {
    extra = extra || {}
    const {origin} = this.props
    const {
      data,
      url,
      headers,
      type = 'GET',
      success = (res) => {},
      error = () => {},
      mode = 'json',
      currentPageName = Table.config.currentPageName
    } = origin

    loading.open(this.dom.current, {key: 'loading'})
    const {
      serverPagination: {current}
    } = this.state
    let requestParams = {
      [currentPageName]: current,
      ...data,
      ...extra
    }

    let options = {
      url,
      method: ['GET', 'get'].includes(type) ? 'GET' : 'POST'
    }
    if (options.method === 'GET') {
      options.params = requestParams
    } else {
      if (mode !== 'json') {
        options.data = qs.stringify(requestParams)
      } else {
        options.data = requestParams
      }
    }
    if (headers) {
      options.headers = headers
    }
    request.create().request(options).then(res => {
      let {data, columns, page} = success(res)
      let columnsDetail = this.setColumnsDetail(null, null, columns)
      this.setState({
        dataSource: data,
        ...columnsDetail,
        serverPagination: page
      })
      this.runMemory()
      loading.close('loading')
    }).catch((e) => {
      loading.close('loading')
      error(e)
    })
  }

  reset (props) {
    // noinspection JSAnnotator
    const {
      origin: {
        data,
        url,
        headers,
        type = 'GET',
        mode = 'json',
        success = (res) => {},
        error = () => {},
        // pageSize = Table.config.pageSize,
        // pageSizeName = Table.config.pageSizeName,
        currentPageName = Table.config.currentPageName
      }
    } = props || this.props

    loading.open(this.dom.current, {key: 'loading'})
    this.setState({
      loading: true
    })
    let requestParams = {
      ...data
    }
    if (!requestParams[currentPageName]) {
      requestParams[currentPageName] = 1
    }
    let options = {
      method: ['GET', 'get'].includes(type) ? 'GET' : 'POST',
      url
    }
    if (options.method === 'GET') {
      options.params = requestParams
    } else {
      if (mode !== 'json') {
        options.data = qs.stringify(requestParams)
      } else {
        options.data = requestParams
      }
    }
    if (headers) {
      options.headers = headers
    }

    request.create().request(options).then(res => {
      let {data, columns, page} = success(res)
      this.setState({
        dataSource: data,
        serverPagination: page
      })
      setTimeout((e) => {
        let columnsDetail = this.setColumnsDetail(null, null, columns)
        this.setState({
          ...columnsDetail
        })
        this.runMemory()
        loading.close('loading')
      })
    }).catch((e) => {
      loading.close('loading')
      error(e)
    })
  }

  componentDidMount () {
    let {fixTop, scroll, name, origin} = this.props
    let dom = this.dom.current
    if (fixTop) {
      // 吸顶逻辑
      document.addEventListener('scroll', () => {
        this.xscroll()
      })
    } else {

    }

    // 如果有列冻结的配置
    if (scroll.x) {
      let dom = this.dom.current
      // 如果表格本身太宽超过列冻结配置的话，右边的列冻结就取消
      if (parseInt(getStyle(dom, 'width')) > scroll.x) {
        if (this.fixRight.current) {
          this.fixRight.current.style.display = 'none'
        }
      }
    }

    let columnsDetail = this.setColumnsDetail()
    this.setState({
      ...columnsDetail
    })

    // 操作记忆设置
    if (name) {
      let h = parseInt(getStyle(dom.querySelector('thead'), 'height')) + 'px'
      this.setting.current.style.height = h
      this.setting.current.style.lineHeight = h
    }
    setTimeout(() => {
      this.runMemory()

      if (origin) {
        this.setState({
          serverPagination: {
            current: 1,
            total: 1
          }
        }, this.fetch)
      }
    }, 0)
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return true
  }

  componentWillReceiveProps ({data, columns, width, scroll, ...props}) {
    // 服务端表格
    if (props.origin) {
      let oldOrigin = this.props.origin
      let newOrigin = props.origin

      let bool = oldOrigin.url !== newOrigin.url
      oldOrigin.data = oldOrigin.data || {}
      newOrigin.data = newOrigin.data || {}
      oldOrigin.headers = oldOrigin.headers || {}
      newOrigin.headers = oldOrigin.headers || {}
      for (let key in oldOrigin.data) {
        if (oldOrigin.data[key] !== newOrigin.data[key]) {
          bool = true
        }
      }
      for (let key in oldOrigin.headers) {
        if (oldOrigin.headers[key] !== newOrigin.headers[key]) {
          bool = true
        }
      }

      let pageSizeName = oldOrigin.pageSizeName || Table.config.pageSizeName
      if (this.state.serverPagination && this.state.serverPagination.current !== 1) {
        if (oldOrigin.data[pageSizeName] !== newOrigin.data[pageSizeName]) {
          bool = false
        }
      }

      let {
        auto = true,
        autoDelayTime = Table.config.autoDelayTime
      } = props.origin
      if (auto) {
        clearTimeout(this.autoTimer)
        this.autoTimer = setTimeout(() => {
          bool && this.reset(props)
        }, autoDelayTime)
      }
    } else {
      data = setKey(data, 'id')
      // 只有dataSource,columns重造
      let columnsDetail = this.setColumnsDetail(columns, {data, columns, width, scroll, ...props})
      this.setState({dataSource: data, scroll, ...columnsDetail, ...props})
      setTimeout(() => {
        this.runMemory()
      }, 0)
    }
  }
}

Table.config = {
  currentPageName: 'current',
  pageSizeName: 'pageSize',
  pageSize: 10,
  current: 1,
  total: 1,
  autoDelayTime: 300,
  host: ''
}

export default Table
