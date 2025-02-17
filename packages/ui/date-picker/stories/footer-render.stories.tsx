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
        <h2>日期</h2>
        <DatePicker
          style={{ width: 240 }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
          footerRender={(action, date) => {
            console.log(action, date)

            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button type="secondary" appearance="link">
                  自定义操作
                </Button>
              </div>
            )
          }}
        />
        <h2>日期时间</h2>
        <DatePicker
          style={{ width: 240 }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          showTime
          onSelect={console.log}
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
        />
        <h2>日期范围</h2>
        <DatePicker
          type="daterange"
          style={{ width: 240 }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
          footerRender={() => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Button type="secondary" appearance="link">
                自定义操作
              </Button>
            </div>
          )}
        />
        <h2>日期时间范围</h2>
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
