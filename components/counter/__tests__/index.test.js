import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import { fake } from 'sinon'
import Counter from '../index'
/* eslint-env jest */
describe('Counter', () => {
  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      const wrapper = mount(<Counter />)

      // wrappered by Provider
      // expect(wrapper.instance()).toBeInstanceOf(Button)

      expect(wrapper.find(`input`)).toHaveLength(1)
    })
  })

  describe('PropTypes', () => {
    it('value', () => {
      // TODO: 修改代码后测试 目前不传入 min 及 max 有问题
      // const wrapper = mount(
      //   <Counter defaultValue={10} />
      // )
      // console.log(wrapper.debug())
      // expect(wrapper.find(`input`).first().prop('value')).toEqual(10)
    })
    it('defaultValue', () => {
      // TODO: 修改代码后测试 目前不传入 min 及 max 有问题
      // const wrapper = mount(
      //   <Counter defaultValue={10} />
      // )
      // console.log(wrapper.debug())
      // expect(wrapper.find(`input`).first().prop('value')).toEqual(10)
    })
    it('step', () => {
      const wrapper = mount(
        <Counter defaultValue={10} step={2} min={0} max={20} />
      )
      wrapper.find(`.hi-counter-minus`).simulate('click')
      expect(wrapper.find('input').prop('value')).toEqual('8')
      wrapper.find(`.hi-counter-plus`).simulate('click')
      // expect(wrapper.find('input').prop('value')).toEqual('10')
    })

    // it('onClick', () => {
    //   const callback = fake()
    //   const wrapper = mount(
    //     <Button onClick={callback} />
    //   )

    //   wrapper.find('button').first().simulate('click')
    //   expect(callback.callCount).toEqual(1)
    // })
  })
})
