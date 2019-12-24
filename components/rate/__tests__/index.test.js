import React from 'react'
import { mount } from 'enzyme'
import Rate from '../Rate'

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
  it('handle click', () => {
    wrapper = mount(<Rate defaultValue={3} clearable onChange={changeCallback} />)
    expect(wrapper.state().value).toEqual(3)
    wrapper.find('.hi-rate__star__half').at(2).simulate('click')
    expect(wrapper.state().value).toEqual(2)
    wrapper.find('.hi-rate__star__half').at(2).simulate('click')
    expect(wrapper.state().value).toEqual(0)
  })

  it('should disabled', () => {
    wrapper = mount(<Rate defaultValue={3} clearable onChange={changeCallback} disabled />)
    expect(wrapper.state().value).toEqual(3)
    wrapper.find('.hi-rate__star__half').at(2).simulate('click')
    expect(wrapper.state().value).toEqual(3)
  })

  it('handle mouse events', () => {
    wrapper = mount(<Rate defaultValue={3} allowHalf clearable onChange={changeCallback} />)
    wrapper.find('.hi-rate__star__half').at(2).simulate('mouseenter')
    expect(wrapper.state().hoverValue).toEqual(1.5)
    wrapper.find('.hi-rate__star__half').at(3).simulate('mousemove')
    expect(wrapper.state().hoverValue).toEqual(2)
    wrapper.find('.hi-rate__star__half').at(2).simulate('mousemove')
    expect(wrapper.state().hoverValue).toEqual(1.5)
    wrapper.find('.hi-rate__star__half').at(3).simulate('mouseenter')
    expect(wrapper.state().hoverValue).toEqual(2)
    wrapper.setProps({ disabled: true })
    wrapper.find('.hi-rate__star__half').at(2).simulate('mousemove')
    expect(wrapper.state().hoverValue).toEqual(2)
    wrapper.find('ul').simulate('mouseleave')
    expect(wrapper.state().hoverValue).toEqual(2)
    wrapper.setProps({ disabled: false })
    wrapper.find('ul').simulate('mouseleave')
    expect(wrapper.state().hoverValue).toEqual(0)
  })

  it('controlled by value', () => {
    wrapper = mount(
      <Rate defaultValue={3} value={4} disabled clearable onChange={changeCallback} />
    )
    expect(wrapper.state().value).toEqual(4)
    // wrapper.setProps({ disabled: true })
    wrapper.find('.hi-rate__star__half').at(6).simulate('mouseenter')
    expect(wrapper.state().value).toEqual(4)
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
    wrapper.find('.hi-rate__star__half').at(1).simulate('click')
    expect(wrapper.state().value).toEqual(1)
    wrapper.find('.hi-rate__star__half').at(7).simulate('click')
    expect(wrapper.state().value).toEqual(4)
    wrapper.find('.hi-rate__star__half').at(9).simulate('click')
    expect(wrapper.state().value).toEqual(5)
  })
})
