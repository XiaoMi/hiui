import React from 'react'
import { mount, shallow } from 'enzyme'
import Tooltip from '../index'
import Button from '../../button'

describe('Tooltip', () => {
    beforeAll(() => {
      jest.useFakeTimers()
    })
    afterAll(() => {
      jest.useRealTimers()
    })
  
    describe('PropTypes', () => {
      it('title',()=>{
            const wrapper = mount(
                <Tooltip title="tooltip top">
                    <Button type="line">Tooltip Top</Button>
                </Tooltip>
            )
            // wrapper.find(`.hi-tooltip`).simulate('click')
            expect(wrapper.find(`.hi-tooltip`)).toHaveLength(1);
            wrapper.find(`.hi-tooltip`).simulate('mouseenter').tap((n)=>{
                console.group('n',n.debug())
            })
            expect(wrapper.find('.hi-tooltip__popper')).toHaveLength(1)
            wrapper.parent().tap((n)=>{
                console.log('2',n.debug())
            });
            const body = wrapper.parents('body')
            const child = wrapper.children()
            expect(child.find('button')).toHaveLength(1)
            wrapper.getDOMNode()
            console.log(wrapper.context())
            wrapper.parent().tap((n)=>{
                console.log('1',n.debug())
            })

            expect(body.children()).toHaveLength(1)
            
            // expect(wrap.find(`.hi-btn`).sul)
            // console.log(expect(wrapper.find(`.hi-tooltip-base`)).innerHtml())

            console.dir(wrapper);
        })
      })
})