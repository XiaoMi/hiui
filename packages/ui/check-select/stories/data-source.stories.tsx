import React from 'react'
import CheckSelect from '../src'

/**
 * @title 异步加载搜索
 * @desc 备选项数量较大时，通过搜索选项关键词调取存储于服务端数据备选项的一个或多个
 */
export const DataSource = () => {
  const [data] = React.useState([
    {
      id: 'up-1',
      title: 'up',
    },
    {
      id: '0',
      title: '0',
    },
    {
      id: '1',
      title: '1',
    },
    {
      id: '2',
      title: '2',
    },
  ])

  return (
    <>
      <h1>DataSource</h1>
      <div className="cascader-DataSource__wrap">
        <CheckSelect
          // placeholder="请选择品类"
          // searchPlaceholder="请输入搜索内容"
          data={data}
          onChange={console.log}
          dataSource={(keyword) => {
            console.log('DataSource', keyword)
            const url =
              'https://www.fastmock.site/mock/eef9b373d82560f30585521549c4b6cb/hiui/api/list?keyword=' +
              keyword
            return fetch(url)
              .then((response) => {
                return response.json()
              })
              .then(function (res) {
                return res.list
              })
          }}
        />
      </div>
    </>
  )
}
