import React from 'react'
import { mount } from 'enzyme'
import Counter from '../'

const changeCallback = jest.fn(val => val)

describe('Counter', () => {
  it('基础操作', () => {
    const wrapper = mount(
      <Counter
        value='4'
        step='1'
        min='-10'
        max='10'
        onChange={changeCallback}
      />
    )

    expect(wrapper.find('input').props().value).toEqual('4')

    wrapper.find('.hi-counter-plus').simulate('click') // +1
    expect(wrapper.find('input').props().value).toEqual('5')

    wrapper.find('.hi-counter-minus').simulate('click') // -1
    expect(wrapper.find('input').props().value).toEqual('4')

    wrapper.find('input').simulate('change', { target: { value: '100' } }) // 测试超过最大值
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').props().value).toEqual('10')
    expect(wrapper.find('.hi-counter-plus').hasClass('disabled')).toEqual(true) // 已达到最大值时+不可点击

    wrapper.find('input').simulate('change', { target: { value: '-100' } }) // 测试超过最小值
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').props().value).toEqual('-10')
    expect(wrapper.find('.hi-counter-minus').hasClass('disabled')).toEqual(true) // 已达到最小值时-不可点击
  })
})
