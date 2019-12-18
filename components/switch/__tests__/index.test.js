import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Switch from '..'

describe('Switch', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  it('basic use', () => {
    const wrapper = renderer.create(
      <div>
        <Switch />
        <Switch content={['ON', 'OFF']} />
        <Switch checked disabled content={['开', '关']} />
      </div>
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('onchange', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <Switch onChange={onChange} />
    )
    wrapper.find('.hi-switch').simulate('click')
    expect(onChange).toBeCalled()
  })
  it("checked",()=>{
    const wrapper = mount(<Switch checked content={['开', '关']} />)
    expect(wrapper.find('.hi-switch--closed')).toHaveLength(0)
    wrapper.setProps({checked:false})
    expect(wrapper.find('.hi-switch--closed')).toHaveLength(1)
  })
  it("disabled",()=>{
    const wrapper = mount(
      <Switch checked disabled />
    )
    wrapper.find('.hi-switch').simulate('click')
    expect(wrapper.find('.hi-switch--closed')).toHaveLength(0)
  })
  it('oldProps onClick', () => {
    const wrapper = mount(
      <Switch checked onClick={() => {return false}} />
    )
    wrapper.find('.hi-switch').simulate('click')
    expect(wrapper.find('.hi-switch--closed')).toHaveLength(0)
  })
})
