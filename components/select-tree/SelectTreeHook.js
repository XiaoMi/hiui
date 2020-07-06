import React, { useState, useRef, useCallback, useEffect } from 'react'
import Tree from './tree'
import qs from 'qs'
import _ from 'lodash'
import Popper from '../popper'
import Icon from '../icon'
import classNames from 'classnames'
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
} from './tree/util'
import NavTree from './tree/NavTree'

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
  const [showCount, setShowCount] = useState(1)
  const [show, setShow] = useState(false)
  const [nodeDataState, setNodeDataState] = useState('normal')
  const [selectedItems, setSelectedItems] = useState([])
  // const [selectedIds, setSelectedIds] = useState([])
  const [expandIds, setExpandIds] = useState([])
  const [nodeEntries, setNodeEntries] = useState({})
  const [checkedNodes, setCheckedNodes] = useState({
    checked: [],
    semiChecked: []
  })
  const [flattenData, setFlattenData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const clearSearchEvent = useCallback(() => {
    setSearchValue('')
    searchTreeNode('')
  }, [])

  const changeEvents = useCallback((e) => {
    const val = e.target.value
    setSearchValue(val)
    searchTreeNode(val)
  }, [])
  useEffect(() => {
    setStatus()
    if (data) {
      const result = flattenNodesData(data, defaultExpandIds, defaultExpandAll, (type === 'multiple' && showCheckedMode !== 'ALL'))
      setFlattenData(result.flattenData)
      setNodeEntries(result.nodeEntries)
    }
  }, [data])
  useEffect(() => {
    if (flattenData.length > 0) {
      if (type === 'multiple') {
        console.log('check', checkedNodes, flattenData)
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
  useEffect(() => {
    const _selectedItems = parseSelectedItems(checkedNodes, nodeEntries, showCheckedMode, flattenData)
    setSelectedItems(_selectedItems)
  }, [checkedNodes])
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
  })
  const loadNodes = (id) => {
    return new Promise((resolve, reject) => {
      const _dataSource = typeof dataSource === 'function' ? dataSource(id || '') : dataSource
      let {
        url,
        transformResponse,
        params,
        type = 'GET'
      } = _dataSource
      url = url.includes('?') ? `${url}&${qs.stringify(params)}` : `${url}?${qs.stringify(params)}`
      window.fetch(url, {
        method: type
      })
        .then(response => response.json())
        .then(res => {
          const _res = transformResponse(res)
          const nArr = _res.map(n => {
            return {
              ...n,
              pId: id
            }
          })
          resolve(nArr)
        })
        .catch(err => reject(err))
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
    setSelectedItems([node])
    onChange(clearReturnData(node))
    setShow(false)
  }, [])

  const searchable = searchMode === 'filter' || searchMode === 'highlight'
  return (
    <div className='hi-select-tree'>
      <div
        ref={inputRef}
        className={classNames(
          'hi-select-tree__input',
          type === 'multiple' ? 'multiple-values' : 'single-values',
          selectedItems.length === 0 && 'hi-select-tree__input--placeholder'
        )}
        onClick={() => {
          if (flattenData.length === 0 && defaultLoadData && (!data || data.length === 0 || dataSource) && !show) {
            // data 为空 且 存在 dataSource 时，默认进行首次数据加载.defaultLoadData不暴露
            setNodeDataState('loading')
            loadNodes().then((res) => {
              if (res.length === 0) {
                setNodeDataState('empty')
                return
              }
              setNodeDataState('normal')
              setFlattenData(res)
              fillNodeEntries(null, nodeEntries, res)
            }).catch(() => {
              setNodeDataState('empty')
            })
          }
          setShow(!show)
        }}
      >
        <div className='hi-select-tree__selected' ref={selectedItemsRef}>
          {selectedItems.length > 0 &&
            selectedItems.slice(0, showCount).map((node, index) => {
              return (
                <div key={index} className='hi-select__input--item'>
                  <div className='hi-select__input--item__name'>
                    {node ? node.title : ''}
                  </div>
                  {
                    type === 'multiple' && <span
                      className='hi-select__input--item__remove'
                      onClick={e => {
                        e.stopPropagation()
                        checkedEvents(false, node)
                      }}
                    >
                      <i className='hi-icon icon-close' />
                    </span>
                  }
                </div>
              )
            })}
          {
            showCount < selectedItems.length && (
              <div className='hi-select__input-items--left'>
                +
                <span className='hi-select__input-items--left-count'>
                  {selectedItems.length - showCount}
                </span>
              </div>
            )
          }
        </div>

        <span className='hi-select__input--icon'>
          <i
            className={classNames(
              `hi-icon icon-${show
                ? 'up'
                : 'down'} hi-select-tree__input--expand`,
              { clearable: clearable && selectedItems.length > 0 }
            )}
          />
          {clearable &&
            selectedItems.length > 0 &&
            <i
              className={`hi-icon icon-close-circle hi-select-tree__icon-close`}
              onClick={handleClear}
            />}
        </span>
      </div>
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
