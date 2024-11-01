import React from 'react'
import DatePicker from '../src'

/**
 * @title 选择确认
 * @desc 为 <code>true</code> 时，只有点击确认按钮才会触发值变化，暂不支持范围选择
 */
export const NeedConfirm = () => {
  return (
    <>
      <h1>使用确认按钮</h1>
      <div className="need-confirm__wrap">
        <h2>日期选择</h2>
        <DatePicker
          style={{ width: 240 }}
          needConfirm
          onChange={(date, dateStr) => console.log('onChange', date, dateStr)}
          onSelect={(date) => console.log('onSelect', date)}
          onConfirm={(date) => console.log('onConfirm', date)}
        />
        <h2>日期时间选择</h2>
        <DatePicker
          style={{ width: 240 }}
          defaultValue={new Date()}
          showTime
          needConfirm
          disabledHours={[2, 3, 4, 5, 6]}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(date, dateStr) => console.log('onChange', date, dateStr)}
          onSelect={(date) => console.log('onSelect', date)}
          onConfirm={(date) => console.log('onConfirm', date)}
        />
      </div>
    </>
  )
}
