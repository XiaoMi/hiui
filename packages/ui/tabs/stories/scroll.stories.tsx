import React from 'react'
import Tabs from '../src'

export const Scroll = () => {
  const [data] = React.useState(() => {
    return Array(48)
      .fill(null)
      .map((_, index) => {
        const num = index + 1
        return {
          id: num,
          title: `Tab ${num}`,
          content: `Content of Tab Panel ${num}`,
        }
      })
  })

  return (
    <>
      <h1>Scroll</h1>
      <div className="tabs-scroll__wrap">
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
