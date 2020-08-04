import React from 'react'
import Loading from '../../../loading'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index'
import {
  getRootNodes
} from './util'

const PREFIX = 'select-tree'

const Tree = ({
  data,
  expandIds,
  checkedNodes,
  selectedItems,
  treeNodeRender,
  checkable,
  editable,
  editMenu,
  onClick,
  onCheck,
  onExpand,
  nodeDataState,
  loadDataOnExpand,
  isRemoteLoadData
}) => {
  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
        checkedNodes,
        selectedItems,
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
          nodeDataState === 'empty' && <span className='hi-select-tree--empty-text'>empty</span>
        }
        {nodeDataState === 'normal' && <TreeNode data={getRootNodes(data)} flttenData={data} />}
      </div>
    </TreeContext.Provider>
  )
}

Tree.defaultProps = {
  onExpand: () => {},
  loadDataOnExpand: false
}
export default Tree
