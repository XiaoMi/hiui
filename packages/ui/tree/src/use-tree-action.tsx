import React, { useState, useCallback, useMemo, useRef, forwardRef } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { cx } from '@hi-ui/classname'
import { TreeProps, Tree, treePrefix } from './Tree'
import {
  FlattedTreeNodeData,
  TreeNodeType,
  TreeDataItem,
  TreeDataStatus,
  TreeMenuActionOption,
  TreeNodeEventData,
} from './types'
import { useEdit, useCache, useExpandProps } from './hooks'
import { flattenTreeData } from './utils'
import Input from '@hi-ui/input'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useToggle, UseToggleAction } from '@hi-ui/use-toggle'
import { useLatestRef } from '@hi-ui/use-latest'
import Popper from '@hi-ui/popper'
import { CheckOutlined, CloseOutlined } from '@hi-ui/icons'
// import Button from '@hi-ui/button'
import { IconButton } from './IconButton'
import { defaultActionIcon } from './icons'
import { isArrayNonEmpty, isFunction } from '@hi-ui/type-assertion'

import './styles/editable-tree.scss'

/**
 * 将 BaseTree 添加定制搜索功能，返回 SearchableTree
 *
 * @param props
 * @returns
 */
export const useTreeAction = (BaseTree: Tree) => {
  const AdvancedTreeMemo = useMemo(() => {
    // 高阶组件
    const AdvancedTree = forwardRef<HTMLUListElement | null, EditableTreeProps>((props, ref) => {
      const treeRef = useRef<HTMLUListElement>(null)

      const treeProps = useTreeEditProps(props, treeRef)

      return <BaseTree ref={useMergeRefs(ref, treeRef)} {...treeProps} />
    })
    if (__DEV__) {
      AdvancedTree.displayName = 'AdvancedTree'
    }

    return AdvancedTree
  }, [BaseTree])

  return AdvancedTreeMemo
}

export const useTreeEditProps = <T extends EditableTreeProps>(
  props: T,
  ref: React.RefObject<HTMLElement | null>
) => {
  const {
    prefixCls = treePrefix,
    className,
    data,
    editable = true,
    expandedIds: expandedIdsProp,
    defaultExpandedIds = [],
    onExpand,
    defaultExpandAll = false,
    render: titleRender,
    onBeforeSave,
    onBeforeDelete,
    onSave,
    onDelete,
    menuOptions,
    editPlaceholder: placeholder,
    fieldNames,
    ...nativeTreeProps
  } = props
  const [treeData, setTreeData] = useCache(data)
  const flattedData = useMemo(() => flattenTreeData(treeData, fieldNames), [treeData, fieldNames])

  // 拦截 expand：用于添加子节点时自动展开当前节点
  // 但是对外仍然暴露 expand 及其相关 props 原有的功能
  const [expandedIds, tryToggleExpandedIds] = useExpandProps(
    flattedData,
    defaultExpandedIds,
    expandedIdsProp,
    onExpand,
    defaultExpandAll
  )

  const focusTree = useCallback(() => {
    ref.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [saveEdit, cancelAddNode, deleteNode, addChildNode, addSiblingNode] = useEdit(
    treeData,
    setTreeData,
    onBeforeSave,
    onBeforeDelete,
    onSave,
    onDelete
  )

  const renderTitleWithEditable = (node: FlattedTreeNodeData, title?: React.ReactNode) => {
    return (
      <EditableTreeNodeTitle
        prefixCls={prefixCls}
        node={node}
        title={title}
        placeholder={placeholder}
        menuOptions={menuOptions}
        onSave={saveEdit}
        onCancel={cancelAddNode}
        onDelete={deleteNode}
        addChildNode={addChildNode}
        addSiblingNode={addSiblingNode}
        expandedIds={expandedIds}
        focusTree={focusTree}
        onExpand={tryToggleExpandedIds}
      />
    )
  }

  const proxyTitleRender = (node: TreeNodeEventData) => {
    if (titleRender) {
      const ret = titleRender(node)

      if (ret && ret !== true) {
        return editable ? renderTitleWithEditable(node, ret) : ret
      }
    }

    return editable ? renderTitleWithEditable(node) : true
  }

  const treeProps = {
    ...nativeTreeProps,
    fieldNames,
    render: proxyTitleRender,
    data: editable ? treeData : data,
    expandedIds,
    onExpand: tryToggleExpandedIds,
    className: cx(className, `${prefixCls}--editable`),
  }

  return treeProps
}

export interface EditableTreeProps extends TreeProps {
  /**
   * 开启后节点可编辑（内置：添加同级节点、添加子节点、编辑节点、删除节点、关闭菜单）
   * 其中添加或编辑节点仅在 node.title 类型为字符串下支持
   */
  editable?: boolean
  /**
   * 节点保存新增、编辑状态时触发，返回 false 则节点保持失败，不会触发 onSave
   */
  onBeforeSave?: (
    savedNode: FlattedTreeNodeData,
    data: TreeDataStatus,
    level: number
  ) => boolean | Promise<boolean>
  /**
   * 	节点保存新增、编辑状态后触发
   */
  onSave?: (savedNode: FlattedTreeNodeData, data: TreeDataItem[]) => void
  /**
   * 节点删除前触发，返回 false 则节点删除失败，不会触发 onDelete
   */
  onBeforeDelete?: (
    deletedNode: FlattedTreeNodeData,
    data: TreeDataStatus,
    level: number
  ) => boolean | Promise<boolean>
  /**
   * 节点删除后触发
   */
  onDelete?: (deletedNode: FlattedTreeNodeData, data: TreeDataItem[]) => void
  /**
   * 自定义树菜单行为项
   */
  menuOptions?: TreeMenuActionOption[] | ((node: FlattedTreeNodeData) => TreeMenuActionOption[])
  /**
   * 输入框占位符
   */
  editPlaceholder?: string
}

const EditableTreeNodeTitle = (props: EditableTreeNodeTitleProps) => {
  const { prefixCls, node, title } = props

  // 如果是添加节点，则进入节点编辑临时态
  const [editing, editingAction] = useToggle(() => node.raw.type === TreeNodeType.ADD || false)

  if (editing) {
    return <EditableNodeInput {...props} editingAction={editingAction} />
  }

  return (
    <div className={`${prefixCls}__title`}>
      <span className={`${prefixCls}__title-text`}>{title || node.title}</span>
      <EditableNodeMenu {...props} editingAction={editingAction} />
    </div>
  )
}

interface EditableTreeNodeTitleProps {
  prefixCls: string
  title?: React.ReactNode
  node: FlattedTreeNodeData
  expandedIds: React.ReactText[]
  onCancel: (node: FlattedTreeNodeData) => void
  onSave: (savedNode: FlattedTreeNodeData) => Promise<void>
  onDelete: (deletedNode: FlattedTreeNodeData) => Promise<void>
  addChildNode: (node: FlattedTreeNodeData) => void
  addSiblingNode: (node: FlattedTreeNodeData) => void
  onExpand: (ids: React.ReactText[]) => void
  placeholder?: string
  menuOptions?: TreeMenuActionOption[] | ((node: FlattedTreeNodeData) => TreeMenuActionOption[])
  focusTree: () => void
}

const EditableNodeMenu = (props: EditableNodeMenuProps) => {
  const {
    prefixCls = treePrefix,
    node,
    editingAction,
    onDelete,
    addChildNode,
    addSiblingNode,
    expandedIds,
    onExpand,
    menuOptions: menuOptionsProp,
  } = props

  const [menuVisible, menuVisibleAction] = useToggle(false)
  const [targetElRef, setTargetElRef] = useState<HTMLButtonElement | null>(null)

  // const [setTargetEl, Modal, open] = useConfirmPopper({
  //   prefixCls,
  //   onConfirm: (evt) => { evt.stopPropagation(); onDelete(node) },
  //   content: '确定要删除当前节点 ？',
  //   confirmText: '确定',
  //   cancelText: '取消',
  // })

  const menuActionsRef = useLatestRef({
    editNode: () => {
      editingAction.on()
      menuVisibleAction.off()
    },
    deleteNode: () => {
      onDelete(node)
        .then(() => {
          menuVisibleAction.off()
        })
        .catch(() => {
          menuVisibleAction.off()
        })
    },
    addChildNode: () => {
      menuVisibleAction.off()
      addChildNode(node)
      // 展开子节点列表
      onExpand(expandedIds.concat(node.id))
    },
    addSiblingNode: () => {
      menuVisibleAction.off()
      addSiblingNode(node)
    },
    closeMenu: () => {
      menuVisibleAction.off()
    },
  })

  const handleMenuClick = useCallback(
    (node: FlattedTreeNodeData, option: TreeMenuActionOption) => {
      if (option.type) {
        menuActionsRef.current[option.type]()
      }
      option.onClick?.(node, menuActionsRef.current)
    },
    [menuActionsRef]
  )

  const menuOptions = useMemo(() => {
    let menuOptions = menuOptionsProp

    if (isFunction(menuOptionsProp)) {
      menuOptions = menuOptionsProp(node)
    }

    return menuOptions
  }, [menuOptionsProp, node])

  if (!isArrayNonEmpty(menuOptions)) return null

  return (
    <>
      <IconButton
        tabIndex={-1}
        className={cx(`${prefixCls}-action-btn`, menuVisible && `${prefixCls}-action-btn--visible`)}
        // ref={useMergeRefs(setTargetElRef, setTargetEl)}
        ref={setTargetElRef}
        icon={defaultActionIcon}
        onClick={(evt) => {
          // 阻止冒泡，避免触发节点选中
          evt.stopPropagation()
          menuVisibleAction.not()
        }}
      />
      <Popper
        crossGap={8}
        className={`${prefixCls}__popper`}
        placement="bottom-end"
        visible={!!menuOptions && menuVisible}
        onClose={menuVisibleAction.off}
        attachEl={targetElRef}
      >
        <ul className={`${prefixCls}-action`}>
          {menuOptions.map((option, idx) => (
            <li
              key={idx}
              className={`${prefixCls}-action__item`}
              onClick={(evt) => {
                // 阻止冒泡，避免触发节点选中
                evt.stopPropagation()
                handleMenuClick(node, option)
              }}
            >
              {option.title}
            </li>
          ))}
        </ul>
      </Popper>
    </>
  )
}

interface EditableNodeMenuProps extends EditableTreeNodeTitleProps {
  editingAction: UseToggleAction
}

/**
 * 节点编辑框
 */
const EditableNodeInput = (props: EditableNodeInputProps) => {
  const {
    prefixCls = treePrefix,
    node,
    onSave,
    onCancel,
    editingAction,
    placeholder,
    focusTree,
  } = props

  const [inputValue, setInputValue] = useState((node.title as string) || '')
  const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.target.value)
  }, [])

  const editElementRef = React.useRef<HTMLDivElement | null>(null)

  const cancelEdit = () => {
    editingAction.off()
    onCancel?.(node)
  }

  const saveEdit = () => {
    if (!inputValue) return

    onSave?.({ ...node, title: inputValue })
      .then(() => {
        editingAction.off()
        // 在编辑或创建节点成功，需要 focus 该节点
        focusTree()
      })
      .catch(() => {
        editingAction.off()
        // 在编辑或创建节点成功，需要 focus 该节点
        focusTree()
      })
  }

  const onKeydown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.keyCode === 13) {
      evt.preventDefault()
      evt.stopPropagation()

      saveEdit()
    }
  }

  useOutsideClick(editElementRef, cancelEdit)

  return (
    <div
      ref={editElementRef}
      className={cx(`${prefixCls}__title`, `${prefixCls}__title--editing`)}
      // TODO： 整行不允许冒泡触发节点选中
      onClick={(evt) => evt.stopPropagation()}
    >
      <Input
        autoFocus
        style={{ flex: 1 }}
        // 避免冒泡到 tree 失焦
        onBlur={(evt) => evt.stopPropagation()}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={onKeydown}
      />
      <span className={`${prefixCls}__action`}>
        <IconButton
          active={!!inputValue}
          tabIndex={-1}
          icon={<CheckOutlined />}
          onBlur={(evt) => {
            // 避免冒泡到 tree 失焦
            evt.stopPropagation()
          }}
          onClick={(evt) => {
            // 阻止冒泡，避免触发节点选中
            evt.stopPropagation()
            saveEdit()
          }}
        />
        <IconButton
          active
          icon={<CloseOutlined />}
          onBlur={(e) => {
            // 避免冒泡到 tree 失焦
            e.stopPropagation()
          }}
          tabIndex={-1}
          onClick={(evt) => {
            // 阻止冒泡，避免触发节点选中
            evt.stopPropagation()

            cancelEdit()
          }}
        />
      </span>
    </div>
  )
}

interface EditableNodeInputProps extends EditableTreeNodeTitleProps {
  prefixCls: string
  placeholder?: string
  node: FlattedTreeNodeData
  editingAction: UseToggleAction
}
