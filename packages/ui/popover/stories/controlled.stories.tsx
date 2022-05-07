import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

/**
 * @title 受控显隐
 * @desc 如何自定义控制创建可悬停和单击的弹出窗口
 */
export const Controlled = () => {
  const [clickVisible, setClickVisible] = React.useState(false)
  const [hoverVisible, setHoverVisible] = React.useState(false)

  const contentClick = (
    <div>
      <div>This is click content</div>
      <span
        style={{
          color: '#4285f4',
          fontSize: '12px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
        onClick={() => {
          setClickVisible(false)
        }}
      >
        Close
      </span>
    </div>
  )

  return (
    <>
      <h1>Controlled</h1>
      <div className="popover-controlled__wrap">
        <Popover
          title={<span>Popover Title</span>}
          content={
            <div>
              <p>This is hover content.</p>
            </div>
          }
          style={{ margin: '10px 10px' }}
          visible={hoverVisible}
        >
          <span>
            <Popover
              visible={clickVisible}
              title={<span>Popover Title</span>}
              content={contentClick}
            >
              <Button
                onMouseEnter={() => {
                  setHoverVisible(true)
                  setClickVisible(false)
                }}
                onMouseLeave={() => {
                  setHoverVisible(false)
                }}
                onClick={() => {
                  setHoverVisible(false)
                  setClickVisible((prev) => !prev)
                }}
              >
                Hover and click / 悬停并单击
              </Button>
            </Popover>
          </span>
        </Popover>
      </div>
    </>
  )
}
