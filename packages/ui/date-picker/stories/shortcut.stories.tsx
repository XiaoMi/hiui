import React from 'react'
import DatePicker from '../src'

/**
 * @title 带快捷选项
 * @desc 将常用的日期或时间提炼成快捷项，节省操作成本
 */
export const Shortcut = () => {
  return (
    <>
      <h1>带快捷选项</h1>
      <div className="shortcut__wrap">
        <h2>内置</h2>
        <DatePicker
          style={{ width: 565 }}
          type="daterange"
          shortcuts={['近一周', '近一月', '近三月', '近一年']}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>自定义选择范围</h2>
        <DatePicker
          style={{ width: 565 }}
          type="daterange"
          shortcuts={[
            {
              title: '近十天',
              range: [new Date().getTime() - 10 * 86400000, new Date()],
            },
            {
              title: '近二十天',
              range: [new Date().getTime() - 20 * 86400000, new Date()],
            },
            {
              title: '近三十天',
              range: [new Date().getTime() - 30 * 86400000, new Date()],
            },
          ]}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
