import React from 'react'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index'
import { getRootNodes } from './util'

const PREFIX = 'hi-select-tree'

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
  isRemoteLoadData,
  localeDatas,
  activeId,
  emptyContent
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
        isRemoteLoadData,
        activeId
      }}
    >
      <div className={`${PREFIX}`}>
        {nodeDataState === 'empty' && (
          <span className="hi-select-tree--empty">{emptyContent || localeDatas.selectTree.emptyContent}</span>
        )}
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
