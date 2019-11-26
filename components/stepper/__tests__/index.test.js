import React from 'react'
import { mount } from 'enzyme'
import Stepper from '../index'

describe('stepper',()=>{
    const list2 = [
        {
            title: '账号信息',
        },
        {
            title: '邮箱激活',
        },
        {
            title: '信息登记',
        }
      ]
    describe('props',()=>{
        it('data',()=>{
            const list1 = [
                {
                  title: '账号信息',
                },
                {
                  title: '邮箱激活',
                }
              ]
            
            const wrapper = mount(<Stepper data={list1}/>)
            expect(wrapper.find('li')).toHaveLength(2)
            wrapper.setProps({data:list2})
            expect(wrapper.find('li')).toHaveLength(3)

        })
        it('current',()=>{
            const wrapper = mount(<Stepper data={list2} current={1}/>)
            expect(wrapper.find('li')).toHaveLength(3)
            expect(wrapper.find('.hi-stepper__item--done')).toHaveLength(1)
            expect(wrapper.find('.hi-stepper__item--active')).toHaveLength(2)
            expect(wrapper.find('.hi-stepper__item--active').at(1).hasClass('hi-stepper__item--done')).toBeFalsy()
            
            wrapper.setProps({current:2})
            expect(wrapper.find('.hi-stepper__item--done')).toHaveLength(2)
            expect(wrapper.find('.hi-stepper__item--active')).toHaveLength(3)
            expect(wrapper.find('.hi-stepper__item--active').at(1).hasClass('hi-stepper__item--done')).toBeTruthy()
            expect(wrapper.find('.hi-stepper__item--active').at(2).hasClass('hi-stepper__item--done')).toBeFalsy()

        })

        it('placement',()=>{
            const list = [
                {
                  title: '账号信息',
                  content: '请输入账号信息',
                },
                {
                  title: '邮箱激活',
                  content: '请输入邮箱',
                },
                {
                  title: '信息登记',
                  content: '请输入个人信息',
                },
              ]
            const wrapper = mount(<Stepper data={list} />)
            expect(wrapper.find('.hi-stepper').hasClass('hi-stepper--horizontal')).toBeTruthy()
            expect(wrapper.find('.hi-stepper').hasClass('hi-stepper--vertical')).toBeFalsy()

            wrapper.setProps({placement:'vertical'})
            expect(wrapper.find('.hi-stepper').hasClass('hi-stepper--horizontal')).toBeFalsy()
            expect(wrapper.find('.hi-stepper').hasClass('hi-stepper--vertical')).toBeTruthy()

        })

        it('itemLayout',()=>{
            const list = [
                {
                  title: '账号信息',
                  content: '请输入账号信息',
                  icon:'111'
                },
                {
                  title: '邮箱激活',
                  content: '请输入邮箱',
                },
                {
                  title: '信息登记',
                  content: '请输入个人信息',
                },
              ]
            const wrapper = mount(<Stepper data={list}/>)
            expect(wrapper.find('.hi-stepper__item--up')).toHaveLength(0)

            wrapper.setProps({itemLayout:'vertical'})
            expect(wrapper.find('.hi-stepper__item--up')).toHaveLength(3)

        })
    })
    describe('oldProps',()=>{

      // data
      it('list',()=>{
          const list1 = [
              {
                title: '账号信息',
              },
              {
                title: '邮箱激活',
              }
            ]
          
          const wrapper = mount(<Stepper list={list1}/>)
          expect(wrapper.find('li')).toHaveLength(2)
          wrapper.setProps({list:list2})
          expect(wrapper.find('li')).toHaveLength(3)

      })

      // placement
      it('vertical',()=>{
          const list = [
              {
                title: '账号信息',
                content: '请输入账号信息',
              },
              {
                title: '邮箱激活',
                content: '请输入邮箱',
              },
              {
                title: '信息登记',
                content: '请输入个人信息',
              },
            ]
        
          const wrapper = mount(<Stepper list={list} vertical/>)
          expect(wrapper.find('.hi-stepper').hasClass('hi-stepper--horizontal')).toBeFalsy()
          expect(wrapper.find('.hi-stepper').hasClass('hi-stepper--vertical')).toBeTruthy()

          wrapper.setProps({vertical:false})
          expect(wrapper.find('.hi-stepper').hasClass('hi-stepper--horizontal')).toBeTruthy()
          expect(wrapper.find('.hi-stepper').hasClass('hi-stepper--vertical')).toBeFalsy()

      })

      // itemLayout
      it('up',()=>{
          const list = [
              {
                title: '账号信息',
                content: '请输入账号信息',
                icon:'111'
              },
              {
                title: '邮箱激活',
                content: '请输入邮箱',
              },
              {
                title: '信息登记',
                content: '请输入个人信息',
              },
            ]
          const wrapper = mount(<Stepper list={list} up/>)
          expect(wrapper.find('.hi-stepper__item--up')).toHaveLength(3)

          wrapper.setProps({up:false})
          expect(wrapper.find('.hi-stepper__item--up')).toHaveLength(0)

      })
  })
    
})