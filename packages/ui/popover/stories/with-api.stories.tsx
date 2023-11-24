import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'

/**
 * @title API 用法
 * @desc 用于列表中的每一项
 */
export const WithApi = () => {
  const title = <span>文字提示</span>
  const content = (
    <>
      <div>
        <div>此处展示 Popover 具体内容</div>
        <div>具体内容可以自行渲染</div>
      </div>
      <div>
        <button>btn</button>
      </div>
    </>
  )

  const triggerRef = React.useRef<HTMLElement>(null)

  return (
    <>
      <h1>WithApi</h1>
      <div className="popover-basic__wrap">
        <button
          ref={triggerRef}
          onClick={() =>
            Popover.open(triggerRef.current, {
              content: <button onClick={() => Popover.close()}>my content</button>,
            })
          }
        >
          open
        </button>
        {/* <Popover title={title} content={content} trigger="click">
          <Button>trigger</Button>
        </Popover> */}
      </div>
    </>
  )
}
