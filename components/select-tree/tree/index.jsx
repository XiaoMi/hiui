import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../../input'
import Loading from '../../loading'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index'
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
  onSearch,
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
  loadDataOnExpand,
  isRemoteLoadData
}) => {
  // 单选逻辑
  const [selectedId, setSelectedId] = useState(null)
  useEffect(() => {
    if (selectable) {
      setSelectedId(selectedId)
    }
  }, [selectable, selectedId])

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
        isRemoteLoadData
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
            <Input onChange={onSearch} />
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
