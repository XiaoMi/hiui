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
      <div>此处展示 Popover click 触发后的内容</div>
      <div
        style={{
          color: '#4285f4',
          fontSize: '14px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
        onClick={() => {
          setClickVisible(false)
        }}
      >
        点击关闭
      </div>
    </div>
  )

  return (
    <>
      <h1>Controlled</h1>
      <div className="popover-controlled__wrap">
        <Popover
          title={<span>文字提示</span>}
          content={
            <div>
              <div>此处展示 Popover hover 触发后的内容</div>
            </div>
          }
          visible={hoverVisible}
        >
          <span>
            <Popover visible={clickVisible} title={<span>文字提示</span>} content={contentClick}>
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
