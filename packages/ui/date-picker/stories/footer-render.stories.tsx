import React from 'react'
import DatePicker from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义渲染页脚
 */
export const FooterRender = () => {
  return (
    <>
      <h1>FooterRender</h1>
      <div className="date-picker-footer-render__wrap">
        <DatePicker
          style={{ width: 240 }}
          type="daterange"
          showTime
          footerRender={(sureActionContent) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Button type="secondary" appearance="link">
                自定义操作
              </Button>
              {sureActionContent}
            </div>
          )}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
        />
      </div>
    </>
  )
}
