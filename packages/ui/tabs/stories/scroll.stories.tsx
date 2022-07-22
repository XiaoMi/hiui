import React from 'react'
import Tabs from '../src'

/**
 * @title 超出滚动
 * @desc 标签数量增多展示滚动条
 */
export const Scroll = () => {
  const [data] = React.useState(() => {
    return Array(48)
      .fill(null)
      .map((_, index) => {
        const num = index + 1
        return {
          id: num,
          title: `Tab ${num}`,
          content: (
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              {`Content of Tab Panel ${num}`}
            </div>
          ),
        }
      })
  })

  return (
    <>
      <h1>Scroll</h1>
      <div className="tabs-scroll__wrap" style={{ maxWidth: 1000 }}>
        <Tabs>
          {data.map((v) => {
            return (
              <Tabs.Pane key={v.id} tabId={v.id} tabTitle={v.title}>
                {v.content}
              </Tabs.Pane>
            )
          })}
        </Tabs>
      </div>
    </>
  )
}
