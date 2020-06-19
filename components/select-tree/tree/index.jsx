import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../../input'
import Loading from '../../loading'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index.scss'
import {
  getRootNodes
} from './util'

const PREFIX = 'select-tree'

const _parseData = (data, defaultExpandIds = [], defaultExpandAll = false, expands = [], pId = null, nArr = []) => {
  data.forEach(node => {
    node.pId = pId
    node.isLoaded = false
    node._origin = true
    nArr.push(node)
    if (node.children) {
      if (defaultExpandIds.includes(node.id) || defaultExpandAll) {
        expands.push(node.id)
      }
      _parseData(node.children, defaultExpandIds, defaultExpandAll, expands, node.id, nArr)
    } else {
      node.isLeaf = true
    }
  })
  return {
    data: nArr,
    expands
  }
}
const Tree = ({
  searchable,
  data,
  expandIds,
  checkedNodes,
  treeNodeRender,
  checkable,
  selectable = true,
  onSelect,
  editable,
  editMenu,
  onClick,
  onCheck,
  searchMode,
  onExpand,
  dataSource,
  nodeDataState,
  loadDataOnExpand
}) => {
  // 单选逻辑
  const [selectedId, setSelectedId] = useState(null)
  // const [expandIds, setExpandIds] = useState(defaultExpandIds || [])
  // const [parseData, setParseData] = useState([])
  // 多选逻辑
  // const [checkedNodes, setCheckedNodes] = useState({
  //   checked: [],
  //   semiChecked: []
  // })
  // useEffect(() => {
  //   const result = _parseData(data, defaultExpandIds, defaultExpandAll)
  //   setParseData(result.data)
  //   setExpandIds(result.expands)
  // }, [data])
  useEffect(() => {
    if (selectable) {
      setSelectedId(selectedId)
    }
  }, [selectable, selectedId])

  // useEffect(() => {
  //   defaultValue.forEach(val => {
  //     let node
  //     if (typeof val !== 'object') {
  //       // [0, 'x']
  //       node = getNodeByIdTitle(val, parseData)
  //       console.log(node)
  //     } else {
  //       if (val.id && val.title) {
  //         // [{id: '', title: ''}]
  //         node = getNode(val.id, parseData)
  //       } else {
  //         node = getNodeByIdTitle(val.id || val.title, parseData)
  //       }
  //     }
  //     if (node) {
  //       _checkedEvents(true, node)
  //     }
  //   })
  // }, [parseData])
  const onSelectNode = useCallback((_selectedId) => {
    if (selectable) {
      if (_selectedId !== undefined) {
        setSelectedId(_selectedId)
      }
      if (onSelect) {
        onSelect(_selectedId)
      }
    }
  }, [onSelect, selectable])

  // useEffect(() => {
  //   if (checkable && defaultCheckedIds) {
  //     let semiCheckedIds = new Set(checkedNodes.semiChecked)
  //     const _checkedIds = new Set(checkedNodes.checked)
  //     semiCheckedIds.clear()
  //     _checkedIds.clear()
  //     let isUpdate = false
  //     defaultCheckedIds.forEach(id => {
  //       const node = getNode(id, parseData)
  //       if (node) {
  //         isUpdate = true
  //         updateCheckData(node, parseData, _checkedIds, semiCheckedIds)
  //       }
  //     })
  //     isUpdate && setCheckedNodes({
  //       checked: [..._checkedIds],
  //       semiChecked: [...semiCheckedIds]
  //     })
  //   }
  // }, [parseData])

  // const _checkedEvents = (checked, node) => {
  //   let result = {}
  //   let semiCheckedIds = new Set(checkedNodes.semiChecked)
  //   let _checkedIds = new Set(checkedNodes.checked)
  //   if (checked) {
  //     result = updateCheckData(node, data, _checkedIds, semiCheckedIds)
  //   } else {
  //     result = updateUnCheckData(node, data, _checkedIds, semiCheckedIds)
  //   }
  //   setCheckedNodes(result)
  //   let checkedArr = []
  //   if (result.checked.length > 0) {
  //     checkedArr = result.checked.map(id => {
  //       return getNode(id, data)
  //     })
  //   }
  //   onCheck(result, node, checkedArr)
  // }
  // const onCheckboxChange = useCallback(
  //   onCheck,
  //   [checkedNodes, data, onCheck]
  // )

  // 节点展开或关闭方法
  // const onExpandEvent = useCallback((bol, node) => {
  //   onExpand(bol, node)
  // const _expandIds = [...expandIds]
  // const hasIndex = _expandIds.findIndex(id => id === node.id)
  // if (hasIndex !== -1) {
  //   _expandIds.splice(hasIndex, 1)
  // } else {
  //   _expandIds.push(node.id)
  // }
  // if (hasChildren(node, data)) {
  //   // 如果包含节点，则不再拉取数据
  //   setExpandIds(_expandIds)
  //   onExpand()
  //   return
  // }
  // // setExpandIds(_expandIds)
  // const _dataSource = typeof dataSource === 'function' ? dataSource(node.id) : dataSource
  // let {
  //   url,
  //   transformResponse,
  //   params,
  //   type = 'GET'
  // } = _dataSource
  // url = url.includes('?') ? `${url}&${qs.stringify(params)}` : `${url}?${qs.stringify(params)}`
  // window.fetch(url, {
  //   method: type
  // })
  //   .then(response => response.json())
  //   .then(res => {
  //     const _res = transformResponse(res)
  //     const nArr = _res.map(n => {
  //       return {
  //         ...n,
  //         isLeaf: true,
  //         pId: node.id
  //       }
  //     })
  //     // console.log(_expandIds)
  //     setExpandIds(_expandIds)
  //     setParseData(preData => preData.concat(nArr))
  //   })
  // onExpand()
  // }, [expandIds, data])
  // 过滤方法
  // const searchTreeNode = useCallback((e) => {
  //   const val = e.target.value
  //   if (searchMode === 'highlight') {
  //     const filterArr = parseData.map(node => {
  //       const reg = new RegExp(val, 'g')
  //       const str = `<span style="color: #428ef5">${val}</span>`
  //       node._title = node.title.replace(reg, str)
  //       return node
  //     })
  //     setParseData(filterArr)
  //   }
  // }, [parseData])
  console.log(1, nodeDataState)
  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
        checkedNodes,
        selectedId,
        onSelectNode,
        editable,
        editMenu,
        PREFIX,
        onClick,
        onCheckboxChange: onCheck,
        expandIds,
        onExpandEvent: onExpand,
        loadDataOnExpand,
        isRemoteLoadData: !!dataSource
      }}
    >
      <div className={`${PREFIX}`}>
        {
          nodeDataState === 'loading' && <Loading size='small' />
        }
        {
          nodeDataState === 'empty' && <span>无结果</span>
        }
        {searchable && (
          <div style={{ marginBottom: 12 }}>
            <Input />
          </div>
        )}
        <TreeNode data={getRootNodes(data)} flttenData={data} />
      </div>
    </TreeContext.Provider>
  )
}

Tree.defaultProps = {
  onExpand: () => {},
  loadDataOnExpand: false
}
export default Tree
