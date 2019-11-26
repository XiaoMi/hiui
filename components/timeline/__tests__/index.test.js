import React from 'react'
import { mount } from 'enzyme'
import Timeline from '../index'
import Icon from '../../icon'

describe('Timeline',()=>{
    
    describe('props',()=>{
        it('data',()=>{
            const clickFn = jest.fn()
            const datas = [{
                title: 'Title - 1',
                dot:null,
                content: 'Here are some descriptions',
                timestamp: '2019.02.24 12:00:00'
              }, {
                title: 'Title 2',
                content: 'Here are some descriptions',
                timestamp: '2019.02.24 14:24:00'
              },{
                title: 'Title 3',
                content: 'Here are some descriptions',
                timestamp: '2019.02.24 15:00:00',
                children: [{
                  title: 'Sub 1',
                  content: 'Here are some descriptions'
                }, {
                  title: 'Sub 2',
                  content: 'Here are some descriptions'
                }]
              }, {
                icon: <Icon name='collection' style={{fontSize: 16, color: 'red'}} />,
                title: 'Title 2-2',
                content: 'Here are some descriptions',
                timestamp: '12:00'
              }, {
                title: 'Title 4',
                icon:'circle',
                content: 'Here are some descriptions',
                timestamp: '2019.02.24 19:55:00'
              }]
            const wrapper = mount(<Timeline data={datas}/>)
            expect(wrapper.find('.hi-timeline')).toHaveLength(1)

            // 点击展开
            expect(wrapper.find('.hi-timeline__item--folding').find('ul')).toHaveLength(0)

            wrapper.find('.hi-timeline__arrow').first().simulate('click')
            expect(wrapper.find('.hi-timeline__item--folding').find('ul')).toHaveLength(1)


        })

        it('type',()=>{
            const datas = [{
                groupTitle: '2月',
                children: [{
                  title: 'Title - 1',
                  content: 'Here are some descriptions',
                  timestamp: '10:00',
                  extraTime: '02-23'
                }, {
                  title: 'Title 2',
                  content: 'Here are some descriptions',
                  timestamp: '10:00',
                  extraTime: '02-27'
                }]
              }, {
                groupTitle: '3月',
                children: [{
                  title: 'Title 3',
                  content: 'Here are some descriptions',
                  timestamp: '12:00',
                  extraTime: '03-02'
                }, {
                  title: 'Title 4',
                  content: 'Here are some descriptions',
                  timestamp: '11:00',
                  extraTime: '03-10'
                }]
              }]
              const wrapper = mount(<Timeline data={datas} />)
              expect(wrapper.find('.hi-timeline').hasClass('hi-timeline--normal')).toBeTruthy()
              expect(wrapper.find('.hi-timeline').hasClass('hi-timeline--cross')).toBeFalsy()

              wrapper.setProps({type:'cross'})
              expect(wrapper.find('.hi-timeline').hasClass('hi-timeline--normal')).toBeFalsy()
              expect(wrapper.find('.hi-timeline').hasClass('hi-timeline--cross')).toBeTruthy()
        })
    })
})