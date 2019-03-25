import React from 'react'
import { mount } from 'enzyme'
import Popover from '../'
import Button from '../../button'

const topClickTarget = mount(
  <div>
    <Popover title='popover title' content='popover content' style={{margin: '10px 10px'}} placement="top" trigger="click">
      <Button type="line">Top & click触发</Button>
    </Popover>
  </div>
)
const focusRightTarget = mount(
  <div>
    <Popover title='popover title' content='popover content' style={{margin: '10px 10px'}} placement="right" trigger="focus">
      <Button type="success">Right & focus触发</Button>
    </Popover>
  </div>
)
const leftTarget = mount(
  <Popover title='popover title' content='popover content' placement="left" trigger="click">
    <Button type="line">left</Button>
  </Popover>
)
const bottomTarget = mount(
  <Popover title='popover title' content='popover content' placement="bottom" trigger="click">
    <Button type="line">bottom</Button>
  </Popover>
)

describe('Tooltip', () => {
  it('触发方式测试通过', () => {
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(0)

    topClickTarget.find('.hi-btn').getDOMNode().click()
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(1)

    focusRightTarget.find('.hi-btn').getDOMNode().focus()
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(2)
    // focusRightTarget.find('.hi-btn').simulate('mouseenter')
  })

  it('显示的位置测试通过', () => {
    topClickTarget.find('.hi-btn').getDOMNode().click()
    leftTarget.find('.hi-btn').getDOMNode().click()
    bottomTarget.find('.hi-btn').getDOMNode().click()

    expect(document.querySelectorAll('.hi-popper__content--top')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__content--right')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__content--left')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__content--bottom')).toHaveLength(1)
  })
})
