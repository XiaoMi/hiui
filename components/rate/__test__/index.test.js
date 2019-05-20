import React from 'react'
import { mount } from 'enzyme'
import Rate from '..'

let wrapper
const changeCallback = jest.fn(value => value)

describe('Rate', () => {
  afterEach(() => {
    wrapper && wrapper.unmount()
    changeCallback.mockClear()
  })

  it('basic usage', () => {
    wrapper = mount(<Rate defaultValue={3} allowHalf onChange={changeCallback} />)
    expect(wrapper.state().value).toEqual(3)
    wrapper.find('.hi-rate__star__half').at(2).simulate('click')
    expect(wrapper.state().value).toEqual(1.5)
    expect(changeCallback).toHaveBeenCalledTimes(1)
  })

  it('custom amount, disabled', () => {
    wrapper = mount(<Rate count={10} disabled defaultValue={10} />)
    expect(wrapper.find('.hi-rate__star')).toHaveLength(10)
    wrapper.find('.hi-rate__star__half').at(3).simulate('click')
    expect(wrapper.state().value).toEqual(10)
  })

  it('use emoji', () => {
    wrapper = mount(<Rate count={10} allowHalf useEmoji defaultValue={3} />)
    // count not work when use emoji
    expect(wrapper.find('.hi-rate__star')).toHaveLength(5)
    // half star not work whem use emoji
    wrapper.find('.hi-rate__star__half').at(3).simulate('click')
    expect(wrapper.state().value).toEqual(2)
  })
})
