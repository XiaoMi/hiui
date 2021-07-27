import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { flattenTreeData } from './utils'
import { useExpand, useSelect, useTreeDrop, useDataCache, useCheck, useEdit } from './hooks'
import { TreeNodeData } from './TreeNode'
import { TreeProvider } from './context'
import { MotionTreeNode } from './MotionTreeNode'
import VirtualList from 'rc-virtual-list'

const _role = 'tree'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Tree
 */
export const Tree = forwardRef<HTMLUListElement | null, TreeProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data,
      // expand
      expandedIds,
      defaultExpandedIds = [],
      onExpand,
      // virtual list
      height = 200,
      itemHeight = 28,
      virtual = true,
      // select
      selectedId,
      defaultSelectedId,
      onSelect,
      selectable = true,
      draggable = false,
      disabled = false,
      // edit
      onBeforeSave,
      onBeforeDelete,
      onSave,
      onDelete,
      // drag or drop
      onDragStart,
      onDragEnd,
      onDrop,
      onDropEnd,
      onDragOver,
      // async load
      onLoadChildren,
      // check
      checkable = false,
      defaultCheckedIds = [],
      checkedIds: checkedIdsProp,
      onCheck,
      ...rest
    },
    ref
  ) => {
    // TODO: 考虑是否要做成 value-onChange 的受控模式
    // 目前修改来源有拖拽、编辑，通过回调函数的返回布尔值来进行是否内部以非受控模式更新 data
    // 在这种模式，当外部 data 一旦改变，内部的非受控状态 data 的所有改变都可能会被抹除
    const [treeData, setTreeData] = useDataCache(data)

    const flattedData: TreeNodeData[] = useMemo(() => flattenTreeData(treeData), [treeData])

    const disabledSelect = disabled || !selectable
    const [selectedNodeId, trySelectNode] = useSelect(
      defaultSelectedId,
      selectedId,
      onSelect,
      disabledSelect
    )

    const [
      transitionData,
      tryToggleExpandedIds,
      onNodeToggleStart,
      onNodeToggleEnd,
      checkIfExpanded,
    ] = useExpand(flattedData, defaultExpandedIds, expandedIds, onExpand)

    const dropTree = useTreeDrop(treeData, flattedData, onDrop, onDropEnd)

    // const dragDropTree =  useTreeDragDrop({
    //   onDragStart,
    //   onDragEnd,
    //   onDragOver,
    //   onDrop,
    // })

    const [isCheckedId, isSemiCheckedId, onNodeCheck] = useCheck(
      flattedData,
      defaultCheckedIds,
      checkedIdsProp,
      onCheck
    )

    const [saveEdit, cancelAddNode, deleteNode, addChildNode, addSiblingNode] = useEdit(
      data,
      treeData,
      setTreeData,
      onBeforeSave,
      onBeforeDelete,
      onSave,
      onDelete
    )

    const cls = cx(prefixCls, className)

    const providedValue = useMemo(
      () => ({
        selectedId: selectedNodeId,
        onSelect: trySelectNode,
        onExpand: onNodeToggleStart,
        disabled,
        draggable,
        checkable,
        onNodeCheck,
        onDragStart,
        onDragEnd,
        onDrop: dropTree,
        onLoadChildren,
        // TODO: 抽离
        onSave: saveEdit,
        onCancel: cancelAddNode,
        onDelete: deleteNode,
        addChildNode,
        addSiblingNode,
        tryToggleExpandedIds,
      }),
      [
        selectedNodeId,
        trySelectNode,
        onNodeToggleStart,
        draggable,
        checkable,
        disabled,
        onNodeCheck,
        onDragStart,
        onDragEnd,
        dropTree,
        onLoadChildren,
        saveEdit,
        cancelAddNode,
        deleteNode,
        addChildNode,
        addSiblingNode,
        tryToggleExpandedIds,
      ]
    )

    // 呈现在可视范围的列表个数，undefined 表示没有限制
    const overscanCount = useMemo(() => {
      if (virtual === false || !height) {
        return undefined
      }
      return Math.ceil(height / itemHeight) + 1
    }, [virtual, height, itemHeight])

    console.log(flattedData, transitionData)

    return (
      <TreeProvider value={providedValue}>
        <ul ref={ref} role={role} className={cls} {...rest}>
          <VirtualList
            data={transitionData}
            itemKey={(item) => item.id}
            height={height}
            fullHeight={false}
            virtual={virtual}
            itemHeight={itemHeight}
            prefixCls={`${prefixCls}-list`}
          >
            {(node: TreeNodeData) => {
              return (
                <MotionTreeNode
                  // idx={index}
                  // tabIndex={index === defaultFocus ? 0 : -1}
                  key={node.id}
                  data={node}
                  onMotionEnd={onNodeToggleEnd}
                  // TODO: 注意这些属性对于动画节点并不生效
                  isExpanded={checkIfExpanded}
                  isChecked={isCheckedId}
                  isSemiChecked={isSemiCheckedId}
                  overscanCount={overscanCount}
                />
              )
            }}
          </VirtualList>
        </ul>
      </TreeProvider>
    )
  }
)

export interface TreeProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 展示数据
   */
  data: TreeNodeData[]
  /**
   * 展开的节点
   */
  expandedIds?: string[]
  /**
   * 默认展开的节点
   */
  defaultExpandedIds?: string[]
  /**
   * 节点被点击(展开/收起)时触发
   */
  onExpand?: (expandIds: React.ReactText[], expandedNode: TreeNodeData, expanded: boolean) => void
  /**
   * 选中的节点
   */
  selectedId?: string
  /**
   * 默认选中的节点
   */
  defaultSelectedId?: string
  /**
   * 点击节点时触发选中
   */
  onSelect?: (selectedId: React.ReactText | null, selectedNode: TreeNodeData | null) => void
  /**
   * 节点是否可选中
   */
  selectable?: boolean
  /**
   * 节点可拖拽
   */
  draggable?: boolean
  /**
   * 是否禁用节点
   */
  disabled?: boolean
  /**
   * 节点开始拖拽时触发
   */
  onDragStart?: (dragNode: TreeNodeData) => void
  /**
   * 节点结束拖拽时触发
   */
  onDragEnd?: (dragNode: TreeNodeData) => void
  /**
   * 节点放开时触发
   */
  onDrop?: (
    dragNode: TreeNodeData,
    dropNode: TreeNodeData,
    data: TreeNodeData[],
    level: number
  ) => boolean
  /**
   * 节点拖拽成功时触发
   */
  onDropEnd?: (dragNode: TreeNodeData, dropNode: TreeNodeData) => void
  onDragOver?: any
  /**
   * 点击异步加载子项
   */
  onLoadChildren?: (selectedNode: TreeNodeData) => TreeNodeData
  /**
   * 节点前添加 Checkbox 复选框（暂不支持与 draggable 和 editable 同时使用）
   */
  checkable?: boolean
  /**
   * 默认选中的复选框的节点
   */
  defaultCheckedIds?: React.ReactText[]
  /**
   * 选中的复选框的节点
   */
  checkedIds?: React.ReactText[]
  /**
   * 点击节点多选框触发
   */
  onCheck?: (checkedIds: React.ReactText[], checkedNode: TreeNodeData, checked: boolean) => void
  /**
   * 设置虚拟滚动容器的可视高度
   */
  height?: number
  /**
   * 设置虚拟列表每项的固定高度
   */
  itemHeight?: number
  /**
   * 	设置 `true` 开启虚拟滚动
   */
  virtual?: boolean
}

if (__DEV__) {
  Tree.displayName = 'Tree'
}
