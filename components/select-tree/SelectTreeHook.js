import React, { useState, useRef, useCallback, useEffect } from 'react'
import Tree from './tree'
import qs from 'qs'
import Popper from '../popper'
import classNames from 'classnames'
import {
  flattenNodesData,
  getNode,
  updateCheckData,
  updateUnCheckData,
  hasChildren,
  parseDefaultSelectedItems,
  parseCheckStatusData,
  parseSelectedItems
} from './tree/util'
import NavTree from './NavTree'

const SelectTree = ({
  data,
  dataSource,
  type,
  defaultExpandIds,
  defaultExpandAll,
  showCheckedMode,
  defaultValue,
  onChange,
  onExpand,
  defaultLoadData = true,
  clearable,
  mode = 'tree'
}) => {
  const selectedItemsRef = useRef()
  const inputRef = useRef()
  const [showCount, setShowCount] = useState(0)
  const [show, setShow] = useState(false)
  const [nodeDataState, setNodeDataState] = useState('normal')
  const [selectedItems, setSelectedItems] = useState([])
  // const [selectedIds, setSelectedIds] = useState([])
  const [expandIds, setExpandIds] = useState([])
  const [nodeEntries, setNodeEntries] = useState({})
  const [calShowCountFlag, setCalShowCountFlag] = useState(true)
  const [checkedNodes, setCheckNodes] = useState({
    checked: [],
    semiChecked: []
  })
  const [flattenData, setFlattenData] = useState([])
  useEffect(() => {
    setStatus()
    if (data) {
      const result = flattenNodesData(data, defaultExpandIds, defaultExpandAll, (type === 'multiple' && showCheckedMode !== 'ALL'))
      setFlattenData(result.flattenData)
      setExpandIds(result.expandIds)
      setNodeEntries(result.nodeEntries)
      const _selectedItems = parseDefaultSelectedItems(defaultValue, result.flattenData)
      setSelectedItems(_selectedItems)
      if (type === 'multiple' && defaultValue) {
        const cstatus = parseCheckStatusData(selectedItems, checkedNodes, flattenData)
        if (cstatus) {
          setCheckNodes(cstatus)
        }
      }
      const res = parseSelectedItems(checkedNodes, nodeEntries, showCheckedMode, flattenData)
      setSelectedItems(res)
    }
  }, [data])
  useEffect(() => {
    if (calShowCountFlag && selectedItemsRef.current) {
      const sref = selectedItemsRef.current
      // 多选超过一行时以数字显示
      const itemsRect = sref.getBoundingClientRect()
      let width = 0
      let showCount = 0
      const items = sref.querySelectorAll('.hi-select__input--item')
      for (const item of items) {
        const itemRect = item.getBoundingClientRect()
        width += itemRect.width
        if (width + 16 < itemsRect.width) {
          ++showCount
        } else {
          break
        }
      }
      setShowCount(showCount)
      setCalShowCountFlag(false)
    } else {
      setCalShowCountFlag(true)
    }
  }, [selectedItems])

  const handleClear = useCallback(() => {
    setSelectedItems([])
    setExpandIds([])
    setCheckNodes({
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
              isLeaf: false,
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
  const _checkedEvents = (checked, node) => {
    let result = {}
    let semiCheckedIds = new Set(checkedNodes.semiChecked)
    let checkedIds = new Set(checkedNodes.checked)
    if (checked) {
      result = updateCheckData(node, flattenData, checkedIds, semiCheckedIds)
    } else {
      result = updateUnCheckData(node, flattenData, checkedIds, semiCheckedIds)
    }
    setCheckNodes({
      checked: result.checked,
      semiChecked: result.semiChecked
    })
    parseSelectedItems(result, nodeEntries, showCheckedMode, flattenData)
    let checkedArr = []
    if (result.checked.length > 0) {
      checkedArr = result.checked.map(id => {
        return getNode(id, flattenData)
      })
    }
    onChange(result, node, checkedArr)
  }

  /**
  * 节点展开关闭事件
  * @param {*} bol 是否展开
  * @param {*} node 当前点击节点
  */
  const _expandEvents = (bol, node, callback) => {
    const _expandIds = [...expandIds]
    const hasIndex = _expandIds.findIndex(id => id === node.id)
    if (hasIndex !== -1) {
      _expandIds.splice(hasIndex, 1)
    } else {
      _expandIds.push(node.id)
    }
    if (hasChildren(node, flattenData)) {
      // 如果包含节点，则不再拉取数据
      setExpandIds(_expandIds)
      callback()
      onExpand()
      return
    }
    loadNodes(node.id).then((res) => {
      setExpandIds(_expandIds)
      setFlattenData(flattenData.concat(res))
      callback()
    })
    onExpand()
  }

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
          if (defaultLoadData && (!data || data.length === 0 || dataSource)) {
            // data 为空 且 存在 dataSource 时，默认进行首次数据加载.defaultLoadData不暴露
            setNodeDataState('loading')
            loadNodes().then((res) => {
              if (res.length === 0) {
                setNodeDataState('empty')
              }
              setNodeDataState('normal')
              setFlattenData(res)
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
                      }}
                    >
                      <i className='hi-icon icon-close' />
                    </span>
                  }
                </div>
              )
            })}
          {showCount < selectedItems.length &&
            <div className='hi-select__input-items--left'>
              +
              <span className='hi-select__input-items--left-count'>
                {selectedItems.length - showCount}
              </span>
            </div>}
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
          // onClickOutside={() => this.setState({dropdownShow: false})}
        >
          {
            mode === 'breadcrumb' ? <NavTree
              data={flattenData}
              originData={data}
              checkedNodes={checkedNodes}
              checkable={type === 'multiple'}
              onCheck={_checkedEvents}
            /> : <Tree
              data={flattenData}
              originData={data}
              expandIds={expandIds}
              dataSource={dataSource}
              loadDataOnExpand={false}
              checkable={type === 'multiple'}
              checkedNodes={checkedNodes}
              nodeDataState={nodeDataState}
              // searchable
              // searchMode='highlight'
              // defaultExpandIds={[]}
              // defaultExpandAll
              onExpand={_expandEvents}
              onClick={node => {
                setSelectedItems([node])
                onChange(node.id)
              }}
              onCheck={(checked, node) => {
                _checkedEvents(checked, node)
                // this.setState({ selectedItems: checkedArr })
                // calcShowCount()
              }}
            />
          }
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
  showCheckedMode: 'CHILD'
}
export default SelectTree
