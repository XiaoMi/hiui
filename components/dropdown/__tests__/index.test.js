import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import sinon, { fake, spy } from 'sinon'
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
describe('Dropdown', () => {
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
    it('title', () => {
      const wrapper = mount(
        <Dropdown title='删除' data={datas} />
      )
      wrapper.find('.hi-dropdown').getDOMNode().click()
      expect(wrapper.find('.hi-dropdown__title-text').first().text()).toEqual('删除')
      expect(document.querySelectorAll('.hi-dropdown__item--active')).toHaveLength(1)
      wrapper.unmount()
    })
    it('type', () => {
      const types = ['text', 'button', 'group']
      const title = '操作'
      const wrapper = mount(
        <div>
          {types.map((type, index) => <Dropdown type={type} key={index} title={title} />)}
        </div>
      )

      expect(wrapper.find('.hi-dropdown').at(0).childAt(0).contains(
        <div className='hi-dropdown__title'>
          <span className='hi-dropdown__title-text'>{title}</span>
          <i className='hi-icon icon-down' />
        </div>
      )).toBeTruthy()
      expect(wrapper.find('.hi-dropdown').at(1).childAt(0).contains(<Button type='default'>{title} &nbsp;<i className='hi-icon icon-down' /></Button>)).toBeTruthy()
      expect(wrapper.find('.hi-dropdown').at(2).childAt(0).matchesElement(
        <div className='hi-dropdown__button-group'>
          <Button type='default' >{title}</Button>
          <Button type='default' ><i className='hi-icon icon-down' /></Button>
        </div>
      )).toBeTruthy()
      wrapper.unmount()
    })

    it('prefix&suffix', () => {
      const wrapper = mount(
        <Dropdown title='其它操作' data={datas} prefix='...' suffix='-' trigger='click' />
      )
      wrapper.find('.hi-dropdown').getDOMNode().click()
      expect(document.querySelectorAll('.hi-dropdown__item-prefix')[0].innerHTML).toEqual('...')
      expect(document.querySelectorAll('.hi-dropdown__item-suffix')[0].innerHTML).toEqual('-')
      wrapper.unmount()
    })
    it('trigger', () => {
      const triggers = ['click', 'contextmenu']
      const wrapper = mount(
        <div>
          {
            triggers.map((tt, index) => <Dropdown key={index} title='其它操作' data={datas} trigger={tt} />)
          }
          <Dropdown title='其它操作' data={datas} trigger={[...triggers]} />
        </div>
      )
      simulant.fire(wrapper.find('.hi-dropdown').at(0).getDOMNode(), 'click', { button: 2 })
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(1)
      simulant.fire(wrapper.find('.hi-dropdown').at(0).getDOMNode(), 'click', { button: 2 })
      expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
      document.querySelectorAll('.hi-popper__container')[0].remove()

      simulant.fire(wrapper.find('.hi-dropdown').at(1).getDOMNode(), 'contextmenu', { button: 2 })
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(1)
      simulant.fire(wrapper.find('.hi-dropdown').at(1).getDOMNode(), 'contextmenu', { button: 2 })
      expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
      document.querySelectorAll('.hi-popper__container')[0].remove()

      simulant.fire(wrapper.find('.hi-dropdown').at(2).getDOMNode(), 'contextmenu', { button: 2 })
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(1)
      simulant.fire(wrapper.find('.hi-dropdown').at(2).getDOMNode(), 'click', { button: 2 })
      expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
      document.querySelectorAll('.hi-popper__container')[0].remove()
      wrapper.unmount()
    })
    it('onClick', () => {
      const callback = fake()
      const wrapper = mount(
        <div>
          <Dropdown title='其它操作' data={datas} onClick={callback} />
          <Dropdown title='其它操作' data={datas} />
        </div>
      )
      wrapper.find('.hi-dropdown').at(0).getDOMNode().click()
      wrapper.find('.hi-dropdown').at(1).getDOMNode().click()
      document.querySelectorAll('.hi-dropdown__item')[0].click()
      document.querySelectorAll('.hi-dropdown__item')[3].click()
      expect(callback.callCount).toEqual(1)
      wrapper.unmount()
    })
  })

  describe('DataItem', () => {
    const callback = spy()
    const outCallback = spy()
    const _datas = [{
      title: '同步',
      prefix: '...',
      onClick: callback
    }, {
      title: '上传',
      disabled: true
    }, {
      title: '-'
    }, {
      title: '删除',
      suffix: '...',
      value: 'other'
    }, {
      title: '删除',
      url: 'xx.com'
    }]
    it('prefix&suffix', () => {
      const wrapper = mount(
        <Dropdown title='其它操作' data={_datas} onClick={outCallback} />
      )
      wrapper.find('.hi-dropdown').getDOMNode().click()
      expect(document.querySelectorAll('.hi-dropdown__item--disabled')).toHaveLength(1)
      expect(document.querySelectorAll('.hi-dropdown__divider')).toHaveLength(1)
      expect(document.querySelector('.hi-dropdown__item-prefix').innerHTML).toEqual('...')
      expect(document.querySelector('.hi-dropdown__item-suffix').innerHTML).toEqual('...')
      expect(document.querySelector('.hi-dropdown__item-title').innerHTML).toEqual('同步')
      document.querySelector('.hi-dropdown__item-title').click()
      expect(callback.called).toBeTruthy()
      expect(outCallback.called).toBeFalsy()

      document.querySelectorAll('.hi-dropdown__item-title')[1].click()
      expect(outCallback.called).toBeFalsy()
      document.querySelectorAll('.hi-dropdown__item-title')[2].click()
      expect(outCallback.called).toBeTruthy()
      // expect(document.querySelectorAll('.hi-dropdown__item-suffix')[0].innerHTML).toEqual('-')
      wrapper.unmount()
    })
  })
})
