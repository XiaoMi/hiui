import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import sinon, { fake } from 'sinon'
import simulant from 'simulant'
import Dropdown from '../index'
import Button from '../../button'

const datas = [{
  title: '移动'
}, {
  title: '复制'
}, {
  title: '删除'
}]
/* eslint-env jest */
describe('Counter', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })
  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      // const wrapper = mount(<Dropdown />)

      // wrappered by Provider
      // expect(wrapper.instance()).toBeInstanceOf(Button)

      // expect(wrapper.find('input')).toHaveLength(1)
    })
  })

  describe('PropTypes', () => {
    // it('title', () => {
    //   const wrapper = mount(
    //     <Dropdown title='其它操作' />
    //   )
    //   expect(wrapper.find('.hi-dropdown__title-text').first().text()).toEqual('其它操作')
    // })
    // it('type', () => {
    //   const types = ['text', 'button', 'group']
    //   const title = '操作'
    //   const wrapper = mount(
    //     <div>
    //       {types.map((type, index) => <Dropdown type={type} key={index} title={title} />)}
    //     </div>
    //   )

    //   expect(wrapper.find('.hi-dropdown').at(0).childAt(0).contains(
    //     <div className='hi-dropdown__title'>
    //       <span className='hi-dropdown__title-text'>{title}</span>
    //       <i className='hi-icon icon-down' />
    //     </div>
    //   )).toBeTruthy()
    //   expect(wrapper.find('.hi-dropdown').at(1).childAt(0).contains(<Button type='default'>{title} &nbsp;<i className='hi-icon icon-down' /></Button>)).toBeTruthy()
    //   expect(wrapper.find('.hi-dropdown').at(2).childAt(0).matchesElement(
    //     <div className='hi-dropdown__button-group'>
    //       <Button type='default' >{title}</Button>
    //       <Button type='default' ><i className='hi-icon icon-down' /></Button>
    //     </div>
    //   )).toBeTruthy()
    // })

    // it('prefix&suffix', () => {
    //   const wrapper = mount(
    //     <Dropdown title='其它操作' data={datas} prefix='...' suffix='-' trigger='click' />
    //   )
    //   wrapper.find('.hi-dropdown').getDOMNode().click()
    //   expect(document.querySelectorAll('.hi-dropdown__item-prefix')[0].innerHTML).toEqual('...')
    //   expect(document.querySelectorAll('.hi-dropdown__item-suffix')[0].innerHTML).toEqual('-')
    //   wrapper.unmount()
    // })
    it('trigger', () => {
      const wrapper = mount(
        <Dropdown title='其它操作' data={datas} trigger='contextmenu' />
      )
      simulant.fire(wrapper.find('.hi-dropdown').getDOMNode(), 'contextmenu', { button: 2, which: 3 })
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(1)
      simulant.fire(wrapper.find('.hi-dropdown').getDOMNode(), 'contextmenu', { button: 2 })
      expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
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
