import React from 'react'
import { mount } from 'enzyme'
import Radio from '..'
import { Button } from '../../button/Button'
/* eslint-env jest */
let wrapper
const changeCallback = jest.fn(value => value)
const list = ['手机', '电脑', '智能']
const nList = [{
  content: '手机',
  id: 'Phone',
  disabled: true
}, {
  content: '电脑',
  id: 'Computer'
}, {
  content: '智能',
  id: 'Intelli'
}]

describe('Radio', () => {
  afterAll(() => {
    wrapper && wrapper.unmount()
    changeCallback.mockClear()
  })
  describe('PropTypes', () => {

    it('data', () => {
      wrapper = mount(
        <Radio.Group
          data={list}
        />
      )
      expect(wrapper.find('.hi-radio')).toHaveLength(3)
    })
    it('placement', () => {
      wrapper = mount(
        <Radio.Group
          data={list}
          placement='vertical'
        />
      )
      expect(wrapper.find('.hi-radio-group').first().hasClass('vertical')).toBeTruthy()
    })
    it('disabled', () => {
      wrapper = mount(
        <Radio.Group
          data={nList}
          value='电脑'
        />
      )
      expect(wrapper.find('.hi-radio').at(0).hasClass('hi-radio--disabled')).toBeTruthy()
    })
    it('type', () => {
      wrapper = mount(
        <Radio.Group
          data={list}
          value='电脑'
          type='button'
        />
      )
      expect(wrapper.find(Button)).toHaveLength(3)
      expect(wrapper.find(Button).at(1).hasClass('hi-radio__button--checked')).toBeTruthy()
    })
    it('value', () => {
      wrapper = mount(
        <Radio.Group
          data={list}
          value='电脑'
        />
      )
      expect(wrapper.find('.hi-radio').at(1).find('.hi-radio__input--checked')).toHaveLength(1)
      wrapper.setProps({value: '手机'})
      expect(wrapper.find('.hi-radio').at(0).find('.hi-radio__input--checked')).toHaveLength(1)
    })
    it('defaultValue', () => {
      wrapper = mount(
        <Radio.Group
          data={list}
          defaultValue='电脑'
        />
      )
      expect(wrapper.find('.hi-radio').at(1).find('.hi-radio__input--checked')).toHaveLength(1)
      wrapper.setProps({defaultValue: '手机'})
      expect(wrapper.find('.hi-radio').at(1).find('.hi-radio__input--checked')).toHaveLength(1)
    })
    it('onChange', () => {
      const callback = jest.fn()
      wrapper = mount(
        <Radio.Group
          data={list}
          defaultValue='电脑'
          onChange={callback}
        />
      )
      wrapper.find('.hi-radio').at(0).find('input').simulate('change')
      expect(wrapper.find('.hi-radio').at(0).find('.hi-radio__input--checked')).toHaveLength(1)
      expect(callback).toHaveBeenCalledWith('手机')
    })
  })
  describe('Branches', () => {
    it('Radio.checked', () => {
      const callback = jest.fn()
      wrapper = mount(
        <Radio
          value='phone'
          onChange={callback}
        >
          手机
        </Radio>
      )
      expect(wrapper.find('.hi-radio__input').hasClass('hi-radio__input--checked')).toBeFalsy()
      wrapper.setProps({value: 'a'})
      wrapper.find('.hi-radio').find('input').simulate('change', {target: {checked: true}})
      expect(wrapper.find('.hi-radio').at(0).find('.hi-radio__input--checked')).toHaveLength(1)
    })
    it('Group.props', () => {
      wrapper = mount(
        <Radio.Group
          data={list}
        />
      )
      expect(wrapper.find('.hi-radio')).toHaveLength(3)
      wrapper.setProps({data: nList})
      expect(wrapper.find('.hi-radio')).toHaveLength(3)
    })
  })
})
