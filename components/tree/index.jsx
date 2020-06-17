import React, { useState, useCallback } from 'react'
import BaseTree from './BaseTree'
import Input from '../Input'
import Icon from '../Icon'
import { getAncestorIds } from './util'
import _ from 'lodash'

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
const PREFIX = 'hi-editor-tree'
const Tree = (props) => {
  const { searchable, searchConfig = {}, data, filter = false } = props
  const { placeholder = '关键词搜索', emptyContent = '未找到搜索结果' } = searchConfig
  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState([])
  const [filteredIds, setFilteredIds] = useState([])
  const showData = getShowData(
    _.cloneDeep(data),
    matchedNodes.map((n) => n.id),
    filteredIds
  )

  const treeNodeRender = useCallback(
    (title) => {
      if (typeof title === 'string' && title.includes(searchValue)) {
        const index = title.indexOf(searchValue)
        const beforeStr = title.substr(0, index)
        const afterStr = title.substr(index + searchValue.length)
        return (
          <span>
            {beforeStr}
            <span style={{ color: '#4284f5' }}>{searchValue}</span>
            {afterStr}
          </span>
        )
      } else {
        return title
      }
    },
    [searchValue]
  )
  return (
    <React.Fragment>
      {searchable && (
        <div className={`${PREFIX}__searcher`}>
          <Input
            value={searchValue}
            type='text'
            placeholder={placeholder}
            onChange={(e) => {
              const matchedNodes = getMatchedNodes(data, e.target.value)
              let filteredNodes = []
              matchedNodes.forEach((node) => {
                const ancestors = getAncestorIds(node.id, data, [])
                filteredNodes = filteredNodes.concat(ancestors)
              })
              setSearchValue(e.target.value)
              setMatchedNodes(matchedNodes)
              setFilteredIds(_.uniq(filteredNodes))
            }}
            append={<Icon name='search' style={{ fontSize: '16px' }} />}
            style={{ width: '250px', marginBottom: '24px' }}
          />
          <div />
          {matchedNodes.length === 0 && searchValue !== '' && (
            <div className='searcher__result--empty'>{emptyContent}</div>
          )}
        </div>
      )}
      <BaseTree
        {...props}
        treeNodeRender={treeNodeRender}
        expandedIds={filteredIds}
        data={filter && searchable && searchValue !== '' ? showData : data}
      />
    </React.Fragment>
  )
}

export default Tree
