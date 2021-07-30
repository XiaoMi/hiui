import { Tree } from '../Tree'
// @ts-nocheck
import React, { useState, useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { TreeNodeData } from '../TreeNode'
import cloneDeep from 'lodash.clonedeep'

const useSearch = (
  // 使用 `null` 来唯一表示不选中任何实体
  defaultSelectedId: React.ReactText | null = null,
  selectedId?: React.ReactText | null,
  onSelect?: (selectedId: React.ReactText | null, item: TreeNodeData | null) => void,
  disabled = false
) => {
  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState([])
  const [filteredIds, setFilteredIds] = useState([])

  const showData = getShowData(
    cloneDeep(treeData),
    matchedNodes.map((n) => n.id),
    filteredIds
  )
}

const getMatchedNodes = (data, searchValue, matchedNodes = []) => {
  data.forEach((item) => {
    if (searchValue !== '' && item.title.includes(searchValue)) {
      matchedNodes.push(item)
    }
    if (item.children) {
      getMatchedNodes(item.children, searchValue, matchedNodes)
    }
  })
  return matchedNodes
}

const getShowData = (data, matchedIds, filtedIds) => {
  for (let i = 0; i < data.length; i++) {
    if (matchedIds.includes(data[i].id)) {
    } else if (filtedIds.includes(data[i].id)) {
      getShowData(data[i].children, matchedIds, filtedIds)
    } else {
      data.splice(i, 1)
      i = i - 1
    }
  }
  return data
}
