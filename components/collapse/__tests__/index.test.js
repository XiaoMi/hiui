import React from 'react'
import { mount } from 'enzyme'
import Collapse from '../'

/* eslint-env jest */

const changeCallback = jest.fn(key => key)
const component = (<Collapse
  onChange={changeCallback}
  accordion
>
  <Collapse.Panel
    header='panel title 1'
  >
    <p>Collapse Panel Content</p>
  </Collapse.Panel>
  <Collapse.Panel
    header='panel title 2'
  >
    <p>Collapse Panel Content</p>
  </Collapse.Panel>
  <Collapse.Panel
    header='panel title 3'
  >
    <p>Collapse Panel Content</p>
  </Collapse.Panel>
</Collapse>)

describe('Collapse', () => {
  describe('PropTypes', () => {
    it('accordion', () => {
      const wrapper = mount(
        component
      )
      wrapper.find('.collapse-item__head').at(1).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      wrapper.find('.collapse-item__head').at(2).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      expect(changeCallback.mock.results[1].value).toBe('2')
    })
    it('activeId', () => {
      const wrapper = mount(
        React.cloneElement(component, {
          activeId: '1'
        })
      )
      expect(wrapper.find('.collapse-item').at(0).hasClass('collapse-item--show')).toBeFalsy()
      expect(wrapper.find('.collapse-item').at(1).hasClass('collapse-item--show')).toBeTruthy()
    })
    it('arrow', () => {
      const wrapper = mount(
        React.cloneElement(component, {
          arrow: 'left'
        })
      )
      // expect(wrapper.find('.collapse-item__icon').at(0).hasClass('icon-right')).toBeFalsy()
      expect(wrapper.find('.collapse-item__head').first().childAt(0).hasClass('collapse-item__title')).toBeFalsy()
      wrapper.setProps({arrow: 'right'})
      expect(wrapper.find('.collapse-item__head').first().childAt(0).hasClass('collapse-item__title')).toBeTruthy()
    })
    it('showArrow', () => {
      const wrapper = mount(
        React.cloneElement(component, {
          showArrow: true
        })
      )
      // expect(wrapper.find('.collapse-item__icon').at(0).hasClass('icon-right')).toBeFalsy()
      expect(wrapper.find('.collapse-item__icon')).toHaveLength(3)
      wrapper.setProps({showArrow: false})
      expect(wrapper.find('.collapse-item__icon')).toHaveLength(0)
    })
    // it('手风琴模式&不可点击状态测试成功', () => {
    //   const wrapper = mount(
    //     <Collapse
    //       onChange={changeCallback}
    //       accordion={true}
    //       arrow="right"
    //     >
    //       <Collapse.Panel
    //         disabled={true}
    //         header="panel title 1"
    //       >
    //         <p>Collapse Panel Content 1</p>
    //         <p>Collapse Panel Content 1</p>
    //         <p>Collapse Panel Content 1</p>
    //       </Collapse.Panel>
    //       <Collapse.Panel
    //         header="panel title 2"
    //       >
    //         <p>Collapse Panel Content 2</p>
    //         <p>Collapse Panel Content 2</p>
    //         <p>Collapse Panel Content 2</p>
    //       </Collapse.Panel>
    //       <Collapse.Panel
    //         header="panel title 3"
    //       >
    //         <p>Collapse Panel Content 3</p>
    //         <p>Collapse Panel Content 3</p>
    //         <p>Collapse Panel Content 3</p>
    //       </Collapse.Panel>
    //     </Collapse>
    //   )
    //   expect(wrapper.find('.collapse-item--show')).toHaveLength(0)
    //   wrapper.find('.collapse-item__head').at(0).simulate('click') // test disabled
    //   expect(wrapper.find('.collapse-item--show')).toHaveLength(0)
    //   wrapper.find('.collapse-item__head').at(1).simulate('click')
    //   expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
    //   wrapper.find('.collapse-item__head').at(2).simulate('click')
    //   expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
    //   expect(changeCallback.mock.results[1].value).toBe('2')
    // })

    // it('非手风琴模式&默认激活测试成功', () => {
    //   const wrapper = mount(
    //     <Collapse
    //       onChange={changeCallback}
    //       activeKey='2'
    //       arrow="left"
    //     >
    //       <Collapse.Panel
    //         header="panel title 1"
    //       >
    //         <p>Collapse Panel Content 1</p>
    //         <p>Collapse Panel Content 1</p>
    //         <p>Collapse Panel Content 1</p>
    //       </Collapse.Panel>
    //       <Collapse.Panel
    //         header="panel title 2"
    //       >
    //         <p>Collapse Panel Content 2</p>
    //         <p>Collapse Panel Content 2</p>
    //         <p>Collapse Panel Content 2</p>
    //       </Collapse.Panel>
    //       <Collapse.Panel
    //         header="panel title 3"
    //       >
    //         <p>Collapse Panel Content 3</p>
    //         <p>Collapse Panel Content 3</p>
    //         <p>Collapse Panel Content 3</p>
    //       </Collapse.Panel>
    //     </Collapse>
    //   )
    //   expect(wrapper.find('.collapse-item--show')).toHaveLength(1) // 测试默认激活
    //   wrapper.find('.collapse-item__head').at(0).simulate('click')
    //   expect(wrapper.find('.collapse-item--show')).toHaveLength(2)
    //   expect(changeCallback.mock.results[2].value).toEqual([ '2', '0' ])
    // })
  })
})

describe('Collapse.Panel', () => {
  // TODO: 组件需要梳理
})
