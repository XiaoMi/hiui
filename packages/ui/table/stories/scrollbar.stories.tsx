import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 设置滚动条
 * @desc 解决Windows环境下滚动条样式不美观问题
 */
export const Scrollbar = () => {
  const [columns] = useState([
    {
      title: 'Name',
      dataKey: 'name',
      width: 200,
    },
    {
      title: 'Age',
      dataKey: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataKey: 'address',
      width: 200,
    },
    {
      title: 'Phone',
      dataKey: 'phone',
      width: 150,
    },
    {
      title: 'Phone2',
      dataKey: 'phone2',
      width: 150,
    },
    {
      title: 'Email',
      dataKey: 'email',
      width: 200,
    },
  ])

  const [data] = useState([
    {
      name: 'Raynor Maverick',
      age: 31,
      address: '45 Sunbeam Lane, Mistville',
      email: 'raynor.mav@maildemo.net',
      phone: '1234567890',
      phone2: '1234567890',
      key: 1,
    },
    {
      name: 'Elina Voss',
      age: 26,
      address: '83 Dewdrop Road, Rivertown',
      email: 'elina.voss@sampleinbox.cc',
      phone: '1234567890',
      phone2: '1234567890',
      key: 2,
    },
    {
      name: 'Darin Poe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'darin.poe@mockpost.io',
      phone: '1234567890',
      phone2: '1234567890',
      key: 3,
    },
    {
      name: 'John Doe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'john.doe@example.com',
      phone: '1234567890',
      phone2: '1234567890',
      key: 4,
    },
    {
      name: 'Jane Doe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jane.doe@example.com',
      phone: '1234567890',
      phone2: '1234567890',
      key: 5,
    },
    {
      name: 'Jim Beam',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jim.beam@example.com',
      phone: '1234567890',
      phone2: '1234567890',
      key: 6,
    },
    {
      name: 'Jill Bean',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jill.bean@example.com',
      phone: '1234567890',
      phone2: '1234567890',
      key: 7,
    },
  ])

  const scrollbarInnerRef = React.useRef<any>(null)
  const update = () => scrollbarInnerRef.current?.update?.()

  // 在外部滚动时更新 Scrollbar 滚动条的位置
  // 该处理是针对 scrollbarXStickToBottom 参数为 true 的情况，让滚动条始终保持在底部，详见 Scrollbar 组件文档
  React.useEffect(() => {
    document.addEventListener('scroll', update)

    return () => {
      document.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <>
      <h1>Scrollbar for Table</h1>
      <div className="table-scrollbar__wrap">
        <Table
          fixedToColumn={{ left: 'name', right: 'email' }}
          columns={columns}
          data={data}
          maxHeight={200}
          scrollbar={
            // 根据需要进行以下配置
            {
              // 保持滚动条始终可见
              keepVisible: true,
              innerRef: scrollbarInnerRef,
              // 设置滚动条的 z-index 值
              zIndex: 9,
              settings: {
                // 垂直滑动时，让横向滚动条一直显示在容器底部
                scrollbarXStickToBottom: true,
                // 横向滚动条距离底部的距离
                scrollbarXStickToBottomGap: 20,
              },
            }
          }
        />
      </div>
    </>
  )
}
