import React from 'react'
import Tree, { useTreeAction } from '../src'

export const Editable = () => {
  const ActionTree = useTreeAction(Tree)

  return (
    <>
      <h1>Editable for Tree</h1>
      <div className="tree-basic__wrap">
        <ActionTree
          {...{
            placeholder: '请填写菜单',
            menuOptions: [
              {
                type: 'addChildNode',
                title: '新建子节点',
              },
              {
                type: 'addSiblingNode',
                title: '新建兄弟节点',
              },
              {
                type: 'deleteNode',
                title: '删除当前菜单',
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
            ],
            data: [
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
            ],
          }}
        />
      </div>
    </>
  )
}
