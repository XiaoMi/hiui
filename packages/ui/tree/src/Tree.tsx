import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { flattenTreeData } from './utils'
import { useExpand, useSelect, useTreeDrop, useCheck, isMotionNode } from './hooks'
import { TreeNodeData, FlattedTreeNodeData, TreeDataStatus, TreeLevelStatus } from './types'
import { TreeProvider } from './context'
import VirtualList from 'rc-virtual-list'
import { MotionTreeNode } from './MotionTreeNode'
import { TreeNode } from './TreeNode'
import { useCache } from './hooks/use-cache'
import { useAsyncSwitch } from './hooks/use-async-switch'

const _role = 'tree'
export const _prefix = getPrefixCls(_role)

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
      // expand or collapse
      defaultExpandAll = false,
      expandedIds,
      defaultExpandedIds = [],
      onExpand,
      // async load
      onLoadChildren,
      // virtual list
      height,
      itemHeight = 32,
      virtual = true,
      // selectable
      selectable = true,
      selectedId: selectedIdProp,
      defaultSelectedId,
      onSelect,
      // drag or drop
      draggable = false,
      onDragStart,
      onDragEnd,
      onDrop,
      onDropEnd,
      onDragOver,
      onDragLeave,
      // checkable
      checkable = false,
      defaultCheckedIds = [],
      checkedIds: checkedIdsProp,
      onCheck,
      // custom switcher
      collapseIcon,
      expandIcon,
      leafIcon,
      // others
      showLine = false,
      titleRender,
      onContextMenu,
      ...rest
    },
    ref
  ) => {
    const [treeData, setTreeData] = useCache(data)

    const flattedData = useMemo(() => flattenTreeData(treeData), [treeData])

    const [isSelected, onNodeSelect] = useSelect(
      defaultSelectedId,
      selectedIdProp,
      onSelect,
      !selectable
    )

    const [onNodeCheck, isCheckedId, isSemiCheckedId] = useCheck(
      flattedData,
      defaultCheckedIds,
      checkedIdsProp,
      onCheck,
      !checkable
    )

    const [transitionData, onNodeToggleStart, onNodeToggleEnd, isExpandedId] = useExpand(
      flattedData,
      defaultExpandedIds,
      expandedIds,
      onExpand,
      defaultExpandAll
    )

    const dropTree = useTreeDrop(treeData, flattedData, setTreeData, onDrop, onDropEnd)

    const [isLoadingId, onNodeSwitch] = useAsyncSwitch(
      setTreeData,
      onNodeToggleStart,
      onLoadChildren
    )

    // 呈现在可视范围的列表个数，undefined 表示没有限制
    const overscanCount = useMemo(() => {
      if (virtual === false || !height) {
        return undefined
      }
      return Math.ceil(height / itemHeight) + 1
    }, [virtual, height, itemHeight])

    const getTreeNodeProps = (id: React.ReactText) => {
      return {
        expanded: isExpandedId(id),
        checked: isCheckedId(id),
        semiChecked: isSemiCheckedId(id),
        selected: isSelected(id),
        loading: isLoadingId(id),
      }
    }

    const providedValue = useMemo(
      () => ({
        onSelect: onNodeSelect,
        onExpand: onNodeSwitch,
        draggable,
        checkable,
        onNodeCheck,
        onDragStart,
        onDragEnd,
        onDragOver,
        onDragLeave,
        onDrop: dropTree,
        onLoadChildren,
        showLine,
        collapseIcon,
        expandIcon,
        leafIcon,
        titleRender,
      }),
      [
        onNodeSelect,
        onNodeSwitch,
        draggable,
        checkable,
        onNodeCheck,
        onDragStart,
        onDragEnd,
        onDragOver,
        onDragLeave,
        dropTree,
        onLoadChildren,
        showLine,
        collapseIcon,
        expandIcon,
        leafIcon,
        titleRender,
      ]
    )

    const cls = cx(prefixCls, className)

    return (
      <TreeProvider value={providedValue}>
        <ul ref={ref} role={role} className={cls} {...rest}>
          <VirtualList
            itemKey="id"
            fullHeight={false}
            height={height}
            itemHeight={itemHeight}
            virtual={virtual}
            data={transitionData}
          >
            {(node) => {
              return isMotionNode(node) ? (
                <MotionTreeNode
                  key={node.id}
                  data={node}
                  prefixCls={prefixCls}
                  onMotionEnd={onNodeToggleEnd}
                  overscanCount={overscanCount}
                  getTreeNodeProps={getTreeNodeProps}
                />
              ) : (
                <TreeNode key={node.id} data={node} {...getTreeNodeProps(node.id)} />
              )
            }}
          </VirtualList>
        </ul>
      </TreeProvider>
    )
  }
)

// eslint-disable-next-line no-redeclare
export type Tree = typeof Tree

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
  expandedIds?: React.ReactText[]
  /**
   * 默认展开的节点
   */
  defaultExpandedIds?: React.ReactText[]
  /**
   * 节点被点击(展开/收起)时触发
   */
  onExpand?: (expandIds: React.ReactText[], node: FlattedTreeNodeData, expanded: boolean) => void
  /**
   * 点击异步加载子项
   */
  onLoadChildren?: (node: FlattedTreeNodeData) => Promise<TreeNodeData[] | undefined>
  /**
   * 选中的节点
   */
  selectedId?: React.ReactText
  /**
   * 默认选中的节点
   */
  defaultSelectedId?: React.ReactText
  /**
   * 点击节点时触发选中，null 表示未选中
   */
  onSelect?: (selectedId: React.ReactText | null, selectedNode: FlattedTreeNodeData | null) => void
  /**
   * 节点是否可选中
   */
  selectable?: boolean
  /**
   * 节点可拖拽
   */
  draggable?: boolean
  /**
   * 节点开始拖拽时触发
   */
  onDragStart?: (dragNode: FlattedTreeNodeData) => void
  /**
   * 节点结束拖拽时触发
   */
  onDragEnd?: (dragNode: FlattedTreeNodeData) => void
  /**
   * 节点放开时触发，返回 true 表示允许更新拖拽后数据
   */
  onDrop?: (
    dragNode: FlattedTreeNodeData,
    dropNode: FlattedTreeNodeData,
    dataStatus: TreeDataStatus,
    level: TreeLevelStatus
  ) => boolean | Promise<any>
  /**
   * 节点拖拽成功时触发，`onDrop` 不拦截或者返回 `false` 才会触发
   */
  onDropEnd?: (dragNode: FlattedTreeNodeData, dropNode: FlattedTreeNodeData) => void
  /**
   * 节点 drag leaver 时调用
   */
  onDragLeave?: (node: FlattedTreeNodeData) => void
  /**
   * 节点 drag over 时调用
   */
  onDragOver?: (node: FlattedTreeNodeData) => void
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
  onCheck?: (
    checkedInfo: {
      checkedIds: React.ReactText[]
      semiCheckedIds: React.ReactText[]
    },
    node: FlattedTreeNodeData,
    checked: boolean
  ) => void
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
  titleRender?: (node: FlattedTreeNodeData) => React.ReactNode
  /**
   * 自定义节点右键菜单
   */
  onContextMenu?: (event: React.MouseEvent, node: FlattedTreeNodeData) => void
}

if (__DEV__) {
  Tree.displayName = 'Tree'
}
