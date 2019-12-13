import React from 'react'
import { mount } from 'enzyme'
import Tabs from '../index'
function trigger(elem, event){

    var myEvent = document.createEvent('Event')        // 初始化这个事件对象，为它提高需要的“特性”

    myEvent.initEvent(event, true, true);        //执行事件

    elem.dispatchEvent(myEvent);

}
describe('Tabs',()=>{
    const panes = [{
        tabTitle: '我的订单',
        tabId: 'tabId-1'
      },
      {
        tabTitle: '团购订单',
        tabId: 'tabId-2',
        closeable: false
      },
      {
        tabTitle: '以旧换新订单',
        tabId: 'tabId-3'
      },
      {
        tabTitle: '以旧换新订单4',
        tabId: 'tabId-4'
      },
      {
        tabTitle: '以旧换新订单5',
        tabId: 'tabId-5'
      },
      {
        tabTitle: '购买资格',
        tabId: 'tabId-6'
      }]
      describe('PropTypes',()=>{
          it('defaultActiveId',()=>{
            const wrapperDefult = mount(
                <Tabs defaultActiveId='tabId-2' placement="horizontal">
                    {
                        panes.map((pane, index) => {
                            return (
                            <Tabs.Pane
                                tabTitle={pane.tabTitle}
                                tabId={pane.tabId}
                                closeable={pane.closeable}
                                key={index}
                            >
                                <div style={{padding: '16px'}}>{pane.tabTitle}</div>
                            </Tabs.Pane>
                            )
                        })
                    }
                </Tabs>
            )
            expect(wrapperDefult.find('.hi-tabs--card')).toHaveLength(1)
            expect(wrapperDefult.find('.hi-tabs--horizontal')).toHaveLength(1)
            expect(wrapperDefult.find('.hi-tabs__item').at(1).hasClass('hi-tabs__item--active')).toBeTruthy()
            wrapperDefult.find('.hi-tabs__item').at(0).simulate('click')
            expect(wrapperDefult.find('.hi-tabs__item--active')).toHaveLength(1)
            expect(wrapperDefult.find('.hi-tabs__item').at(0).hasClass('hi-tabs__item--active')).toBeTruthy()
            wrapperDefult.unmount()
          })
          it('placement',()=>{
            const wrapperVertical = mount(
                <Tabs defaultActiveId='tabId-2' placement="vertical">
                    {
                        panes.map((pane, index) => {
                            return (
                            <Tabs.Pane
                                tabTitle={pane.tabTitle}
                                tabId={pane.tabId}
                                closeable={pane.closeable}
                                key={index}
                            >
                                <div style={{padding: '16px'}}>{pane.tabTitle}</div>
                            </Tabs.Pane>
                            )
                        })
                    }
                </Tabs>
            )
            expect(wrapperVertical.find('.hi-tabs--card')).toHaveLength(1)
            expect(wrapperVertical.find('.hi-tabs--vertical')).toHaveLength(1)
            wrapperVertical.unmount()
          })
          it('max',()=>{
            const max = 4;
            const wrapper = mount(
                <Tabs placement="horizontal" max={max}>
                    {
                        panes.map((pane, index) => {
                            return (
                            <Tabs.Pane
                                tabTitle={pane.tabTitle}
                                tabId={pane.tabId}
                                closeable={pane.closeable}
                                key={index}
                            >
                                <div style={{padding: '16px'}}>{pane.tabTitle}</div>
                            </Tabs.Pane>
                            )
                        })
                    }
                </Tabs>
            )
            expect(wrapper.find('.hi-tabs-dropdown')).toHaveLength(1)
            expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(0)
            wrapper.find('.hi-tabs-dropdown__toggle').simulate('click')
            expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(1)
            trigger(document.querySelectorAll('.hi-tabs-dropdown__item')[0],'click')
            expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
            wrapper.find('.hi-tabs-dropdown__toggle').simulate('click')
            expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(0)
            trigger(document,'click')
            expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
            wrapper.unmount()    
          })
          it('type',()=>{
            const wrapper = mount(
                <Tabs placement="horizontal" type="desc">
                    {
                        panes.map((pane, index) => {
                            return (
                            <Tabs.Pane
                                tabTitle={pane.tabTitle}
                                tabId={pane.tabId}
                                closeable={pane.closeable}
                                key={index}
                            >
                                <div style={{padding: '16px'}}>{pane.tabTitle}</div>
                            </Tabs.Pane>
                            )
                        })
                    }
                </Tabs>
            )
            expect(wrapper.find('.hi-tabs--desc')).toHaveLength(1)    
            wrapper.unmount()
            
          })
          it('editable',()=>{
            const editableWrapper = mount(
                <Tabs type="editable">
                    {
                        panes.map((pane, index) => {
                            return (
                            <Tabs.Pane
                                tabTitle={pane.tabTitle}
                                tabId={pane.tabId}
                                closeable
                                key={index}
                            >
                                <div style={{padding: '16px'}}>{pane.tabTitle}</div>
                            </Tabs.Pane>
                            )
                        })
                    }
                </Tabs>
            )    
            expect(editableWrapper.find('.hi-tabs--editable')).toHaveLength(1)
            editableWrapper.find('.icon-close').at(0).simulate('click')
            expect(editableWrapper.find('.hi-tabs__item')).toHaveLength(11)
            editableWrapper.setProps({defaultActiveId:'tabId-1'})
          })
      })
 
})