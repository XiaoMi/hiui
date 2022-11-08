import React from 'react'
import Filter from '../src'

/**
 * @title 设置选中时的形状
 */
export const Appearance = () => {
  const [dataStore] = React.useState([
    {
      id: 1,
      title: '小米商城',
    },
    {
      id: 2,
      title: '米家有品',
    },
    {
      id: 3,
      title: '京东商城',
    },
    {
      id: 4,
      title: '天猫淘宝',
    },
    {
      id: 5,
      title: '创新渠道',
    },
    {
      id: 6,
      title: '线下KA',
    },
    {
      id: 7,
      title: '线下KA1',
    },
    {
      id: 8,
      title: '线下KA2',
    },
    {
      id: 9,
      title: '线下KA3',
    },
    {
      id: 10,
      title: '线下KA4',
    },
  ])

  const [dataColor] = React.useState([
    {
      id: 1,
      title: '深空',
    },
    {
      id: 2,
      title: '白色',
    },
    {
      id: 3,
      title: '亮黑色',
    },
    {
      id: 4,
      title: '金色',
    },
  ])

  return (
    <>
      <h1>Appearance</h1>
      <div className="filter-appearance__wrap">
        <h2>link</h2>
        <Filter
          label={['渠道']}
          appearance="link"
          defaultValue={[1]}
          data={dataStore}
          onChange={(value) => {
            console.log('value', value)
          }}
        />
        <Filter
          label={['颜色']}
          appearance="link"
          defaultValue={[1]}
          data={dataColor}
          onChange={(value) => {
            console.log('value', value)
          }}
        />
        <h2>filled</h2>
        <Filter
          label={['渠道']}
          appearance="filled"
          defaultValue={[1]}
          data={dataStore}
          onChange={(value) => {
            console.log('value', value)
          }}
        />
        <Filter
          label={['颜色']}
          appearance="filled"
          defaultValue={[1]}
          data={dataColor}
          onChange={(value) => {
            console.log('value', value)
          }}
        />
      </div>
    </>
  )
}
