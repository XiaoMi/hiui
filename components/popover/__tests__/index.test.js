import React from 'react'
import { mount,shallow} from 'enzyme'
import sinon from 'sinon'

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
 
describe('Tooltip', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })
  it('trigger', () => {
    

    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(0)
    
    topClickTarget.find('button').getDOMNode().click();
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(1);
    
    document.body.click()
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
    
    focusRightTarget.find('button').getDOMNode().focus()
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(2)
    focusRightTarget.find('button').getDOMNode().blur() 
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(2)
    expect(hoverClickTarget.find('button')).toHaveLength(1)
    
    function trigger(elem, event){

      var myEvent = document.createEvent('Event')        // 初始化这个事件对象，为它提高需要的“特性”

      myEvent.initEvent(event, true, true);        //执行事件

      elem.dispatchEvent(myEvent);

    }
    trigger(hoverClickTarget.find('button').getDOMNode(), 'mouseenter')
    clock.tick(200)
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(3)
    trigger(hoverClickTarget.find('button').getDOMNode(), 'mouseleave')
    clock.tick(200)
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(3)

    trigger(hoverClickTarget.find('button').getDOMNode(), 'mouseenter')

    trigger(document.querySelectorAll('.hi-popover__popper')[1],'mouseover')

    clock.tick(200)
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(3)

    trigger(document.querySelectorAll('.hi-popover__popper')[1],'mouseout')
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(3)
  })

  it('placement', () => {
    topClickTarget.find('button').getDOMNode().click()
    leftTarget.find('button').getDOMNode().click()
    bottomTarget.find('button').getDOMNode().click()

    expect(document.querySelectorAll('.hi-popper__content--top')).toHaveLength(2)
    expect(document.querySelectorAll('.hi-popper__content--right')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__content--left')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__content--bottom')).toHaveLength(1)
  })
  it('showPopper',() => {
    // const componentDidMountSpy = spy(Popover.prototype, 'componentDidMount')
    const title = <span>Popover Title</span>
    const content = (
      <div>
        <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
      </div>
    )
    const wrapper = mount(
      <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="top" trigger="click">
          <Button type="success">Right & hover触发</Button>
      </Popover>
    )
    wrapper.find('button').getDOMNode().click();
    expect(document.querySelectorAll('.hi-popover__popper')).toHaveLength(6)
    wrapper.setState({
      showPopper:true
    })
    wrapper.find('button').getDOMNode().click()
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(3)
  })
})
