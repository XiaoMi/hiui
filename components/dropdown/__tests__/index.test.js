import React, { Fragment } from 'react'
import { Simulate } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import sinon, { fake, spy } from 'sinon'
import Dropdown from '../index'
import DropdownMenuItem from '../DropdownMenuItem'
import Button from '../../button'

const datas = [{
  title: '移动',
  id: 1
}, {
  title: '复制',
  id: 2
}, {
  title: '删除',
  id: 3
}]
function trigger(elem, event){

  var myEvent = document.createEvent('Event')        // 初始化这个事件对象，为它提高需要的“特性”

  myEvent.initEvent(event, true, true);        //执行事件

  elem.dispatchEvent(myEvent);

}
/* eslint-env jest */
describe('Dropdown', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
    document.querySelectorAll('.hi-popper__container')[0] && document.querySelectorAll('.hi-popper__container')[0].remove()
  })
  jest.useFakeTimers()
  describe('PropTypes', () => {
    it('title', () => {
      const wrapper = mount(
        <Dropdown title='删除' data={datas} trigger='click' />
      )
      wrapper.find(Button).first().simulate('click')
      expect(wrapper.find('.hi-dropdown__button--active').first().text()).toEqual('删除')
      expect(wrapper.find('.hi-dropdown__icon--active')).toHaveLength(1)
      wrapper.unmount()
    })
    it('type', () => {
      const types = ['text', 'button', 'group']
      const title = '操作'
      const wrapper = mount(
        <div>
          {types.map((type, index) => <Dropdown data={datas} type={type} key={index} title={title} />)}
        </div>
      )
      types.map((type) => {
        expect(wrapper.find(`.hi-dropdown--${type}`)).toHaveLength(1)
      })
      // console.log(wrapper.debug())
      expect(wrapper.find('.hi-dropdown--text').find('button.hi-btn--appearance--link')).toHaveLength(1)
      expect(wrapper.find('.hi-dropdown--button').find('button.hi-btn--type--default')).toHaveLength(1)
      expect(wrapper.find('.hi-dropdown--group').find(Button)).toHaveLength(2)
      wrapper.unmount()
    })

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
      const triggers = ['click', 'contextmenu', 'hover']
      const wrapper = mount(
        <div>
          {
            triggers.map((tt, index) => <Dropdown key={index} title='其它操作' data={datas} trigger={tt} />)
          }
          <Dropdown title='其它操作' data={datas} trigger={[...triggers]} />
        </div>
      )
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(0)
      wrapper.find('.hi-dropdown').at(0).find(Button).simulate('click')
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(1)
      wrapper.find('.hi-dropdown').at(0).find(Button).simulate('click')

      wrapper.find('.hi-dropdown').at(1).find(Button).simulate('contextmenu')
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(2)
      wrapper.find('.hi-dropdown').at(1).find(Button).simulate('click')

      wrapper.find('.hi-dropdown').at(2).find(Button).simulate('mouseEnter')
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(3)
      wrapper.find('.hi-dropdown').at(2).find(Button).simulate('mouseLeave')
      
      wrapper.unmount()
    })
    it('onClick', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <div>
          <Dropdown title='其它操作' data={datas} onClick={callback} trigger='click' />
          <Dropdown title='其它操作' data={datas} />
        </div>
      )
      wrapper.find('.hi-dropdown').at(0).find('button').simulate('click')
      Simulate.click(document.querySelectorAll('.hi-dropdown__menu-item')[0])
      expect(callback).toHaveBeenCalled()
      expect(callback).toHaveBeenCalledWith(1)
      wrapper.unmount()
    })
    it('placement', () => {
      const plcs = ['bottom-start', 'top-start', 'bottom', 'top']
      const wrapper = mount(
        <div>
          {
            plcs.map((plc, index) => {
              return <Dropdown key={index} data={datas} placement={plc} />
            })
          }
        </div>
      )
      plcs.map((plc, index) => {
        wrapper.find('.hi-dropdown').at(index).find('button').simulate('mouseEnter')
        expect(document.querySelectorAll(`.hi-popper__content--${plc}`)).toHaveLength(1)
      })
      wrapper.unmount()
    })
  })

  describe('DataItem', () => {
    const callback = spy()
    const outCallback = spy()
    const _datas = [{
      title: '同步',
      onClick: callback
    }, {
      title: '上传',
      disabled: true
    }, {
      title: '-'
    }, {
      title: '删除',
      value: 'other'
    }, {
      title: '删除',
      url: 'xx.com'
    }]
    it('item', () => {
      const wrapper = mount(
        <Dropdown title='操作' data={_datas} onClick={outCallback} trigger={['click', 'hover']} />
      )
      wrapper.find('.hi-dropdown').at(0).find('button').simulate('click')
      expect(document.querySelectorAll('.hi-dropdown__menu-item--disabled')).toHaveLength(1)
      expect(document.querySelectorAll('.hi-dropdown__divider')).toHaveLength(1)
      Simulate.mouseEnter(document.querySelector('.hi-dropdown__popper'))
      Simulate.mouseEnter(document.querySelector('.hi-dropdown__menu-item'))
      Simulate.mouseLeave(document.querySelector('.hi-dropdown__menu-item'))
      Simulate.mouseLeave(document.querySelector('.hi-dropdown__popper'))
      wrapper.find('.hi-dropdown').at(0).find('button').simulate('click')
      expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
      wrapper.unmount()
    })
    it('handleDocumentClick', () => {
      const wrapper = mount(
        <Dropdown title='操作' data={_datas} onClick={outCallback} trigger={['click', 'hover']} />
      )
      wrapper.find('.hi-dropdown').at(0).find('button').simulate('click')
      expect(document.querySelectorAll('.hi-dropdown__menu-item--disabled')).toHaveLength(1)
      expect(document.querySelectorAll('.hi-dropdown__divider')).toHaveLength(1)
      trigger(document,'click')
      expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
      wrapper.unmount()
    })
    it('level', () => {
      console.log('执行了')
      const _data = [{
        title: 'Move',
        children: [{
          title: '2019',
          children: [{
            title: 'Q1',
            children: [{
              title: '01'
            }, {
              title: '02'
            }, {
              title: '03'
            }]
          }, {
            title: 'Q2',
            disabled: true
          }, {
            title: 'Q3'
          }]
        }]
      }, {
        title: 'Copy',
        children: [{
          title: '2019',
          children: [{
            title: 'Q1',
            disabled: true,
            children: [{
              title: '01'
            }, {
              title: '02'
            }, {
              title: '03'
            }]
          }, {
            title: 'Q2'
          }, {
            title: 'Q3'
          }]
        }]
      }, {
        title: '删除'
      }]

      const wrapper = mount(
        <Dropdown data={_data} trigger='click' />
      )
      wrapper.find('.hi-dropdown').at(0).find('button').simulate('click')
      Simulate.mouseEnter(document.querySelector('.hi-dropdown__menu-item'))

      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(2)
      Simulate.mouseEnter(document.querySelectorAll('.hi-dropdown__popper')[1])
      Simulate.mouseEnter(document.querySelectorAll('.hi-dropdown__popper')[1].querySelector('.hi-dropdown__menu-item'))
      Simulate.mouseLeave(document.querySelectorAll('.hi-dropdown__popper')[1].querySelector('.hi-dropdown__menu-item'))
      Simulate.mouseLeave(document.querySelectorAll('.hi-dropdown__popper')[1])
      expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(3)
      wrapper.unmount()
    })
  })
  describe('Branches', () => {
    const wrapper = mount(
      <Dropdown title='操作' list={datas} trigger={['click', 'hover']} />
    )
  })
})
