import React, { useContext, useRef, useCallback, useState } from 'react'
import Checkbox from '../../checkbox'
import Icon from '../../icon'
import Classnames from 'classnames'
import TreeContext from './context'
import IconLoading from './LoadingIcon'
import { getChildrenNodes } from './util'

const Switcher = ({expanded, node, onExpandEvent}) => {
  const [loading, setLoading] = useState(false)
  return (
    loading ? <IconLoading /> : <Icon
      name={expanded ? 'open' : 'packup'}
      onClick={() => {
        !expanded && setLoading(true)
        onExpandEvent(!expanded, node, () => setLoading(false))
      }}
    />
  )
}

const TreeNode = ({ data, flttenData }) => {
  // 接受原始拉平数据，用于快速查找子元素
  const {
    treeNodeRender,
    checkable,
    checkedNodes,
    onSelectNode,
    onClick,
    selectedId,
    onCheckboxChange,
    expandIds,
    onExpandEvent,
    isRemoteLoadData
  } = useContext(TreeContext)

  const treeNodeRef = useRef(null)

  const renderIndent = useCallback(() => {
    return <span style={{ flex: '0 0 24px' }} />
  }, [])

  const renderCheckbox = useCallback((node, { checked, semiChecked }) => {
    return (
      <Checkbox
        indeterminate={semiChecked.includes(node.id)}
        checked={checked.includes(node.id)}
        onChange={e => {
          onCheckboxChange(e.target.checked, node, { checked, semiChecked })
        }}
      />
    )
  }, [checkedNodes])

  const renderTitle = useCallback((node, _selectedId) => {
    const { id, title, _title } = node
    return (
      <div
        ref={treeNodeRef}
        className={Classnames('tree-node__title', {
          'tree-node__title--selected': _selectedId === id
        })}
        onClick={() => {
          onClick(node)
          onSelectNode(id)
        }}
        dangerouslySetInnerHTML={{__html: treeNodeRender ? treeNodeRender(_title || title) : (_title || title)}}
      />
    )
  }, [])
  return (
    <ul >
      {
        data.map((node, index) => {
          const childrenNodes = getChildrenNodes(node, flttenData)
          const expand = expandIds.includes(node.id)
          return <React.Fragment key={index}>
            <li className='tree-node'>
              <div className='tree-node__self'>
                {((node.children && childrenNodes.length) || isRemoteLoadData)
                  ? <Switcher expanded={expand} node={node} onExpandEvent={onExpandEvent} />
                  : renderIndent()}
                {checkable && renderCheckbox(node, checkedNodes)}
                {renderTitle(node, selectedId)}
              </div>
            </li>
            {
              childrenNodes.length > 0 && expand && <li className='tree-node'><TreeNode data={childrenNodes} flttenData={flttenData} /></li>
            }
          </React.Fragment>
        })
      }
    </ul>
  )
}

export default TreeNode
