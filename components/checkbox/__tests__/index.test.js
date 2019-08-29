import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Checkbox from '../index'

const list = ['手机', '电脑', '智能']
describe('Checkbox', () => {
  it('normal', () => {
    const wrapper = mount(
      <div>
        <Checkbox>Checkbox1</Checkbox>
        <Checkbox>Checkbox2</Checkbox>
      </div>
    )
    expect(wrapper.find('.hi-checkbox')).toHaveLength(2)
  })

  describe('PropTypes', () => {
    it('defaultChecked', () => {
      const wrapper = mount(
        <div>
          <Checkbox defaultChecked>Checkbox</Checkbox>
        </div>
      )
      const inputEl = wrapper.find('input')
      expect(inputEl).toHaveLength(1)
      expect(inputEl.prop('checked')).toBeTruthy()
      expect(wrapper.find('.hi-checkbox__input--checked')).toHaveLength(1)
    })

    it('autoFocus', () => {
      const wrapper = mount(
        <div>
          <Checkbox autoFocus>Checkbox</Checkbox>
        </div>
      )
      const inputEl = wrapper.find('input:focus')
      expect(inputEl).toHaveLength(1)
    })

    it('checked', () => {
      const wrapper = mount(
        <Checkbox checked={true}>Checkbox</Checkbox>
      )
      const inputEl = wrapper.find('input')
      console.log(inputEl.debug())
      expect(inputEl).toHaveLength(1)
      expect(inputEl.prop('checked')).toBeTruthy()
      expect(wrapper.find('.hi-checkbox__input--checked')).toHaveLength(1)
      wrapper.setProps({checked: false})
      expect(inputEl).toHaveLength(1)
      expect(inputEl.prop('checked')).toBeTruthy()
      expect(wrapper.find('.hi-checkbox__input--checked')).toHaveLength(0)
    })

    it('className', () => {
      const wrapper = shallow(
        <Checkbox className='customer'>Checkbox</Checkbox>
      )
      expect(wrapper.find('.customer')).toHaveLength(1)
    })

    it('disabled', () => {
      const wrapper = mount(
        <Checkbox disabled={true}>Checkbox</Checkbox>
      )
      expect(wrapper.find('label').hasClass('hi-checkbox--disabled')).toBeTruthy()
      expect(wrapper.find('input').prop('disabled')).toBeTruthy()

      wrapper.setProps({disabled: false})
      expect(wrapper.find('label').hasClass('hi-checkbox--disabled')).toBeFalsy()
      expect(wrapper.find('input').prop('disabled')).toBeFalsy()
    })

    it('indeterminate', () => {
      const wrapper = mount(
        <Checkbox indeterminate checked={false}>Checkbox</Checkbox>
      )
      expect(wrapper.find('.hi-checkbox__input--indeterminate')).toHaveLength(1)
      wrapper.setProps({indeterminate: false})
      expect(wrapper.find('.hi-checkbox__input--indeterminate')).toHaveLength(0)
    })

    it('onChange', () => {
      const callback = fake()
      const wrapper = mount(
        <Checkbox onChange={callback} />
      )

      wrapper.find('input').simulate('change')
      expect(callback.callCount).toEqual(1)
      wrapper.find('label').simulate('change')
      expect(callback.callCount).toEqual(1)
    })
  })
  // it('onClick', () => {
  //   const callback = fake()
  //   const wrapper = mount(
  //     <div>
  //       <Breadcrumb onClick={callback} data={data} />
  //       <Breadcrumb data={data} />
  //     </div>
  //   )

  //   wrapper.find('.hi-breadcrumb__content').at(0).simulate('click')
  //   wrapper.find('.hi-breadcrumb__content').at(5).simulate('click')
  //   expect(callback.callCount).toEqual(1)
  // })
})

describe('Checkbox.Goup', () => {
  it('normal', () => {
    const wrapper = mount(
      <Checkbox.Group data={list} />
    )
    expect(wrapper.find('.hi-checkbox')).toHaveLength(3)

    // TODO: BUG
    // wrapper.setProps({data: ['手机', '电脑']})
    // expect(wrapper.find('.hi-checkbox')).toHaveLength(2)
  })
})
