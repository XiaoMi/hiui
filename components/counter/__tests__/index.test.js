import React from 'react'
import { mount } from 'enzyme'
import Counter from '../index'
/* eslint-env jest */
describe('Counter', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('should init with defaultValue', () => {
    const wrapper = mount(<Counter defaultValue={10} />)
    expect(wrapper.find('input').prop('value')).toEqual(10)
    wrapper.unmount()
  })
  it('should controlled by value', () => {
    const wrapper = mount(<Counter defaultValue={10} value={5} step={5} />)
    expect(wrapper.find('input').prop('value')).toEqual(5)
    wrapper.setProps({ value: 10 })
    expect(wrapper.find('input').prop('value')).toEqual(10)
    wrapper.find(`.hi-counter-plus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual(10)
    wrapper.unmount()
  })

  it('should change by step', () => {
    const wrapper = mount(<Counter defaultValue={10} step={2} />)
    wrapper.find(`.hi-counter-minus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual('8')
    wrapper.find(`.hi-counter-plus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual('10')
    wrapper.setProps({ step: -2 })
    wrapper.find(`.hi-counter-minus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual('12')
    wrapper.find(`.hi-counter-plus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual('10')
    wrapper.unmount()
  })

  it('should show in boundary', () => {
    const wrapper = mount(<Counter defaultValue={4} step={5} max={8} min={3} />)
    wrapper.find(`.hi-counter-minus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual(3)
    wrapper.find(`.hi-counter-minus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual(3)
    wrapper.setProps({ step: 6 })
    wrapper.find(`.hi-counter-plus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual(8)
    wrapper.find(`.hi-counter-plus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual(8)
    wrapper.setProps({ step: -12 })
    wrapper.find(`.hi-counter-plus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual(3)
    wrapper.find(`.hi-counter-minus`).simulate('click')
    expect(wrapper.find('input').prop('value')).toEqual(8)
    wrapper.unmount()
  })
  it('should handle input change and blur', () => {
    const wrapper = mount(<Counter defaultValue={4} step={5} max={8} min={3} />)
    wrapper.find('input').simulate('change', { target: { value: 12 } })
    expect(wrapper.find('input').prop('value')).toEqual(12)
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').prop('value')).toEqual(8)
    wrapper.unmount()
  })
  it('should handle NaN', () => {
    const wrapper = mount(<Counter defaultValue={NaN} step={5} max={8} min={3} />)
    wrapper.find('input').simulate('change', { target: { value: 'null' } })
    expect(wrapper.find('input').prop('value')).toEqual('null')
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').prop('value')).toEqual(3)
    wrapper.unmount()
  })

  it('should invoke counter onChange', () => {
    const cb = jest.fn()
    const wrapper = mount(<Counter defaultValue={4} step={1} max={8} min={3} onChange={cb} />)
    wrapper.find(`.hi-counter-minus`).simulate('click')
    jest.runAllTimers()
    expect(cb).toHaveBeenCalled()
    wrapper.unmount()
  })
})
