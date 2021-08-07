import React, { useState, useCallback, useMemo, useRef, forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { TreeProps } from './Tree'
import { FlattedTreeNodeData } from './types'
import { useEdit, useCache, useExpandProps } from './hooks'
import { flattenTreeData } from './utils'
import Input from '@hi-ui/input'
import { useDeepEqualDeps as useDeep } from '@hi-ui/use-deep-equal-deps'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useToggle } from '@hi-ui/use-toggle'

import { usePopper } from 'react-popper'
import { CheckOutlined, CloseOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'

import './styles/editable-tree.scss'
import { defaultActionIcon } from './icons/index'
import { __DEV__ } from '@hi-ui/env'
import { CSSTransition } from 'react-transition-group'

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
    ...nativeTreeProps
  } = props
  const [treeData, setTreeData] = useCache(data)
  const flattedData = useMemo(() => flattenTreeData(treeData), [useDeep(treeData)])

  // 拦截 expand：用于添加子节点时自动展开当前节点
  // 但是对外仍然暴露 expand 相关 props 原有的功能
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
    ...nativeTreeProps,
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

const EditableTreeNodeTitle = (props: any) => {
  const { prefixCls = _prefix, node } = props

  // 如果是添加的节点，进入节点编辑临时态
  const [editing, setEditing] = useState(() => node.raw.type === 'add' || false)

  if (editing) {
    return <EditableNodeInput prefixCls={prefixCls} {...props} setEditing={setEditing} />
  }

  return (
    <div className={`${prefixCls}__title`}>
      <span className="title__text">{node.title}</span>
      <ActionMenuPopper prefixCls={prefixCls} {...props} setEditing={setEditing} />
    </div>
  )
}

export const ActionMenuPopper = (props: any) => {
  const {
    prefixCls = _prefix,
    node,
    setEditing,
    onDelete,
    addChildNode,
    addSiblingNode,
    onExpand,
  } = props

  const [visible, setVisible] = useState(false)

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
  useOutsideClick(containerRef, () => setVisible(false))

  const contextMenus = [
    {
      title: '添加节点',
      onClick: () => {
        addSiblingNode(node)
        setVisible(false)
      },
    },
    {
      title: '添加子节点',
      onClick: () => {
        addChildNode(node)
        // 展开子节点列表
        // TODO: 动画丢失，动画触发来源有多个，如何将展开收起和动画触发解耦
        onExpand((prev: any) => Array.from(new Set(prev.concat(node.id))))
        setVisible(false)
      },
    },
    {
      title: '编辑',
      onClick: () => {
        setEditing(true)
        setVisible(false)
      },
    },
    {
      title: '删除',
      onClick: () => {
        open()
        setVisible(false)
      },
    },
  ]

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <IconButton
        ref={useMergeRefs(setTargetElRef, setTargetEl)}
        icon={defaultActionIcon}
        prefixCls={prefixCls}
        onClick={() => {
          setVisible((prev) => !prev)
        }}
      />
      {/* <CSSTransition in={visible} timeout={300} classNames={'hi-popper_transition'} unmountOnExit> */}
      {visible ? (
        <div ref={popperElRef} style={{ ...styles.popper, zIndex: 1 }} {...attributes.popper}>
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

export const EditableNodeInput = (props: any) => {
  const { prefixCls = _prefix, node, onSave, onCancel, setEditing } = props
  const [inputValue, setInputValue] = useState(node.title || '')

  return (
    <div className={cx(`${prefixCls}__title`, `${prefixCls}__title--editing`)}>
      <Input
        // TODO: 不能限定是“节点”这种东西，需要由用户去配置
        placeholder="节点名称"
        autoFocus
        style={{ flex: 1 }}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
        }}
      />
      <span className={`${prefixCls}__action`}>
        <IconButton
          active={!!inputValue}
          prefixCls={prefixCls}
          icon={<CheckOutlined />}
          onClick={() => {
            if (!inputValue) return

            onSave?.({ ...node, title: inputValue })
            setEditing(false)
          }}
        />
        <IconButton
          active
          prefixCls={prefixCls}
          icon={<CloseOutlined />}
          onClick={() => {
            setEditing(false)
            onCancel?.(node)
          }}
        />
      </span>
    </div>
  )
}

// TODO: 抽离到 button，拆分出一个子组件，专门用于把 icon 当按钮的场景
const IconButton = forwardRef<HTMLButtonElement | null, IconButtonProps>(
  ({ prefixCls, icon, className, onClick, active = false }, ref) => {
    return (
      <button
        ref={ref}
        className={cx(`${prefixCls}-icon-button`, active && 'active', className)}
        onClick={onClick}
      >
        {icon}
      </button>
    )
  }
)

if (__DEV__) {
  IconButton.displayName = 'IconButton'
}

interface IconButtonProps {
  icon: React.ReactNode
  prefixCls?: string
  className?: string
  onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void
  active?: boolean
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
    <div ref={popperElRef} style={{ ...styles.popper, zIndex: 1 }} {...attributes.popper}>
      <div ref={arrowElRef} style={styles.arrow}>
        <div className={`${prefixCls}-modal-arrow`}></div>
      </div>
      <div className={`${prefixCls}-modal`}>
        <section className={`${prefixCls}-modal__body`}>{content}</section>
        <footer className={`${prefixCls}-modal__footer`}>
          <Button
            className={`${prefixCls}-modal__btn--cancel`}
            type="line"
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
