import React, { useState, useRef, useCallback, useEffect } from 'react'
import _ from 'lodash'

import Popper from '../popper'
import Loading from '../loading'
import Icon from '../icon'
import Tree from './components/tree'
import {
  getNodeByIdTitle,
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
  clearReturnData,
  processSelectedIds
} from './components/tree/util'
import HiRequest from '../_util/hi-request'
import { moveFocusedIndex, rightHandle, leftHandle } from './keyEvents'

import NavTree from './components/tree/NavTree'
import Trigger from './components/Trigger'
import Provider from '../context'

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
  autoExpand,
  overlayClassName,
  theme,
  localeDatas,
  placeholder: propsPlaceholder,
  style,
  valueRender,
  optionWidth,
  placement = 'top-bottom-start'
}) => {
  const [isFocus, setIsFocus] = useState(false)
  const placeholder = propsPlaceholder || localeDatas.selectTree.placeholder
  const selectedItemsRef = useRef()
  const inputRef = useRef()
  const selectTreeRoot = useRef()
  const selectTreeWrapper = useRef()
  // activeId 当前活动下标
  const [activeId, setActiveId] = useState('')
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
  }, [flattenData])

  // 搜索框的值改变时的事件
  const changeEvents = useCallback(
    (e) => {
      const val = e.target.value
      setSearchValue(val)
      searchTreeNode(val)
    },
    [flattenData]
  )
  // 根据传入的原始数据解析为拉平数据及改装数据
  useEffect(() => {
    setStatus()
    if (data) {
      const result = flattenNodesData(
        data,
        defaultExpandIds,
        defaultExpandAll,
        type === 'multiple' && showCheckedMode !== 'ALL'
      )
      setFlattenData(result.flattenData)
      setNodeEntries(result.nodeEntries)
    }
  }, [data])
  // 当选中项发生改变时(以及首次解析完成默认值后)，更改选中项
  useEffect(() => {
    const _selectedItems = parseSelectedItems(checkedNodes, nodeEntries, showCheckedMode, flattenData)
    setSelectedItems(_selectedItems)
  }, [checkedNodes])

  // 依赖 flattenData & value  解析生成 checkedNodes 或 selectedItems
  useEffect(() => {
    if (flattenData.length > 0) {
      if (type === 'multiple') {
        const cstatus = parseCheckStatusData(
          value,
          value === undefined ? checkedNodes : { checked: value },
          flattenData
        )
        setCheckedNodes(cstatus || { checked: [], semiChecked: [] })
      } else {
        const _selectedItems = parseDefaultSelectedItems(value, flattenData)
        setSelectedItems(_selectedItems)
        if (_selectedItems.length > 0) {
          setActiveId(_selectedItems[0].id)
        }
      }
    }
  }, [value])

  // 依赖展开项生成展开节点数据
  useEffect(() => {
    if (flattenData.length > 0) {
      const _expandIds = parseExpandIds(expandIdsProps, defaultExpandIds, flattenData)
      setExpandIds((preExpandIds) => {
        return (_expandIds || []).concat(preExpandIds || [])
      })
    }
    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
      setActiveId(selectedItems[0].id)
    } else if (Array.isArray(flattenData) && flattenData.length > 0) {
      setActiveId(flattenData[0].id)
    }
  }, [expandIdsProps, flattenData])

  useEffect(() => {
    if (selectedItemsRef.current) {
      const sref = selectedItemsRef.current
      // 多选超过一行时以数字显示
      const referenceEls = sref.querySelectorAll('.hi-selecttree__selected--hidden span')
      const wrapperWidth = sref.getBoundingClientRect()
      let _width = 0
      let num = 0
      // eslint-disable-next-line no-unused-vars
      for (const el of referenceEls) {
        const elRect = el.getBoundingClientRect()
        _width += elRect.width
        // 16 -- '+1' width
        if (_width + 16 > wrapperWidth.width) {
          break
        }
        num++
      }
      setShowCount(num)
    }
  }, [selectedItems])
  useEffect(() => {
    if (data) {
      const { flattenData = [], nodeEntries } = flattenNodesData(
        data,
        defaultExpandIds,
        defaultExpandAll,
        type === 'multiple' && showCheckedMode !== 'ALL'
      )
      setFlattenData(flattenData)
      setNodeEntries(nodeEntries)
      if (flattenData.length > 0) {
        if (type === 'multiple') {
          const cstatus = parseCheckStatusData(
            defaultValue.length > 0 ? defaultValue : value,
            checkedNodes,
            flattenData
          )
          setCheckedNodes(cstatus || { checked: [], semiChecked: [] })
        } else {
          const _selectedItems = parseDefaultSelectedItems(defaultValue.length > 0 ? defaultValue : value, flattenData)
          setSelectedItems(_selectedItems)
        }
      }
    }
    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
      setActiveId(selectedItems[0].id)
    } else if (Array.isArray(data) && data.length > 0) {
      setActiveId(data[0].id)
    }
  }, [])
  // 过滤方法
  const searchTreeNode = (val) => {
    const matchNodes = []
    const _data = _.cloneDeep(flattenData)
    if (searchMode === 'highlight') {
      const filterArr = _data.map((node) => {
        let _keyword = val
        _keyword = val.includes('[') ? _keyword.replace(/\[/gi, '\\[') : _keyword
        _keyword = val.includes('(') ? _keyword.replace(/\(/gi, '\\(') : _keyword
        _keyword = val.includes(')') ? _keyword.replace(/\)/gi, '\\)') : _keyword
        const reg = new RegExp(_keyword, 'gi')
        const str = `<span style="color: var(--color-primary)">${val}</span>`
        if (reg.test(node.title)) {
          node._title = node.title.replace(reg, str)
          matchNodes.push(node)
        }
        return node
      })
      setFlattenData(filterArr)
      let matchNodesSet = []
      matchNodes.forEach((mn) => {
        matchNodesSet.push(mn.id)
        matchNodesSet = matchNodesSet.concat(mn.ancestors || [])
      })
      matchNodesSet = _.uniq(matchNodesSet)
      setExpandIds(matchNodesSet)
    } else if (searchMode === 'filter') {
      const filterArr = treeFilterByOriginalData(data, val)
      const filterData = flattenNodesData(filterArr).flattenData
      let matchNodesSet = []
      filterData.forEach((mn) => {
        matchNodesSet.push(mn.id)
        matchNodesSet = matchNodesSet.concat(mn.ancestors || [])
      })
      matchNodesSet = _.uniq(matchNodesSet)
      setExpandIds(matchNodesSet)
      setFlattenData(filterData)
    }
  }

  /**
   * Clear button Event
   */
  const handleClear = useCallback(() => {
    setSelectedItems([])
    setExpandIds([])
    setCheckedNodes({
      checked: [],
      semiChecked: []
    })
    onChange && onChange()
  }, [onChange])

  /**
   * set Pull Data status
   */
  const setStatus = useCallback(() => {
    if (data.length === 0) {
      setNodeDataState(dataSource ? 'loading' : 'empty')
    } else {
      setNodeDataState('normal')
    }
  }, [data])
  /**
   * Remote load Data
   * @param {*} id click node's id
   */
  const loadNodes = useCallback((id) => {
    const _dataSource = typeof dataSource === 'function' ? dataSource(id || '') : dataSource
    return HiRequest({
      ..._dataSource
    }).then((res) => {
      const { data = [] } = res
      const nArr =
        data &&
        data.map((n) => {
          return {
            ...n,
            pId: id
          }
        })
      return nArr
    })
  }, [])
  /**
   * 多选模式下复选框事件
   * @param {*} checked 是否被选中
   * @param {*} node 当前节点
   */
  const checkedEvents = (checked, node) => {
    let result = {}

    const semiCheckedIds = new Set(checkedNodes.semiChecked)
    const checkedIds = new Set(checkedNodes.checked)
    if (checked) {
      result = updateCheckData(node, flattenData, checkedIds, semiCheckedIds)
    } else {
      result = updateUnCheckData(node, flattenData, checkedIds, semiCheckedIds)
    }

    let checkedArr = []
    if (result.checked.length > 0) {
      checkedArr = result.checked.map((id) => {
        return getNode(id, flattenData)
      })
    }
    setActiveId(node.id)
    onChange(
      processSelectedIds(result.checked, nodeEntries, showCheckedMode, flattenData),
      clearReturnData(checkedArr),
      clearReturnData(node)
    )
    !value &&
      setCheckedNodes({
        checked: result.checked,
        semiChecked: result.semiChecked
      })
  }

  /**
   * 节点展开关闭事件
   * @param {*} bol 是否展开
   * @param {*} node 当前点击节点
   */
  const expandEvents = (node, state, callback = () => {}) => {
    const _expandIds = [...expandIds]
    const hasIndex = _expandIds.findIndex((id) => id === node.id)
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
          setFlattenData(flattenData.concat(flattenNodesData(res).flattenData))
          fillNodeEntries(node, nodeEntries, res)
        }
        callback(res)
      })
      onExpand()
    }
  }

  /**
   * Node selected Event
   */
  const selectedEvents = useCallback(
    (node) => {
      setSelectedItems([node])
      const n = clearReturnData(node)
      onChange(node.id, n, n)
      setShow(false)
      setActiveId(node.id)
    },
    [onChange, show, selectedItems]
  )

  /**
   * Input 点击事件
   */
  const onTrigger = () => {
    if (flattenData.length === 0 && defaultLoadData && (!data || data.length === 0 || dataSource) && !show) {
      // data 为空 且 存在 dataSource 时，默认进行首次数据加载.defaultLoadData不暴露
      setNodeDataState('loading')
      loadNodes()
        .then((res) => {
          if (res.length === 0) {
            setNodeDataState('empty')
            return
          }
          setNodeDataState('normal')
          setFlattenData(flattenNodesData(res).flattenData)
          fillNodeEntries(null, nodeEntries, res)
        })
        .catch(() => {
          setNodeDataState('empty')
        })
    }
    setShow(!show)
  }
  const searchable = searchMode === 'filter' || searchMode === 'highlight'
  // 按键操作
  const handleKeyDown = (evt) => {
    evt.stopPropagation()
    // space
    if (evt.keyCode === 32 && !document.activeElement.classList.value.includes('hi-selecttree__searchinput')) {
      evt.preventDefault()
      setShow(!show)
    }
    // esc
    if (evt.keyCode === 27) {
      setShow(false)
    }
    if (show) {
      // down
      if (evt.keyCode === 40) {
        evt.preventDefault()
        setActiveId(moveFocusedIndex('down', activeId, selectTreeRoot))
      }
      // up
      if (evt.keyCode === 38) {
        evt.preventDefault()
        setActiveId(moveFocusedIndex('up', activeId, selectTreeRoot))
      }
      // right
      if (evt.keyCode === 39) {
        evt.preventDefault()
        rightHandle({ activeId, flattenData, expandIds, expandEvents, setActiveId, mode })
      }
      // left
      if (evt.keyCode === 37) {
        evt.preventDefault()
        leftHandle({ activeId, flattenData, expandIds, expandEvents, setActiveId, mode })
      }
      // enter
      if (evt.keyCode === 13) {
        type === 'multiple'
          ? checkedEvents(
              !selectedItems.some((item) => {
                return activeId === item.id
              }),
              getNodeByIdTitle(activeId, flattenData),
              checkedNodes
            )
          : selectedEvents(getNodeByIdTitle(activeId, flattenData))
      }
    }
  }
  return (
    <div
      className={`theme__${theme} hi-selecttree`}
      onClick={() => {
        setIsFocus(true)
      }}
      style={style}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      ref={selectTreeWrapper}
    >
      <Trigger
        inputRef={inputRef}
        selectedItemsRef={selectedItemsRef}
        type={type}
        isFocus={isFocus}
        showCount={showCount}
        selectedItems={selectedItems}
        clearable={clearable}
        show={show}
        valueRender={valueRender}
        placeholder={placeholder}
        checkedEvents={checkedEvents}
        onTrigger={onTrigger}
        onClear={handleClear}
      />
      {
        <Popper
          show={show}
          attachEle={inputRef.current}
          topGap={5}
          width={optionWidth}
          onKeyDown={handleKeyDown}
          placement={placement}
          overlayClassName={overlayClassName}
          className={`hi-selecttree__popper ${data.length === 0 && dataSource ? 'hi-selecttree__popper--loading' : ''}`}
          onClickOutside={() => {
            setIsFocus(false)
            setShow(false)
          }}
        >
          <Loading size="small" visible={nodeDataState === 'loading'}>
            <div
              className={`hi-selecttree__root theme__${theme} ${searchable ? 'hi-selecttree--hassearch' : ''}`}
              ref={selectTreeRoot}
            >
              {searchable && mode !== 'breadcrumb' && (
                <div className="hi-selecttree__searchbar-wrapper">
                  <div className="hi-selecttree__searchbar-inner">
                    <Icon name="search" />
                    <input
                      className="hi-selecttree__searchinput"
                      placeholder={localeDatas.selectTree.search}
                      clearable="true"
                      value={searchValue}
                      clearabletrigger="always"
                      onKeyDown={(e) => {
                        if (e.keyCode === '13') {
                          searchTreeNode(e.target.value)
                        }
                      }}
                      onChange={changeEvents}
                    />
                    {searchValue.length > 0 ? (
                      <i
                        className={`hi-icon icon-close-circle hi-selecttree_searchbar__icon-close`}
                        onClick={clearSearchEvent}
                      />
                    ) : null}
                  </div>
                </div>
              )}
              {mode === 'breadcrumb' ? (
                <NavTree
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
                  activeId={activeId}
                  localeDatas={localeDatas}
                />
              ) : (
                <Tree
                  data={flattenData}
                  originData={data}
                  expandIds={expandIds}
                  activeId={activeId}
                  dataSource={dataSource}
                  loadDataOnExpand={false}
                  checkable={type === 'multiple'}
                  checkedNodes={checkedNodes}
                  selectedItems={selectedItems}
                  nodeDataState={nodeDataState}
                  onSearch={searchTreeNode}
                  localeDatas={localeDatas}
                  // searchMode='highlight'
                  // defaultExpandIds={[]}
                  // defaultExpandAll
                  onExpand={expandEvents}
                  onClick={selectedEvents}
                  isRemoteLoadData={!!dataSource}
                  onCheck={checkedEvents}
                />
              )}
            </div>
          </Loading>
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
  data: [],
  clearable: true,
  onChange: () => {},
  onExpand: () => {},
  checkable: false,
  defaultLoadData: true,
  showCheckedMode: 'ALL',
  defaultExpandAll: false,
  defaultExpandIds: [],
  expandIds: [],
  mode: 'tree',
  searchMode: null
}
export default Provider(SelectTree)
