import React from 'react'
import { mount } from 'enzyme'
import sinon, { spy, stub } from 'sinon'
import Popover from '../'
import Button from '../../button'

const title = <span>Popover Title</span>
const content = (
  <div>
    <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
  </div>
)
const topClickTarget = mount(
  <div>
    <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="top" trigger="click">
      <Button type="line">Top & click触发</Button>
    </Popover>
  </div>
)
const hoverClickTarget = mount(
  <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="top" trigger="hover">
          <Button type="success">Right & hover触发</Button>
    </Popover>
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
function getUserData() {
  return new Promise(resolve => {
    // 一秒后异步成功，返回一个 'ok'
    setTimeout(() => resolve('ok'), 200)
  })
}
function timerGame(callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log('Times up -- stop!');
    return callback && callback(()=>{
      expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(3)
    });
  }, 200);
}
function timerGame2(callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log('Times up -- stop!');
    return callback && callback();
  }, 200);
}

describe('Tooltip', () => {
  
  it('触发方式测试通过', (done) => {
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(0)
    
    topClickTarget.find('button').getDOMNode().click();
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(1)

    topClickTarget.find('button').getDOMNode().click();
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)

    focusRightTarget.find('button').getDOMNode().focus()
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(2)
    focusRightTarget.find('button').getDOMNode().blur() 
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(2)
    expect(hoverClickTarget.find('button')).toHaveLength(1)

    hoverClickTarget.find('button').getDOMNode().click()
    setTimeout(() => {
      expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(3)
      done()
    }, 500);
    // hoverClickTarget.find('button').simulate('mouseleave')
    
  })

  it('显示的位置测试通过', () => {
    topClickTarget.find('button').getDOMNode().click()
    leftTarget.find('button').getDOMNode().click()
    bottomTarget.find('button').getDOMNode().click()

    expect(document.querySelectorAll('.hi-popper__content--top')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__content--right')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__content--left')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__content--bottom')).toHaveLength(1)
  })
})
