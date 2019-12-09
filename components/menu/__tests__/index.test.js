import React from 'react'
import ReactTestUtils from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { fake, spy } from 'sinon'
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
        disabled: true,
        children: []
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
  // describe('Lifecycle', () => {
  //   it('componentWillUnmount', () => {
  //     const componentDidMountSpy = spy(OriginalClass.prototype, 'componentWillUnmount')
  //     const wrapper = mount(<Menu />)

  //     expect(wrapper.instance()).toBeInstanceOf(Menu)

  //     expect(componentDidMountSpy.callCount).toEqual(1)
  //     componentDidMountSpy.restore()

  //     // expect(wrapper.find('.icon-info-circle-o')).toHaveLength(1)
  //     // expect(wrapper.find('.close-btn')).toHaveLength(1)
  //   })
  // })
  describe('PropTypes', () => {
    it('data', () => {
      const wrapper = mount(
        <Menu data={[]} />
      )
      expect(wrapper.find('.hi-menu--vertical')).toHaveLength(1)
      expect(wrapper.find('.hi-menu-items')).toHaveLength(1)
      expect(wrapper.find('.hi-menu-items').children()).toHaveLength(0)
      wrapper.setProps({
        data: complexDatas
      })
      document.body.click()
      expect(wrapper.find('.hi-menu-items').children()).toHaveLength(complexDatas.length)
      wrapper.unmount()
    })
    it('activeId', () => {
      const wrapper = mount(
        <Menu data={simpleDatas} activeId={1} />
      )
      expect(wrapper.find('.hi-menu-item').first().hasClass('hi-menu-item--active')).toBeTruthy()
      wrapper.setProps({
        activeId: 2
      })
      expect(wrapper.find('.hi-menu-item').first().hasClass('hi-menu-item--active')).toBeFalsy()
      expect(wrapper.find('.hi-menu-item').at(1).hasClass('hi-menu-item--active')).toBeTruthy()
    })
    it('placement', () => {
      const wrapper = mount(
        <Menu data={complexDatas} placement='horizontal' activeId={'xiaomi9'} />
      )
      expect(wrapper.find('.hi-menu--horizontal')).toHaveLength(1)
      wrapper.find('.hi-menu-item').at(2).childAt(0).simulate('click')
      ReactTestUtils.Simulate.click(document.querySelector('.hi-submenu__items'))
      ReactTestUtils.Simulate.click(document.querySelector('.hi-submenu__items .hi-submenu__title'))
      expect(document.querySelector('.hi-submenu__items .hi-menu__title-toggle-icon>.hi-icon').className).toEqual('hi-icon icon-left')
    })
    it('collapsed', () => {
      const wrapper = mount(
        <Menu data={simpleDatas} collapsed />
      )
      expect(wrapper.find('.hi-menu--mini')).toHaveLength(1)
      wrapper.setProps({
        collapsed: false
      })
      expect(wrapper.find('.hi-menu--mini')).toHaveLength(0)
    })
    it('showCollapse', () => {
      const wrapper = mount(
        <Menu showCollapse data={simpleDatas} />
      )
      expect(wrapper.find('.hi-menu--mini__toggle')).toHaveLength(1)
      wrapper.setProps({
        showCollapse: false
      })
      expect(wrapper.find('.hi-menu--mini__toggle')).toHaveLength(0)
    })
    it('showAllSubMenus', () => {
      const wrapper = mount(
        <Menu showAllSubMenus data={complexDatas} placement='horizontal' />
      )
      expect(wrapper.find('.hi-submenu__popper--fat')).toHaveLength(1)
    })
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
      var subs = wrapper.find('.hi-menu-item').at(2).childAt(1)
      expect(subs.hasClass('hi-submenu__items--hide')).toBeFalsy()

      // 点击未展开菜单
      const vMenu = wrapper.find('.hi-menu--2').first().childAt(0)
      vMenu.simulate('click')
      expect(wrapper.find('.hi-menu--2').first().childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()
      // 点击已经展开的菜单，如果已展开，则关闭
      vMenu.simulate('click')
      expect(wrapper.find('.hi-menu--2').first().childAt(1).hasClass('hi-submenu__items--hide')).toBeTruthy()

      // 再次点击相同菜单打开，用来测试手风琴模式
      vMenu.simulate('click')
      wrapper.find('.hi-menu--2').at(2).childAt(0).simulate('click')
      expect(wrapper.find('.hi-menu--2').first().childAt(1).hasClass('hi-submenu__items--hide')).toBeTruthy()
      expect(wrapper.find('.hi-menu--2').at(2).childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()
    })
  })
  describe('Events', () => {
    it('onClick', () => {
      const callback = spy()
      const wrapper = mount(
        <Menu data={simpleDatas} onClick={callback} />
      )
      wrapper.find('.hi-menu-item').first().simulate('click')
      expect(callback.callCount).toEqual(1)
      expect(callback.firstCall.args[0]).toEqual(1)
      wrapper.find('.hi-menu-item').at(1).simulate('click')
      expect(callback.callCount).toEqual(2)
      expect(callback.secondCall.args[0]).toEqual(2)
    })
    it('onClickSubMenu', () => {
      const callback = spy()
      const wrapper = mount(
        <Menu data={complexDatas} onClickSubMenu={callback} />
      )
      const targetRoot = wrapper.find('.hi-menu-item').at(2) // 手机 LI
      const firstLevel = targetRoot.childAt(0) // 手机div.title
      firstLevel.simulate('click')
      expect(callback.callCount).toEqual(1)
      expect(callback.firstCall.args[0]).toEqual(['2'])
    })
    it('onCollapse', () => {
      const callback = spy()
      const wrapper = mount(
        <Menu data={simpleDatas} onCollapse={callback} showCollapse />
      )
      wrapper.find('.hi-menu--mini__toggle').first().simulate('click')
      jest.runAllTimers()
      wrapper.update()
      expect(callback.callCount).toEqual(1)
      expect(callback.firstCall.args[0]).toEqual(true)
      expect(wrapper.find('.hi-menu').hasClass('hi-menu--mini')).toBeTruthy()
      wrapper.find('.hi-menu--mini__toggle').first().simulate('click')
      jest.runAllTimers()
      wrapper.update()
      expect(callback.callCount).toEqual(2)
      expect(callback.secondCall.args[0]).toEqual(false)
      expect(wrapper.find('.hi-menu').hasClass('hi-menu--mini')).toBeFalsy()
    })
  })

  describe('Branches', () => {
    it('getExpandIndex', () => {
      const wrapper = mount(
        <Menu data={complexDatas} accordion={false} />
      )
      const targetRoot = wrapper.find('.hi-menu-item').at(2) // 手机 LI
      const firstLevel = targetRoot.childAt(0) // 手机div.title
      firstLevel.simulate('click')
      var subs = wrapper.find('.hi-menu-item').at(2).childAt(1)
      expect(subs.hasClass('hi-submenu__items--hide')).toBeFalsy()

      // 点击未展开菜单
      const vMenu = wrapper.find('.hi-menu--2').first().childAt(0)
      vMenu.simulate('click')
      expect(wrapper.find('.hi-menu--2').first().childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()

      // 再次点击相同菜单打开，用来测试手风琴模式
      wrapper.find('.hi-menu--2').at(2).childAt(0).simulate('click')
      expect(wrapper.find('.hi-menu--2').first().childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()
      expect(wrapper.find('.hi-menu--2').at(2).childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()
      // 覆盖第100行分支
      firstLevel.simulate('click')
    })
    it('verticalMini', () => {
      const wrapper = mount(
        <Menu data={complexDatas} collapsed />
      )
      wrapper.find('.hi-menu-item').first().simulate('click')
      expect(wrapper.find('.hi-menu-item').first().hasClass('hi-menu-item--active')).toBeTruthy()
      // const targetRoot = wrapper.find('.hi-menu-item').at(2) // 手机 LI
      // const firstLevel = targetRoot.childAt(0) // 手机div.title
      // firstLevel.simulate('click')
      // var subs = wrapper.find('.hi-menu-item').at(2).childAt(1)
      // expect(subs.hasClass('hi-submenu__items--hide')).toBeFalsy()

      // // 点击未展开菜单
      // const vMenu = wrapper.find('.hi-menu--2').first().childAt(0)
      // vMenu.simulate('click')
      // expect(wrapper.find('.hi-menu--2').first().childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()

      // // 再次点击相同菜单打开，用来测试手风琴模式
      // wrapper.find('.hi-menu--2').at(2).childAt(0).simulate('click')
      // expect(wrapper.find('.hi-menu--2').first().childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()
      // expect(wrapper.find('.hi-menu--2').at(2).childAt(1).hasClass('hi-submenu__items--hide')).toBeFalsy()
      // // 覆盖第100行分支
      // firstLevel.simulate('click')
    })
  })
})
