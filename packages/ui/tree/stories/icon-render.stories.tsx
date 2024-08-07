import React from 'react'
import Tree, { useTreeAction } from '../src'
import { Modal } from '@hi-ui/modal'
import { FileOutlined, FolderOpenOutlined, FolderOutlined } from '@hi-ui/icons'

/**
 * @title 自定义 icon 渲染函数
 */
export const IconRender = () => {
  const ActionTree = useTreeAction(Tree)

  return (
    <>
      <h1>IconRender for Tree</h1>
      <div className="tree-icon-render__wrap">
        <ActionTree
          expandOnSelect
          editPlaceholder="请填写菜单"
          menuOptions={[
            {
              type: 'addChildNode',
              title: '新建子节点',
            },
            {
              type: 'addSiblingNode',
              title: '新建兄弟节点',
            },
            {
              // type: 'deleteNode',
              title: '删除当前菜单',
              onClick(node, action) {
                action.closeMenu()

                Modal.confirm({
                  title: '提示',
                  content: '确定删除吗？',
                  onConfirm: () => {
                    action.deleteNode()
                  },
                })
              },
            },
            {
              type: 'editNode',
              title: '编辑当前菜单',
            },
            {
              title: 'Hello，自定义的菜单',
              onClick(node, action) {
                console.log(node)
                action.closeMenu()
              },
            },
          ]}
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
          iconRender={(node) => {
            if (!node.children?.length) {
              return <FileOutlined />
            }

            if (node.expanded) {
              return <FolderOpenOutlined />
            } else return <FolderOutlined />
          }}
        />
      </div>
    </>
  )
}
