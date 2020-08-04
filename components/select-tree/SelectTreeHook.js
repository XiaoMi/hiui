import React, { useState, useRef, useCallback, useEffect } from 'react'
import Tree from './components/tree'
import _ from 'lodash'
import Popper from '../popper'
import HiRequest from '../_util/hi-request'
import Icon from '../icon'
import {
  flattenNodesData,
  getNode,
  updateCheckData,
  updateUnCheckData,
  hasChildren,
  parseDefaultSelectedItems,
  parseCheckStatusData,
  parseSelectedItems,
  treeFilterByOriginalData,
  parseExpandIds,
  fillNodeEntries,
  clearReturnData
} from './components/tree/util'
import NavTree from './components/tree/NavTree'
import Trigger from './components/Trigger'

const SelectTree = ({
  data,
  dataSource,
  type,
  defaultExpandIds,
  expandIds: expandIdsProps,
  defaultExpandAll,
  showCheckedMode,
  defaultValue,
  value,
  onChange,
  onExpand,
  defaultLoadData,
  clearable,
  searchMode,
  mode,
  autoExpand
}) => {
  const selectedItemsRef = useRef()
  const inputRef = useRef()
  // select 中显示的数量
  const [showCount, setShowCount] = useState(1)
  // panel show
  const [show, setShow] = useState(false)
  // panel status  :  empty normal loading
  const [nodeDataState, setNodeDataState] = useState('normal')
  // selected items
  const [selectedItems, setSelectedItems] = useState([])
  // expand ids
  const [expandIds, setExpandIds] = useState([])
  // 改造过后的数据
  const [nodeEntries, setNodeEntries] = useState({})
  // 选中的节点数据（checkable）
  const [checkedNodes, setCheckedNodes] = useState({
    checked: [],
    semiChecked: []
  })
  // 拉平的数据
  const [flattenData, setFlattenData] = useState([])
  // 关键字搜索值
  const [searchValue, setSearchValue] = useState('')
  // 清空搜索值事件
  const clearSearchEvent = useCallback(() => {
    setSearchValue('')
    searchTreeNode('')
  }, [])

  // 搜索框的值改变时的事件
  const changeEvents = useCallback((e) => {
    const val = e.target.value
    setSearchValue(val)
    searchTreeNode(val)
  }, [])
  // 根据传入的原始数据解析为拉平数据及改装数据
  useEffect(() => {
    setStatus()
    if (data) {
      const result = flattenNodesData(data, defaultExpandIds, defaultExpandAll, (type === 'multiple' && showCheckedMode !== 'ALL'))
      setFlattenData(result.flattenData)
      setNodeEntries(result.nodeEntries)
    }
  }, [data])
  // 依赖 flattenData & value  解析生成 checkedNodes 或 selectedItems
  useEffect(() => {
    if (flattenData.length > 0) {
      if (type === 'multiple') {
        const cstatus = parseCheckStatusData(defaultValue.length > 0 ? defaultValue : value, checkedNodes, flattenData)
        if (cstatus) {
          setCheckedNodes(cstatus)
        }
      } else {
        const _selectedItems = parseDefaultSelectedItems(defaultValue.length > 0 ? defaultValue : value, flattenData)
        setSelectedItems(_selectedItems)
      }
    }
  }, [value, flattenData])
  // 当选中项发生改变时，更改选中项
  useEffect(() => {
    const _selectedItems = parseSelectedItems(checkedNodes, nodeEntries, showCheckedMode, flattenData)
    setSelectedItems(_selectedItems)
  }, [checkedNodes])

  // 依赖展开项生成展开节点数据
  useEffect(() => {
    if (flattenData.length > 0) {
      const _expandIds = parseExpandIds(expandIdsProps, defaultExpandIds, flattenData)
      setExpandIds((preExpandIds) => {
        return (_expandIds || []).concat(preExpandIds || [])
      })
    }
  }, [expandIdsProps, flattenData])

  useEffect(() => {
    if (selectedItemsRef.current) {
      const sref = selectedItemsRef.current
      // 多选超过一行时以数字显示
      const itemsRect = sref.getBoundingClientRect()
      let width = 0
      let num = 0
      const items = sref.querySelectorAll('.hi-select__input--item')
      for (const item of items) {
        const itemRect = item.getBoundingClientRect()
        width += itemRect.width
        if (width + 16 > itemsRect.width) {
          break
        } else {
          num++
        }
      }
      setShowCount(num)
    }
  }, [showCount])

  useEffect(() => {
    setShowCount(selectedItems.length)
  }, [selectedItems])

  // 过滤方法
  const searchTreeNode = useCallback((val) => {
    let matchNodes = []
    if (searchMode === 'highlight') {
      const filterArr = flattenData.map(node => {
        const reg = new RegExp(val, 'gi')
        const str = `<span style="color: #428ef5">${val}</span>`
        if (reg.test(node.title)) {
          node._title = node.title.replace(reg, str)
          matchNodes.push(node)
        }
        return node
      })
      setFlattenData(filterArr)
      let matchNodesSet = []
      matchNodes.forEach(mn => {
        matchNodesSet.push(mn.id)
        matchNodesSet = matchNodesSet.concat(mn.ancestors || [])
      })
      matchNodesSet = _.uniq(matchNodesSet)
      setExpandIds(matchNodesSet)
    } else if (searchMode === 'filter') {
      const filterArr = treeFilterByOriginalData(data, val)
      const filterData = flattenNodesData(filterArr).flattenData
      let matchNodesSet = []
      filterData.forEach(mn => {
        matchNodesSet.push(mn.id)
        matchNodesSet = matchNodesSet.concat(mn.ancestors || [])
      })
      matchNodesSet = _.uniq(matchNodesSet)
      setExpandIds(matchNodesSet)
      setFlattenData(filterData)
    }
  })

  const handleClear = useCallback(() => {
    setSelectedItems([])
    setExpandIds([])
    setCheckedNodes({
      checked: [],
      semiChecked: []
    })
  }, [])

  const setStatus = useCallback(() => {
    if (data.length === 0) {
      setNodeDataState(dataSource ? 'loading' : 'empty')
    } else {
      setNodeDataState('normal')
    }
  }, [data])
  const loadNodes = (id) => {
    const _dataSource = typeof dataSource === 'function' ? dataSource(id || '') : dataSource
    return HiRequest({
      ..._dataSource
    }).then(res => {
      const nArr = res.data.map(n => {
        return {
          ...n,
          pId: id
        }
      })
      return nArr
    })
  }
  /**
  * 多选模式下复选框事件
  * @param {*} checked 是否被选中
  * @param {*} node 当前节点
  */
  const checkedEvents = useCallback((checked, node) => {
    let result = {}
    let semiCheckedIds = new Set(checkedNodes.semiChecked)
    let checkedIds = new Set(checkedNodes.checked)
    if (checked) {
      result = updateCheckData(node, flattenData, checkedIds, semiCheckedIds)
    } else {
      result = updateUnCheckData(node, flattenData, checkedIds, semiCheckedIds)
    }
    setCheckedNodes({
      checked: result.checked,
      semiChecked: result.semiChecked
    })
    console.log('flattenData', flattenData)
    // const _selectedItems = parseSelectedItems(result, nodeEntries, showCheckedMode, flattenData)
    // setSelectedItems(_selectedItems)
    let checkedArr = []
    if (result.checked.length > 0) {
      checkedArr = result.checked.map(id => {
        return getNode(id, flattenData)
      })
    }
    onChange(result, clearReturnData(checkedArr), node)
  })

  /**
  * 节点展开关闭事件
  * @param {*} bol 是否展开
  * @param {*} node 当前点击节点
  */
  const expandEvents = (node, state, callback = () => { }) => {
    const _expandIds = [...expandIds]
    const hasIndex = _expandIds.findIndex(id => id === node.id)
    if (hasIndex !== -1) {
      _expandIds.splice(hasIndex, 1)
    } else {
      _expandIds.push(node.id)
    }
    setExpandIds(_expandIds)
    if (hasChildren(node, flattenData)) {
      // 如果包含节点，则不再拉取数据
      callback()
      onExpand()
      return
    }
    if (state) {
      loadNodes(node.id).then((res) => {
        if (res.length > 0) {
          setFlattenData(flattenData.concat(res))
          fillNodeEntries(node, nodeEntries, res)
        }
        callback(res)
      })
      onExpand()
    }
  }

  const selectedEvents = useCallback((node) => {
    console.log('selectedEvents')
    setSelectedItems([node])
    onChange(clearReturnData(node))
    setShow(false)
  }, [])

  const onTrigger = () => {
    console.log(1, flattenData, defaultLoadData, data, dataSource, show)
    if (
      flattenData.length === 0 &&
      defaultLoadData &&
      (!data || data.length === 0 || dataSource) &&
      !show
    ) {
      // data 为空 且 存在 dataSource 时，默认进行首次数据加载.defaultLoadData不暴露
      setNodeDataState('loading')
      loadNodes()
        .then((res) => {
          console.log(3, res)
          if (res.length === 0) {
            setNodeDataState('empty')
            return
          }
          setNodeDataState('normal')
          setFlattenData(res)
          fillNodeEntries(null, nodeEntries, res)
        })
        .catch(() => {
          setNodeDataState('empty')
        })
    }
    setShow(!show)
  }
  const searchable = searchMode === 'filter' || searchMode === 'highlight'
  return (
    <div className='hi-select-tree'>
      <Trigger
        inputRef={inputRef}
        selectedItemsRef={selectedItemsRef}
        type={type}
        showCount={showCount}
        flattenData={flattenData}
        selectedItems={selectedItems}
        clearable={clearable}
        show={show}
        checkedEvents={checkedEvents}
        onTrigger={onTrigger}
        onClear={handleClear}
      />
      {
        <Popper
          show={show}
          attachEle={inputRef.current}
          className={`hi-select-tree__popper ${data.length === 0 && dataSource ? 'hi-select-tree__popper--loading' : ''}`}
          onClickOutside={() => setShow(false)}
        >
          <div className={`hi-select-tree ${searchable ? 'hi-select-tree--hassearch' : ''}`}>
            {
              searchable && (
                <div className='hi-select-tree__searchbar-wrapper'>
                  <div className='hi-select-tree__searchbar-inner'>
                    <Icon name='search' />
                    <input
                      className='hi-select-tree__searchinput'
                      placeholder={'搜索'}
                      clearable='true'
                      value={searchValue}
                      clearabletrigger='always'
                      onKeyDown={e => {
                        if (e.keyCode === '13') {
                          searchTreeNode(e.target.value)
                        }
                      }}
                      onChange={changeEvents}
                    />
                    {searchValue.length > 0 ? <Icon name='close-circle' style={{ cursor: 'pointer' }} onClick={clearSearchEvent} /> : null}
                  </div>
                </div>
              )}
            {
              mode === 'breadcrumb' ? <NavTree
                data={flattenData}
                originData={data}
                checkedNodes={checkedNodes}
                selectedItems={selectedItems}
                checkable={type === 'multiple'}
                onCheck={checkedEvents}
                autoExpand={autoExpand}
                nodeDataState={nodeDataState}
                onSelected={selectedEvents}
                isRemoteLoadData={!!dataSource}
                onExpand={expandEvents}
              /> : <Tree
                data={flattenData}
                originData={data}
                expandIds={expandIds}
                dataSource={dataSource}
                loadDataOnExpand={false}
                checkable={type === 'multiple'}
                checkedNodes={checkedNodes}
                selectedItems={selectedItems}
                nodeDataState={nodeDataState}
                onSearch={searchTreeNode}
                // searchMode='highlight'
                // defaultExpandIds={[]}
                // defaultExpandAll
                onExpand={expandEvents}
                onClick={selectedEvents}
                isRemoteLoadData={!!dataSource}
                onCheck={checkedEvents}
              />
            }
          </div>
        </Popper>
      }
      {/* <NavTree data={data} /> */}
    </div>
  )
}

SelectTree.defaultProps = {
  type: 'single',
  defaultCheckedIds: [],
  defaultValue: [],
  value: [],
  data: [],
  clearable: true,
  onChange: () => { },
  onExpand: () => { },
  checkable: false,
  defaultLoadData: true,
  showCheckedMode: 'PARENT',
  defaultExpandAll: false,
  defaultExpandIds: [],
  expandIds: [],
  mode: 'tree',
  searchMode: null
}
export default SelectTree
