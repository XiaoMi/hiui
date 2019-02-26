import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Collapse from '../'

const changeCallback = jest.fn(key => key)

describe('Collapse', () => {
  it('手风琴模式&不可点击状态测试成功', () => {
    const wrapper = mount(
      <Collapse
        onChange={changeCallback}
        accordion={true}
        arrow="right"
      >
        <Collapse.Panel
          disabled={true}
          header="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 2"
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 3"
        >
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
        </Collapse.Panel>
      </Collapse>
    )
    expect(wrapper.find('.collapse-item--show')).toHaveLength(0)
    wrapper.find('.collapse-item__head').at(0).simulate('click') // test disabled
    expect(wrapper.find('.collapse-item--show')).toHaveLength(0)
    wrapper.find('.collapse-item__head').at(1).simulate('click')
    expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
    wrapper.find('.collapse-item__head').at(2).simulate('click')
    expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
    expect(changeCallback.mock.results[1].value).toBe('2')
  })

  it('非手风琴模式&默认激活测试成功', () => {
    const wrapper = mount(
      <Collapse
        onChange={changeCallback}
        activeKey='2'
        arrow="left"
      >
        <Collapse.Panel
          header="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 2"
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 3"
        >
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
        </Collapse.Panel>
      </Collapse>
    )
    expect(wrapper.find('.collapse-item--show')).toHaveLength(1) // 测试默认激活
    wrapper.find('.collapse-item__head').at(0).simulate('click')
    expect(wrapper.find('.collapse-item--show')).toHaveLength(2)
    expect(changeCallback.mock.results[2].value).toEqual([ '2', '0' ])
  })
})
