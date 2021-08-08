import React, { useState, useCallback, useMemo, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { TreeProps } from './Tree'
import { FlattedTreeNodeData, TreeNodeType } from './types'
import { useEdit, useCache, useExpandProps } from './hooks'
import { flattenTreeData } from './utils'
import Input from '@hi-ui/input'
import { useDeepEqualDeps as useDeep } from '@hi-ui/use-deep-equal-deps'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useToggle, UseToggleAction } from '@hi-ui/use-toggle'

import { usePopper } from 'react-popper'
import { CheckOutlined, CloseOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import { IconButton } from './IconButton'
import { CSSTransition } from 'react-transition-group'
import { defaultActionIcon } from './icons'

import './styles/editable-tree.scss'

const _role = 'tree'
const _prefix = getPrefixCls(_role)

/**
 * 将 BaseTree 添加定制编辑功能，返回 EditableTree
 *
 * @param props
 * @returns
 */
export const useTreeEditProps = <T extends EditableTreeProps>(props: T) => {
  const {
    prefixCls = _prefix,
    className,
    data,
    editable = false,
    expandedIds: expandedIdsProp,
    defaultExpandedIds = [],
    onExpand,
    defaultExpandAll = false,
    titleRender,
    onBeforeSave,
    onBeforeDelete,
    onSave,
    onDelete,
    ...originalProps
  } = props
  const [treeData, setTreeData] = useCache(data)
  const flattedData = useMemo(() => flattenTreeData(treeData), [useDeep(treeData)])

  // 拦截 expand：用于添加子节点时自动展开当前节点
  // 但是对外仍然暴露 expand 及其相关 props 原有的功能
  const [expandedIds, tryToggleExpandedIds] = useExpandProps(
    flattedData,
    defaultExpandedIds,
    expandedIdsProp,
    onExpand,
    defaultExpandAll
  )

  const [saveEdit, cancelAddNode, deleteNode, addChildNode, addSiblingNode] = useEdit(
    treeData,
    setTreeData,
    onBeforeSave,
    onBeforeDelete,
    onSave,
    onDelete
  )

  const renderTitleWithEditable = useCallback(
    (node) => {
      return (
        <EditableTreeNodeTitle
          node={node}
          onSave={saveEdit}
          onCancel={cancelAddNode}
          onDelete={deleteNode}
          addChildNode={addChildNode}
          addSiblingNode={addSiblingNode}
          onExpand={tryToggleExpandedIds}
        />
      )
    },
    [saveEdit, cancelAddNode, deleteNode, addChildNode, addSiblingNode, tryToggleExpandedIds]
  )

  const proxyTitleRender = useCallback(
    (node: FlattedTreeNodeData) => {
      if (titleRender) {
        const ret = titleRender(node)
        if (ret) return ret
      }

      return editable ? renderTitleWithEditable(node) : true
    },
    [titleRender, editable, renderTitleWithEditable]
  )

  const treeProps = {
    ...originalProps,
    titleRender: proxyTitleRender,
    data: editable ? treeData : data,
    expandedIds,
    onExpand: tryToggleExpandedIds,
    className: cx(className, `${prefixCls}--editable`),
  }

  return treeProps
}

export interface EditableTreeProps extends TreeProps {
  /**
   * 开启后节点可编辑（内置：添加同级节点、添加子节点、编辑节点、删除节点）
   */
  editable?: boolean
  /**
   * 节点保存新增、编辑状态时触发，返回 false 则节点保持失败，不会触发 onSave
   */
  onBeforeSave?: (savedNode: FlattedTreeNodeData, data: any, level: number) => boolean
  /**
   * 	节点保存新增、编辑状态后触发
   */
  onSave?: (savedNode: FlattedTreeNodeData, data: FlattedTreeNodeData[]) => void
  /**
   * 节点删除前触发，返回 false 则节点删除失败，不会触发 onDelete
   */
  onBeforeDelete?: (deletedNode: FlattedTreeNodeData, data: any, level: number) => boolean
  /**
   * 节点删除后触发
   */
  onDelete?: (deletedNode: FlattedTreeNodeData, data: FlattedTreeNodeData[]) => void
}

const EditableTreeNodeTitle = (props: EditableTreeNodeTitleProps) => {
  const { prefixCls = _prefix, node } = props

  // 如果是添加节点，则进入节点编辑临时态
  const [editing, editingAction] = useToggle(() => node.raw.type === TreeNodeType.ADD || false)

  if (editing) {
    return <EditableNodeInput {...props} editingAction={editingAction} />
  }

  return (
    <div className={`${prefixCls}__title`}>
      <span className="title__text">{node.title}</span>
      <EditableNodeMenu {...props} editingAction={editingAction} />
    </div>
  )
}

interface EditableTreeNodeTitleProps {
  prefixCls: string
  node: FlattedTreeNodeData
  onCancel?: (node: FlattedTreeNodeData) => void
  /**
   * 节点保存新增、编辑状态时触发，返回 false 则节点保持失败，不会触发 onSave
   */
  onBeforeSave?: (savedNode: FlattedTreeNodeData, data: any, level: number) => boolean
  /**
   * 	节点保存新增、编辑状态后触发
   */
  onSave?: (savedNode: FlattedTreeNodeData, data: FlattedTreeNodeData[]) => void
  /**
   * 节点删除前触发，返回 false 则节点删除失败，不会触发 onDelete
   */
  onBeforeDelete?: (deletedNode: FlattedTreeNodeData, data: any, level: number) => boolean
  /**
   * 节点删除后触发
   */
  onDelete: (deletedNode: FlattedTreeNodeData) => void
}

export const EditableNodeMenu = (props: EditableNodeMenuProps) => {
  const {
    prefixCls = _prefix,
    node,
    editingAction,
    onDelete,
    addChildNode,
    addSiblingNode,
    onExpand,
  } = props

  const [menuVisible, menuVisibleAction] = useToggle(false)

  const [targetElRef, setTargetElRef] = useState<HTMLButtonElement | null>(null)
  const popperElRef = useRef<HTMLDivElement | null>(null)
  const [arrowElRef, setArrowElmRef] = useState<HTMLDivElement | null>(null)

  const { styles, attributes } = usePopper(targetElRef, popperElRef.current, {
    placement: 'bottom-start',
    modifiers: [
      {
        enabled: true,
        name: 'arrow',
        options: {
          element: arrowElRef,
        },
      },
      {
        enabled: true,
        name: 'offset',
        options: {
          offset: [4, 4],
        },
      },
    ],
  })

  const [setTargetEl, Modal, open] = useConfirmPopper({
    prefixCls,
    onConfirm: () => onDelete(node),
    content: '确定要删除当前节点 ？',
    confirmText: '确定',
    cancelText: '取消',
  })

  const containerRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(containerRef, menuVisibleAction.off)

  const contextMenus = [
    {
      title: '添加节点',
      onClick: () => {
        addSiblingNode(node)
        menuVisibleAction.off()
      },
    },
    {
      title: '添加子节点',
      onClick: () => {
        addChildNode(node)
        // 展开子节点列表
        // TODO: 动画丢失，动画触发来源有多个，如何将展开收起和动画触发解耦
        onExpand((prev: any) => Array.from(new Set(prev.concat(node.id))))
        menuVisibleAction.off()
      },
    },
    {
      title: '编辑',
      onClick: () => {
        editingAction.on()
        menuVisibleAction.off()
      },
    },
    {
      title: '删除',
      onClick: () => {
        open()
        menuVisibleAction.off()
      },
    },
  ]

  return (
    <div ref={containerRef}>
      <IconButton
        className={`${prefixCls}-action__btn`}
        ref={useMergeRefs(setTargetElRef, setTargetEl)}
        icon={defaultActionIcon}
        onClick={(evt) => {
          evt.stopPropagation()
          menuVisibleAction.not()
        }}
      />
      {/* <CSSTransition in={visible} timeout={300} classNames={'hi-popper_transition'} unmountOnExit> */}
      {menuVisible ? (
        <div ref={popperElRef} style={{ ...styles.popper }} {...attributes.popper}>
          <div ref={setArrowElmRef} style={styles.arrow} />
          <ul className={`${prefixCls}-action`}>
            {contextMenus.map(({ title, onClick }, idx) => (
              <li key={idx} className={`${prefixCls}-action__item`} onClick={onClick}>
                {title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {/* </CSSTransition> */}
      {Modal}
    </div>
  )
}

interface EditableNodeMenuProps extends EditableTreeNodeTitleProps {
  editingAction: UseToggleAction
}

/**
 * 节点编辑框
 */
export const EditableNodeInput = (props: EditableNodeInputProps) => {
  const { prefixCls = _prefix, node, onSave, onCancel, editingAction, placeholder } = props

  const [inputValue, setInputValue] = useState((node.title as string) || '')
  const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.target.value)
  }, [])

  return (
    <div className={cx(`${prefixCls}__title`, `${prefixCls}__title--editing`)}>
      <Input
        autoFocus
        style={{ flex: 1 }}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
      />
      <span className={`${prefixCls}__action`}>
        <IconButton
          active={!!inputValue}
          icon={<CheckOutlined />}
          onClick={() => {
            if (!inputValue) return
            onSave?.({ ...node, title: inputValue })
            editingAction.off()
          }}
        />
        <IconButton
          active
          icon={<CloseOutlined />}
          onClick={() => {
            editingAction.off()
            onCancel?.(node)
          }}
        />
      </span>
    </div>
  )
}

interface EditableNodeInputProps extends EditableTreeNodeTitleProps {
  prefixCls: string
  // TODO: 不能限定是“节点”这种东西，需要由用户去配置
  placeholder?: string
  node: FlattedTreeNodeData
  editingAction: UseToggleAction
  onCancel: (node: FlattedTreeNodeData) => void
  /**
   * 	节点保存新增、编辑状态后触发
   */
  onSave: (savedNode: FlattedTreeNodeData) => void
  /**
   * 节点删除后触发
   */
  onDelete: (deletedNode: FlattedTreeNodeData) => void
}

/**
 * 通用确认弹窗
 * TODO: 抽离到 Modal，拆分出一个子组件，专门用于局部弹窗确认的场景
 */
const useConfirmPopper = (props: UseConfirmPopperProps) => {
  const { prefixCls, onConfirm, content, confirmText, cancelText } = props

  const [visible, toggleAction] = useToggle()

  const [targetEl, setTargetEl] = useState<any>(null)
  const popperElRef = useRef<HTMLDivElement | null>(null)
  const arrowElRef = useRef<HTMLDivElement | null>(null)

  const { styles, attributes } = usePopper(targetEl, popperElRef.current, {
    placement: 'bottom-end',
    modifiers: [
      {
        enabled: true,
        name: 'arrow',
        options: {
          element: arrowElRef.current,
        },
      },
      {
        enabled: true,
        name: 'offset',
        options: {
          offset: [4, 4],
        },
      },
    ],
  })

  useOutsideClick(popperElRef, toggleAction.off)

  const Modal = visible ? (
    <div ref={popperElRef} style={{ ...styles.popper }} {...attributes.popper}>
      <div ref={arrowElRef} style={styles.arrow} className={`${prefixCls}-modal-arrow`} />
      <div className={`${prefixCls}-modal`}>
        <section className={`${prefixCls}-modal__body`}>{content}</section>
        <footer className={`${prefixCls}-modal__footer`}>
          <Button
            className={`${prefixCls}-modal__btn--cancel`}
            type="primary"
            appearance="line"
            onClick={toggleAction.off}
          >
            {cancelText}
          </Button>
          <Button type="primary" className={`${prefixCls}-modal__btn--confirm`} onClick={onConfirm}>
            {confirmText}
          </Button>
        </footer>
      </div>
    </div>
  ) : null

  return [setTargetEl, Modal, toggleAction.on] as const
}

interface UseConfirmPopperProps {
  prefixCls: string
  onConfirm: (evt: React.MouseEvent<Element, MouseEvent>) => void
  content: string
  confirmText: string
  cancelText: string
}
