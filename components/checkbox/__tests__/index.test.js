import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Checkbox from '../index'

/* eslint-env jest */
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
        <Checkbox checked>Checkbox</Checkbox>
      )
      const inputEl = wrapper.find('input')
      expect(inputEl).toHaveLength(1)
      expect(inputEl.prop('checked')).toBeTruthy()
      expect(wrapper.find('.hi-checkbox__input--checked')).toHaveLength(1)
      wrapper.setProps({ checked: false })
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
        <Checkbox disabled>Checkbox</Checkbox>
      )
      expect(wrapper.find('label').hasClass('hi-checkbox--disabled')).toBeTruthy()
      expect(wrapper.find('input').prop('disabled')).toBeTruthy()

      wrapper.setProps({ disabled: false })
      expect(wrapper.find('label').hasClass('hi-checkbox--disabled')).toBeFalsy()
      expect(wrapper.find('input').prop('disabled')).toBeFalsy()
    })

    it('indeterminate', () => {
      const wrapper = mount(
        <Checkbox indeterminate checked={false}>Checkbox</Checkbox>
      )
      expect(wrapper.find('.hi-checkbox__input--indeterminate')).toHaveLength(1)
      wrapper.setProps({ indeterminate: false })
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
  it('normal1', () => {
    const wrapper = mount(
      <div>
        <Checkbox.Group data={list} />
      </div>
    )
    expect(wrapper.find('.hi-checkbox')).toHaveLength(3)

    // TODO: BUG
    // wrapper.setProps({data: ['手机', '电脑']})
    // expect(wrapper.find('.hi-checkbox')).toHaveLength(2)
  })

  it('normal2', () => {
    const wrapper = mount(
      <div>
        <Checkbox.Group data={nList} />
      </div>
    )
    expect(wrapper.find('.hi-checkbox')).toHaveLength(3)
    expect(wrapper.find('.hi-checkbox--disabled')).toHaveLength(1)
    // TODO: BUG
    // wrapper.setProps({data: ['手机', '电脑']})
    // expect(wrapper.find('.hi-checkbox')).toHaveLength(2)
  })

  it('defaultValue', () => {
    const wrapper = mount(
      <Checkbox.Group data={list} defaultValue={['手机']} />
    )
    expect(wrapper.find('.hi-checkbox__input').at(0).hasClass('hi-checkbox__input--checked')).toBeTruthy()

    wrapper.setProps({ defaultValue: ['电脑'] })
    expect(wrapper.find('.hi-checkbox__input').at(1).hasClass('hi-checkbox__input--checked')).toBeFalsy()
  })

  it('value', () => {
    const wrapper = mount(
      <Checkbox.Group data={list} value={['手机']} />
    )
    expect(wrapper.find('.hi-checkbox__input').at(0).hasClass('hi-checkbox__input--checked')).toBeTruthy()

    wrapper.setProps({ value: ['手机', '电脑'] })
    expect(wrapper.find('.hi-checkbox__input').at(0).hasClass('hi-checkbox__input--checked')).toBeTruthy()
    expect(wrapper.find('.hi-checkbox__input').at(1).hasClass('hi-checkbox__input--checked')).toBeTruthy()
  })

  it('disabled', () => {
    const wrapper = mount(
      <Checkbox.Group data={list} value={['手机']} disabled />
    )
    expect(wrapper.find('.hi-checkbox--disabled')).toHaveLength(3)
    expect(wrapper.find('input').map(node => node.prop('disabled'))).toEqual([true, true, true])

    wrapper.setProps({ disabled: false })
    expect(wrapper.find('.hi-checkbox--disabled')).toHaveLength(0)
    expect(wrapper.find('input').map(node => node.prop('disabled'))).toEqual([false, false, false])
  })

  it('name', () => {
    const wrapper = mount(
      <Checkbox.Group data={list} name='test' value={[]} />
    )
    expect(wrapper.find('input').first().prop('name')).toEqual('test')
  })

  it('onChange', () => {
    const callback = fake()
    const callback2 = fake()
    const wrapper = mount(
      <div>
        <Checkbox.Group onChange={callback} data={nList} />
        <Checkbox.Group onChange={callback2} data={nList} value={['手机']} />
      </div>
    )

    wrapper.find('input').first().simulate('change')
    expect(callback.callCount).toEqual(1)

    wrapper.find('input').at(4).simulate('change')
    expect(callback2.callCount).toEqual(1)
  })

  it('style', () => {
    const wrapper = mount(
      <Checkbox.Group data={list} style={{ width: 100 }} value={[]} />
    )
    expect(wrapper.find('.hi-checkbox-group').prop('style')).toEqual(
      expect.objectContaining({
        width: 100
      })
    )
  })

  describe('Checkbox.Goup.funs', () => {
    it('onChange', () => {
      const callback = fake()
      const wrapper = mount(
        <div>
          <Checkbox.Group onChange={callback} data={nList} value={['Phone']} />
        </div>
      )
      // wrapper.setProps({value: ['Computer']})
      wrapper.find('input').at(1).simulate('change')
      // expect(callback2.callCount).toEqual(1)
    })
  })
})
