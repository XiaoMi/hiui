import React from 'react'
import { mount } from 'enzyme'
import Progress from '../Progress'

describe('Progress',()=>{

    describe('Props',()=>{

        it('apperance',()=>{

            const wrapper=mount(
                <div>
                    <Progress />
                    <Progress apperance='bar'/>
                    <Progress apperance='circle'/>
                    <Progress apperance='dashboard'/>
                </div>
            )

            expect(wrapper.find('.hi-progress__container')).toHaveLength(4)
            expect(wrapper.find('.hi-progress__bar')).toHaveLength(2)
            expect(wrapper.find('.hi-progress__svg')).toHaveLength(2)
            expect(wrapper.find('.hi-progress__svg').first().hasClass('hi-progress__svg_dashboard')).toBeFalsy()
            expect(wrapper.find('.hi-progress__svg').last().hasClass('hi-progress__svg_dashboard')).toBeTruthy()
            
        })

        it('size',()=>{

            const wrapper=mount(
                <div>
                    <Progress />
                    <Progress size='default'/>
                    <Progress size='small'/>
                    <Progress size='large'/>
                </div>
            )

            expect(wrapper.find('.hi-progress__container')).toHaveLength(4)
            expect(window.getComputedStyle(wrapper.find('.hi-progress__inner').first().getDOMNode()).getPropertyValue('height')).toEqual('6px'),
            expect(window.getComputedStyle(wrapper.find('.hi-progress__inner').at(1).getDOMNode()).getPropertyValue('height')).toEqual('6px'),
            expect(window.getComputedStyle(wrapper.find('.hi-progress__inner').at(2).getDOMNode()).getPropertyValue('height')).toEqual('2px'),
            expect(window.getComputedStyle(wrapper.find('.hi-progress__inner').last().getDOMNode()).getPropertyValue('height')).toEqual('8px')
        })

        it('content&showInfo',()=>{

            const wrapper=mount(<Progress percent={50}/>)

            expect(wrapper.find('.hi-progress__text').first().text()).toEqual('50%')
            expect(wrapper.exists('.hi-progress__text')).toEqual(true)

            wrapper.setProps({content:'test'})
            expect(wrapper.find('.hi-progress__text').first().text()).toEqual('test')

            wrapper.setProps({showInfo:false})
            expect(wrapper.exists('.hi-progress__text')).toEqual(false)
            
        })

        it('type',()=>{

            const wrapper=mount(<Progress percent={50}/>)

            expect(wrapper.find('.hi-progress__bar').first().hasClass('hi-progress__bar--primary')).toBeTruthy()
            expect(wrapper.find('.hi-progress__text').first().hasClass('hi-progress__text--primary')).toBeTruthy()

            wrapper.setProps({type:'success'})
            expect(wrapper.find('.hi-progress__bar').first().hasClass('hi-progress__bar--primary')).toBeFalsy()
            expect(wrapper.find('.hi-progress__text').first().hasClass('hi-progress__text--primary')).toBeFalsy()
            expect(wrapper.find('.hi-progress__bar').first().hasClass('hi-progress__bar--success')).toBeTruthy()
            expect(wrapper.find('.hi-progress__text').first().hasClass('hi-progress__text--success')).toBeTruthy()

            wrapper.setProps({type:'warn'})
            expect(wrapper.find('.hi-progress__bar').first().hasClass('hi-progress__bar--success')).toBeFalsy()
            expect(wrapper.find('.hi-progress__text').first().hasClass('hi-progress__text--success')).toBeFalsy()
            expect(wrapper.find('.hi-progress__bar').first().hasClass('hi-progress__bar--warn')).toBeTruthy()
            expect(wrapper.find('.hi-progress__text').first().hasClass('hi-progress__text--warn')).toBeTruthy()

            wrapper.setProps({type:'error'})
            expect(wrapper.find('.hi-progress__bar').first().hasClass('hi-progress__bar--warn')).toBeFalsy()
            expect(wrapper.find('.hi-progress__text').first().hasClass('hi-progress__text--warn')).toBeFalsy()
            expect(wrapper.find('.hi-progress__bar').first().hasClass('hi-progress__bar--error')).toBeTruthy()
            expect(wrapper.find('.hi-progress__text').first().hasClass('hi-progress__text--error')).toBeTruthy()
            
        })

        it('radius',()=>{

            const wrapper=mount(<Progress percent={50} apperance='circle'/>)

            expect(window.getComputedStyle(wrapper.find('.hi-progress__svg_dashboard').first().getDOMNode()).getPropertyValue('width')).toEqual('80px')
            expect(window.getComputedStyle(wrapper.find('.hi-progress__svg_dashboard').first().getDOMNode()).getPropertyValue('height')).toEqual('80px')
           
            wrapper.setProps({radius:50})

            expect(window.getComputedStyle(wrapper.find('.hi-progress__svg_dashboard').first().getDOMNode()).getPropertyValue('width')).toEqual('100px')
            expect(window.getComputedStyle(wrapper.find('.hi-progress__svg_dashboard').first().getDOMNode()).getPropertyValue('height')).toEqual('100px')
            
        })
    })
})