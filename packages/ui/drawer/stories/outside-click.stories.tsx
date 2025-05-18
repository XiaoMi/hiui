import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'
import Tree, { TreeDataItem } from '@hi-ui/tree'

/**
 * @title 点击外部事件处理
 * @desc 常用于无蒙层模式下，切换列表项详情内容
 */
export const OutsideClick = () => {
  const [visible, setVisible] = React.useState(false)
  const [data] = React.useState([
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
  ])
  const [currentData, setCurrentData] = React.useState<TreeDataItem>()
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <>
      <h1>OutsideClick</h1>
      <div className="drawer-outside-click__wrap">
        <div className="list-wrapper" ref={wrapperRef}>
          <Tree
            data={data}
            onSelect={(id, node) => {
              // console.log('node', node)

              if (id) {
                setVisible(true)
                setCurrentData(node?.raw)
              } else {
                setVisible(false)
              }
            }}
          />
        </div>
        <Drawer
          title={currentData?.title}
          visible={visible}
          showMask={false}
          onClose={() => setVisible(false)}
          // 点击列表外部内容时关闭抽屉
          onOutsideClick={(e) => {
            // console.log('target', e.target)

            console.log('dom', wrapperRef.current?.contains(e.target as Element))
            if (!wrapperRef.current?.contains(e.target as Element)) {
              setVisible(false)
            }
          }}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button type="default" appearance="line" key={1} onClick={() => console.log(2)}>
                取消
              </Button>
              <Button type="primary" key={0} onClick={() => console.log(1)}>
                确认
              </Button>
            </div>
          }
        >
          {currentData?.title}
        </Drawer>
      </div>
    </>
  )
}
