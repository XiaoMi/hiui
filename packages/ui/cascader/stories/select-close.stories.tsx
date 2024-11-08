import React from 'react'
import Cascader from '../src'

/**
 * @title 选择后是否关闭弹窗
 * @desc 用于 changeOnSelect 模式下控制点击父节点时是否关闭弹窗
 */
export const SelectClose = () => {
  const [data] = React.useState([
    {
      id: '0',
      title: '0',
      children: [
        {
          id: '0-0',
          title: '0-0',
          children: [
            {
              id: '0-0-0',
              title: '0-0-0',
            },
            {
              id: '0-0-1',
              title: '0-0-1',
            },
            {
              id: '0-0-2',
              title: '0-0-2',
            },
          ],
        },
        {
          id: '0-1',
          title: '0-1',
          children: [
            {
              id: '0-1-0',
              title: '0-1-0',
            },
            {
              id: '0-1-1',
              title: '0-1-1',
            },
          ],
        },
        {
          id: '0-2',
          title: '0-2',
          disabled: false,
          children: [
            {
              id: '0-2-0',
              title: '0-2-0',
            },
            {
              id: '0-2-1',
              title: '0-2-1',
            },
          ],
        },
        {
          id: '0-3',
          title: '0-3',
          children: [
            {
              id: '0-3-0',
              title: '0-3-0',
            },
            {
              id: '0-3-1',
              title: '0-3-1',
            },
            {
              id: '0-3-2',
              title: '0-3-2',
            },
          ],
        },
        {
          id: '0-4',
          title: '0-4',
          children: [
            {
              id: '0-4-0',
              title: '0-4-0',
            },
            {
              id: '0-4-1',
              title: '0-4-1',
            },
          ],
        },
        {
          id: '0-5',
          title: '0-5',
          children: [
            {
              id: '0-5-0',
              title: '0-5-0',
            },
            {
              id: '0-5-1',
              title: '0-5-1',
            },
          ],
        },
      ],
    },
    {
      id: '1',
      title: '1',
      children: [
        {
          id: '1-0',
          title: '1-0',
          disabledCheckbox: true,
        },
        {
          id: '1-1',
          title: '1-1',
        },
      ],
    },
  ])

  return (
    <>
      <h1>SelectClose</h1>
      <div className="cascader-select-close__wrap">
        <Cascader
          style={{ width: 240 }}
          placeholder="请选择品类"
          changeOnSelect
          closeOnSelect={false}
          // expandTrigger="hover"
          searchPlaceholder="请输入搜索内容"
          data={data}
          onChange={console.log}
        />
      </div>
    </>
  )
}
