import React from 'react'
import Tree from '../src'
import { TreeNodeData } from '../src/TreeNode'
import { cx } from '@hi-ui/classname'

export const Editable = () => {
  // const [expandedIds, setExpandedIds] = React.useState([])
  const treeRef = React.useRef(null)

  const CustomTreeNodeTitle = (node: TreeNodeData) => {
    const {
      // TODO: 这些方法与树内部无关，纯粹是对 结构化 treeData 的增删改查，应该以工具方法的形式对外暴露
      $saveNode: onSave,
      $deleteNode: onDelete,
      $addChildNode: addChildNode,
      $addSiblingNode: addSiblingNode,
    } = treeRef.current || {}
    // const { onSave, onCancel, onDelete, addChildNode, addSiblingNode } = useTreeContext()

    const [editing, setEditing] = React.useState(() => {
      return node.type === 'add' || false
    })

    const [inputValue, setInputValue] = React.useState('')

    if (editing) {
      return (
        <div>
          <input
            style={{ width: 240, marginRight: 20 }}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
          />
          <span
            className={cx('save-btn', !inputValue && 'save-btn-disabled')}
            onClick={() => {
              if (!inputValue) return

              onSave?.({ ...node, title: inputValue })
              setEditing(false)
            }}
          >
            确认
          </span>
          <span
            style={{ cursor: 'pointer', color: '#999' }}
            onClick={() => {
              setEditing(false)
              // onCancel?.(node)
            }}
          >
            取消
          </span>
        </div>
      )
    }

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span>{node.title}</span>
        </div>
        {/* 自定义 title 的后缀 icon */}
        <div>
          {/* 编辑节点 */}
          <span
            style={{ marginLeft: 12 }}
            onClick={() => {
              setEditing(true)
            }}
          >
            edit
          </span>
          {/* 添加兄弟节点 */}
          <span
            style={{ marginLeft: 12 }}
            onClick={() => {
              addSiblingNode(node)
            }}
          >
            addSibling
          </span>
          {/* 添加子节点 */}
          <span
            style={{ marginLeft: 12 }}
            onClick={() => {
              addChildNode(node)
              // 展开子节点列表
              // setExpandedIds((prev) => Array.from(new Set(prev.concat(node.id))))
            }}
          >
            addChild
          </span>

          {/* 删除当前子节点 */}
          <span
            style={{ marginLeft: 12 }}
            onClick={() => {
              onDelete(node)
            }}
          >
            delete
          </span>
        </div>
      </div>
    )
  }

  return (
    <>
      <h1>Editable for Tree</h1>
      <div className="tree-basic__wrap">
        <Tree
          ref={treeRef}
          // expandedIds={expandedIds}
          // onExpand={setExpandedIds}
          titleRender={CustomTreeNodeTitle}
          data={[
            {
              id: 1,
              title: '小米',
              children: [
                {
                  id: 2,
                  title: '研发',
                  children: [
                    { id: 3, title: '后端' },
                    { id: 4, title: '运维' },
                    { id: 5, title: '前端' },
                  ],
                },
                { id: 6, title: '产品' },
              ],
            },
            {
              id: 11,
              title: '大米',
              children: [
                { id: 22, title: '可视化' },
                { id: 66, title: 'HiUI' },
              ],
            },
          ]}
        ></Tree>
      </div>
    </>
  )
}
