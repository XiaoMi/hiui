import React from 'react'
import Tree from '../src'

/**
 * @title 设置尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size for Tree</h1>
      <div className="tree-size__wrap">
        <div>
          <div>
            <h3>
              lg <small>默认</small>
            </h3>
            <Tree
              expandOnSelect
              data={[
                {
                  id: 1,
                  title: '小米',
                  children: [
                    {
                      id: 2,
                      title: '研发',
                      disabled: true,
                      children: [
                        { id: 3, title: '后端', disabled: true },
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
          <div>
            <h3>md</h3>
            <Tree
              expandOnSelect
              size="md"
              data={[
                {
                  id: 1,
                  title: '小米',
                  children: [
                    {
                      id: 2,
                      title: '研发',
                      disabled: true,
                      children: [
                        { id: 3, title: '后端', disabled: true },
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
          <div>
            <h3>sm</h3>
            <Tree
              expandOnSelect
              size="sm"
              data={[
                {
                  id: 1,
                  title: '小米',
                  children: [
                    {
                      id: 2,
                      title: '研发',
                      disabled: true,
                      children: [
                        { id: 3, title: '后端', disabled: true },
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
        </div>
      </div>
    </>
  )
}
