import React, { useState } from 'react'
import DatePicker from '../src'

export const Shortcut = () => {
  return (
    <>
      <h1>带快捷选项</h1>
      <div className="shortcut__wrap">
        <h2>内置</h2>
        <DatePicker
          type="daterange"
          shortcuts={['近一周', '近一月', '近三月', '近一年']}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>自定义选择范围</h2>
        <DatePicker
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
