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
})
