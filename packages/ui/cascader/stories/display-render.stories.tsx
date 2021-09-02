import React from 'react'
import Cascader from '../src'

const data = [
  {
    id: '手机',
    title: '手机t',
    children: [
      {
        id: '小米',
        title: '小米t',
        children: [
          {
            id: '小米3',
            title: '小米3t',
          },
          {
            id: '小米4',
            title: '小米4t',
          },
        ],
      },
      {
        id: '红米',
        title: '红米t',
        children: [
          {
            id: '红米3',
            title: '红米3t',
          },
          {
            id: '红米4',
            title: '红米4t',
          },
        ],
      },
    ],
  },
  {
    id: '电视',
    title: '电视t',
    children: [
      {
        id: '小米电视4A',
        title: '小米电视4At',
      },
      {
        id: '小米电视4C',
        title: '小米电视4Ct',
      },
    ],
  },
]

const getDataOnlyLastCheckable = (data: any) => {
  return data.map((item) => {
    if (item.children) {
      item.checkable = item.checkable ?? false
      item.children = getDataOnlyLastCheckable(item.children)
    }

    return item
  })
}

const dataOnlyLastCheckable = getDataOnlyLastCheckable(data)

export const DisplayRender = () => {
  console.log(dataOnlyLastCheckable)

  return (
    <>
      <h1>DisplayRender</h1>
      <div className="cascader-display-render__wrap">
        <Cascader
          placeholder="请选择品类"
          defaultValue={['手机', '红米', '红米4']}
          data={dataOnlyLastCheckable}
          displayRender={(option) => {
            const titleArr = []
            while (option.parent) {
              titleArr.push(option.title)
              option = option.parent
            }
            return titleArr.reverse().join(' | ')
          }}
        ></Cascader>
      </div>
    </>
  )
}
