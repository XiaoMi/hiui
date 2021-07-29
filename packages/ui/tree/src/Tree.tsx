// @ts-nocheck
import React, { forwardRef, useMemo, useImperativeHandle } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { flattenTreeData } from './utils'
import { useExpand, useSelect, useTreeDrop, useCache, useCheck, useEdit } from './hooks'
import { TreeNodeData } from './TreeNode'
import { TreeProvider } from './context'
import { MotionTreeNode } from './MotionTreeNode'
import VirtualList from 'rc-virtual-list'
import { defaultCollapseIcon, defaultExpandIcon, defaultLeafIcon } from './icons'

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
      disabled = false,
      // expand or collapse
      defaultExpandAll = false,
      expandedIds,
      defaultExpandedIds = [],
      onExpand,
      // virtual list
      height = 200,
      itemHeight = 32,
      virtual = true,
      // selectable
      selectable = true,
      selectedId: selectedIdProp,
      defaultSelectedId,
      onSelect,
      // editable
      onBeforeSave,
      onBeforeDelete,
      onSave,
      onDelete,
      // drag or drop
      draggable = false,
      onDragStart,
      onDragEnd,
      onDrop,
      onDropEnd,
      onDragOver,
      // async load
      onLoadChildren,
      // checkable
      checkable = false,
      defaultCheckedIds = [],
      checkedIds: checkedIdsProp,
      onCheck,
      // custom switcher
      collapseIcon = defaultCollapseIcon,
      expandIcon = defaultExpandIcon,
      leafIcon = defaultLeafIcon,
      // others
      showLine = false,
      highlightText = '',
      appearance = 'normal',
      titleRender,
      ...rest
    },
    ref
  ) => {
    // TODO: 考虑是否要做成 value-onChange 的受控模式
    // 目前修改来源有拖拽、编辑，通过回调函数的返回布尔值来进行是否内部以非受控模式更新 data
    // 在这种模式，当外部 data 一旦改变，内部的非受控状态 data 的所有改变都可能会被抹除
    const [treeData, setTreeData] = useCache(data)
    const flattedData: TreeNodeData[] = useMemo(() => flattenTreeData(treeData), [treeData])

    const disabledSelect = disabled || !selectable
    const [selectedId, trySelectNode] = useSelect(
      defaultSelectedId,
      selectedIdProp,
      onSelect,
      disabledSelect
    )

    const [
      transitionData,
      tryToggleExpandedIds,
      onNodeToggleStart,
      onNodeToggleEnd,
      checkIfExpanded,
    ] = useExpand(flattedData, defaultExpandedIds, expandedIds, onExpand, defaultExpandAll)

    const dropTree = useTreeDrop(treeData, flattedData, onDrop, onDropEnd)

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

    const treeRef = React.useRef<HTMLUListElement>(null)
    useImperativeHandle(
      ref,
      () =>
        ({
          ...treeRef.current,
          // TODO: 类型未声明
          // 约定内部向外暴露的自定义方法形式以 `$` 开头，避免和原生混合
          $saveNode: saveEdit,
          // $cancelAddNode: cancelAddNode,
          $deleteNode: deleteNode,
          $addChildNode: addChildNode,
          $addSiblingNode: addSiblingNode,
        } as HTMLUListElement),
      [deleteNode, addChildNode, addSiblingNode, saveEdit]
    )

    const cls = cx(prefixCls, className)

    const providedValue = useMemo(
      () => ({
        selectedId: selectedId,
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
        appearance,
        showLine,
        highlightText,
        collapseIcon,
        expandIcon,
        leafIcon,
        titleRender,
      }),
      [
        selectedId,
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
        appearance,
        showLine,
        highlightText,
        collapseIcon,
        expandIcon,
        leafIcon,
        titleRender,
      ]
    )

    // 呈现在可视范围的列表个数，undefined 表示没有限制
    const overscanCount = useMemo(() => {
      if (virtual === false || !height) {
        return undefined
      }
      return Math.ceil(height / itemHeight) + 1
    }, [virtual, height, itemHeight])

    // console.log(flattedData, transitionData)

    return (
      <TreeProvider value={providedValue}>
        <ul ref={treeRef} role={role} className={cls} {...rest}>
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
   * 默认展开所有树节点（非受控时才有效）
   */
  defaultExpandAll?: boolean
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
  /**
   * 展示连接线
   */
  showLine?: boolean
  /**
   * 高亮节点的文本内容
   */
  highlightText?: string
  onBeforeSave?: any
  onBeforeDelete?: any
  onSave?: any
  onDelete?: any
  // appearance?: 'normal' | 'folder'
  /**
   * 节点收起时的默认图标
   */
  collapseIcon?: React.ReactNode
  /**
   * 节点展开时的默认图标
   */
  expandIcon?: React.ReactNode
  /**
   * 叶子结点的默认图标
   */
  leafIcon?: React.ReactNode
  /**
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (node: TreeNodeData) => React.ReactNode
}

if (__DEV__) {
  Tree.displayName = 'Tree'
}
