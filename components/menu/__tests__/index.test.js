import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import sinon, { fake, spy } from 'sinon'
import simulant from 'simulant'
import Menu, { Menu as OriginalClass } from '../index'

/* eslint-env jest */

const simpleDatas = [{
  content: '电视',
  id: 1
}, {
  content: '手机',
  id: 2
}]
const complexDatas = [
  {
    content: '电视',
    id: 1,
    icon: 'internet'
  },
  {
    content: '小米MIX',
    id: 2
  },
  {
    content: '手机',
    children: [
      {
        content: '小米',
        icon: 'phone',
        children: [
          {
            content: '小米9',
            id: 'xiaomi9'
          },
          {
            content: '小米8',
            id: 'xiaomi8',
            disabled: true
          }
        ]
      },
      {
        content: '红米',
        id: 'hongmi',
        disabled: true
      },
      {
        content: '小米note',
        children: [
          {
            content: '小米 note7',
            id: 'xiaomi note7'
          },
          {
            content: '小米 note6',
            id: 'xiaomi note6'
          }
        ]
      }
    ]
  },
  {
    content: '超长超长超长字符超长超长超长字符',
    id: 4
  }
]
jest.useFakeTimers()
describe('Menu', () => {
  describe('PropTypes', () => {
    // it('data', () => {
    //   const wrapper = mount(
    //     <Menu data={[]} />
    //   )
    //   expect(wrapper.find('.hi-menu--vertical')).toHaveLength(1)
    //   expect(wrapper.find('.hi-menu-items')).toHaveLength(1)
    //   expect(wrapper.find('.hi-menu-items').children()).toHaveLength(0)
    //   wrapper.setProps({
    //     data: complexDatas
    //   })
    //   expect(wrapper.find('.hi-menu-items').children()).toHaveLength(complexDatas.length)
    // })
    // it('activeId', () => {
    //   const wrapper = mount(
    //     <Menu data={simpleDatas} activeId={1} />
    //   )
    //   expect(wrapper.find('.hi-menu-item').first().hasClass('hi-menu-item--active')).toBeTruthy()
    //   wrapper.setProps({
    //     activeId: 2
    //   })
    //   expect(wrapper.find('.hi-menu-item').first().hasClass('hi-menu-item--active')).toBeFalsy()
    //   expect(wrapper.find('.hi-menu-item').at(1).hasClass('hi-menu-item--active')).toBeTruthy()
    // })
    // it('placement', () => {
    //   const wrapper = mount(
    //     <Menu data={simpleDatas} placement='horizontal' />
    //   )
    //   expect(wrapper.find('.hi-menu--horizontal')).toHaveLength(1)
    // })
    // it('collapsed', () => {
    //   const wrapper = mount(
    //     <Menu data={simpleDatas} collapsed />
    //   )
    //   expect(wrapper.find('.hi-menu--mini')).toHaveLength(1)
    //   wrapper.setProps({
    //     collapsed: false
    //   })
    //   expect(wrapper.find('.hi-menu--mini')).toHaveLength(0)
    // })
    // // TODO: showAllSubMenus
    // it('showCollapse', () => {
    //   const wrapper = mount(
    //     <Menu showCollapse data={simpleDatas} />
    //   )
    //   expect(wrapper.find('.hi-menu--mini__toggle')).toHaveLength(1)
    //   wrapper.setProps({
    //     showCollapse: false
    //   })
    //   expect(wrapper.find('.hi-menu--mini__toggle')).toHaveLength(0)
    // })
    it('accordion', () => {
      const callback = fake()
      const wrapper = mount(
        <Menu data={complexDatas} onClickSubMenu={callback} accordion />
      )
      const targetRoot = wrapper.find('.hi-menu-item').at(2) // 手机 LI
      const firstLevel = targetRoot.childAt(0) // 手机div.title
      firstLevel.simulate('click')
      expect(wrapper.find(OriginalClass).state('expandIndex')).toContain('2')
      expect(callback.callCount).toEqual(1)
      var subs = targetRoot.childAt(1)
      expect(subs.hasClass('hi-submenu__items--hide')).toBeFalsy()
      subs.childAt(0).childAt(0).simulate('click')
      expect(subs.childAt(0).childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()
      subs.childAt(2).childAt(0).simulate('click')
      expect(subs.childAt(2).childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()
    })
  })
})
