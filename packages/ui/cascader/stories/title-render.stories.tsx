import React from 'react'
import Cascader from '../src'

/**
 * @title 自定义选项展示
 */
export const TitleRender = () => {
  const [data] = React.useState([
    {
      id: '1',
      title: '手机t',
      children: [
        {
          id: '1-1',
          title: '小米t',
          children: [
            {
              id: '1-1-1',
              title: '小米3t',
            },
            {
              id: '1-1-2',
              title: '小米4t',
            },
          ],
        },
        {
          id: '1-2',
          title: '红米t',
          children: [
            {
              id: '1-2-1',
              title: '红米3t',
            },
            {
              id: '1-2-2',
              title: '红米4t',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      title: '电视t',
      children: [
        {
          id: '2-1',
          title: '小米电视4At',
        },
        {
          id: '2-2',
          title: '小米电视4Ct',
        },
      ],
    },
  ])

  return (
    <>
      <h1>TitleRender</h1>
      <div className="cascader-basic__wrap" style={{ width: 240 }}>
        <Cascader
          searchable={true}
          clearable
          placeholder="请选择品类"
          defaultValue={['手机', '红米', '红米4']}
          data={data}
          render={(item, keyword) => {
            console.log(item, keyword)
            if (keyword) {
              // 自定义搜索结果展示：可以自定义控制关键词高亮，夹带 icon 等场景
              return <span>{`${keyword}: ${item.title}`}</span>
            }
            return <span>{`${item.title}(${item.id})`}</span>
          }}
          onChange={(...args) => {
            console.log('onChange', ...args)
          }}
        ></Cascader>
      </div>
    </>
  )
}
