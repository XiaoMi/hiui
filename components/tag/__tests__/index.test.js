import React from 'react'
import {mount,shallow} from 'enzyme'
import { fake } from 'sinon'
import Tag from '../'

describe('Tag',()=>{
    describe('ProtoType',()=>{
        it('type',()=>{
            const wrapper = mount(
                <div>
                  <Tag type='primary' />
                  <Tag type='danger' />
                  <Tag type='success' />
                  <Tag type='warning' />
                </div>
              )
            expect(wrapper.find(`.hi-tag__container--warning`)).toHaveLength(1)
            expect(wrapper.find('.hi-tag__container--primary')).toHaveLength(1)
            expect(wrapper.find('.hi-tag__container--success')).toHaveLength(1)
            expect(wrapper.find('.hi-tag__container--danger')).toHaveLength(1)
        })
        it('appearance',()=>{
            const wrapper = mount(
                <div>
                  <Tag appearance='line' />
                  <Tag />
                </div>
              )
            expect(wrapper.find('.hi-tag__container--line')).toHaveLength(1)
            expect(wrapper.find('.hi-tag__container--default')).toHaveLength(1)
        })
        it('onClick',()=>{    
            const callback = fake()
            const wrapper = shallow(
            <Tag onClick={callback} />
            )
    
            wrapper.find('.hi-tag__container--click').simulate('click')
            expect(callback.callCount).toEqual(1)
        })
    })
})