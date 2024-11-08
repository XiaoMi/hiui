import React from 'react'
import Tree, { useTreeAction } from '../src'
import Space from '@hi-ui/space'
import PopConfirm from '@hi-ui/pop-confirm'
import { PlusOutlined, DuplicateOutlined, EditOutlined, DeleteOutlined } from '@hi-ui/icons'

/**
 * @title 自定义编辑项
 * @desc 用于编辑树操作菜单显示在外面的场景
 */
export const ActionRender = () => {
  const ActionTree = useTreeAction(Tree)

  return (
    <>
      <h1>ActionRender for Tree</h1>
      <div className="tree-action-render__wrap">
        <ActionTree
          expandOnSelect
          editPlaceholder="请填写菜单"
          actionRender={(node, editActions) => {
            console.log('node', node)

            const { id } = node

            return id === 11 ? (
              <Space>
                <PlusOutlined onClick={() => editActions.addChildNode(1)} />
                <DuplicateOutlined onClick={() => editActions.addSiblingNode()} />
                <EditOutlined onClick={() => editActions.editNode()} />
                <PopConfirm
                  title={'确认删除该节点？'}
                  onConfirm={editActions.deleteNode}
                  onClose={editActions.closeMenu}
                >
                  <DeleteOutlined onClick={() => editActions.openMenu()} />
                </PopConfirm>
              </Space>
            ) : null
          }}
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
        />
      </div>
    </>
  )
}
