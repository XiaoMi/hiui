import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../../input'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index.scss'
import {
  getRootNodes,
  getNode,
  updateCheckData,
  updateUnCheckData
} from './util'

const PREFIX = 'select-tree'

const _parseData = (data, pId = null, nArr = []) => {
  data.forEach(node => {
    node.pId = pId
    nArr.push(node)
    if (node.children) {
      _parseData(node.children, node.id, nArr)
    } else {
      node.isLeaf = true
    }
  })
  return nArr
}
const Tree = ({
  searchable,
  data,
  treeNodeRender,
  checkable,
  selectable = true,
  selectedId,
  onSelect,
  editable,
  editMenu,
  onClick,
  checkedIds,
  onCheck,
  defaultCheckedIds,
  searchMode
}) => {
  // 单选逻辑
  const [_selectedId, setSelectedId] = useState(null)
  const [parseData, setParseData] = useState(_parseData(data) || [])
  useEffect(() => {
    if (selectable) {
      setSelectedId(selectedId)
    }
  }, [selectable, selectedId])

  const onSelectNode = useCallback((selectedId) => {
    if (selectable) {
      if (selectedId !== undefined) {
        setSelectedId(selectedId)
      }
      if (onSelect) {
        onSelect(selectedId)
      }
    }
  }, [onSelect, selectable])

  // 多选逻辑
  const [checkedNodes, setCheckedNodes] = useState({
    checked: [],
    semiChecked: []
  })

  useEffect(() => {
    if (checkable && defaultCheckedIds) {
      let semiCheckedIds = new Set(checkedNodes.semiChecked)
      let checkedIds = new Set(checkedNodes.checked)
      semiCheckedIds.clear()
      checkedIds.clear()
      let isUpdate = false
      defaultCheckedIds.forEach(id => {
        const node = getNode(id, parseData)
        if (node) {
          isUpdate = true
          updateCheckData(node, parseData, checkedIds, semiCheckedIds)
        }
      })
      isUpdate && setCheckedNodes({
        checked: [...checkedIds],
        semiChecked: [...semiCheckedIds]
      })
    }
  }, [defaultCheckedIds])

  const onCheckboxChange = useCallback(
    (checked, node) => {
      let result = {}
      let semiCheckedIds = new Set(checkedNodes.semiChecked)
      let checkedIds = new Set(checkedNodes.checked)
      if (checked) {
        result = updateCheckData(node, parseData, checkedIds, semiCheckedIds)
      } else {
        result = updateUnCheckData(node, parseData, checkedIds, semiCheckedIds)
      }
      setCheckedNodes(result)
      let checkedArr = []
      if (result.checked.length > 0) {
        checkedArr = result.checked.map(id => {
          return getNode(id, parseData)
        })
      }
      onCheck(result, node, checkedArr)
    },
    [checkedNodes, parseData, onCheck]
  )
  const searchTreeNode = useCallback((e) => {
    const val = e.target.value
    if (searchMode === 'highlight') {
      const filterArr = parseData.map(node => {
        const reg = new RegExp(val, 'g')
        const str = `<span style="color: #428ef5">${val}</span>`
        node._title = node.title.replace(reg, str)
        return node
      })
      setParseData(filterArr)
    }
  }, [parseData])
  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
        checkedNodes,
        selectedId: _selectedId,
        onSelectNode,
        editable,
        editMenu,
        PREFIX,
        onClick,
        onCheckboxChange
      }}
    >
      <div className={PREFIX}>
        {searchable && (
          <div style={{ marginBottom: 12 }}>
            <Input onChange={searchTreeNode} />
          </div>
        )}
        <TreeNode data={getRootNodes(parseData)} originData={parseData} />
      </div>
    </TreeContext.Provider>
  )
}

export default Tree
