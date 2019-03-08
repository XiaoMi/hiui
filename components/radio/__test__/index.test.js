import React from 'react'
import { mount } from 'enzyme'
import Radio from '../'

let wrapper
const changeCallback = jest.fn(value => value)
const products = [{
  name: '红米手机',
  id: 1
}, {
  name: 'mix3',
  id: 2
}, {
  name: '扫地机器人',
  id: 3
}, {
  name: '新风机',
  id: 4
}]

describe('Radio', () => {
  afterEach(() => {
    wrapper && wrapper.unmount()
    changeCallback.mockClear()
  })

  it('基础用法', () => {
    wrapper = mount(
      <Radio
        list={products}
        onChange={changeCallback}
        checked={1}
        disabled={3}
      />
    )
    // 默认选中
    expect(wrapper.state().checked).toEqual(1)

    // 禁止选项不可点
    wrapper.find('.hi-radio__item').at(3).simulate('click')
    expect(changeCallback).toHaveBeenCalledTimes(0)
    expect(wrapper.state().checked).toEqual(1)

    // 选中第一项
    wrapper.find('.hi-radio__item').at(0).simulate('click')
    expect(changeCallback).toHaveBeenCalledTimes(1)
    expect(wrapper.state().checked).toEqual(0)
  })

  it('垂直布局', () => {
    wrapper = mount(
      <Radio
        list={products}
        onChange={changeCallback}
        layout='vertical'
      />
    )

    expect(wrapper.find('.hi-radio').hasClass('hi-radio--vertical')).toBeTruthy()
    // 无默认选择项
    expect(wrapper.find('.hi-radio__item--checked')).toHaveLength(0)
    // 选中第一项
    wrapper.find('.hi-radio__item').at(0).simulate('click')
    expect(changeCallback).toHaveBeenCalledTimes(1)
    expect(wrapper.state().checked).toEqual(0)
  })

  it('按钮模式', () => {
    wrapper = mount(
      <Radio
        list={products}
        onChange={changeCallback}
        mode='button'
      />
    )

    expect(wrapper.find('.hi-radio').hasClass('hi-radio--button')).toBeTruthy()
    // 无默认选择项
    expect(wrapper.find('.hi-radio__item--checked')).toHaveLength(0)
    // 选中第一项
    wrapper.find('.hi-radio__item').at(0).simulate('click')
    expect(changeCallback).toHaveBeenCalledTimes(1)
    expect(wrapper.state().checked).toEqual(0)
  })
})
