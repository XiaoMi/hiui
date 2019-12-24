import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import Carousel from '../index'

describe("Carousel",()=>{
    
    let clock

    beforeEach(() => {
      clock = sinon.useFakeTimers()
    })

    afterEach(() => {
      clock.restore()
    })

    const data = [1,2,3,4,5,6,7]

    describe('lifeCycle',()=>{

        it('componentDidmount',()=>{
            const wrapper = mount(<Carousel
                defaultActive={0}
                duration={300}
              >
                {
                  data.map((item,index) => {
                  return <div key={index}>{item}</div>
                  })
                }
              </Carousel>)
            expect(wrapper.find('.hi-carousel')).toHaveLength(1)
            wrapper.find('.hi-carousel').simulate('mouseover')
            clock.tick(310)
            expect(wrapper.state("active")).toEqual(0)
            expect(wrapper.state("showArrow")).toEqual(true)
            wrapper.find('.hi-carousel').simulate('mouseout')
            clock.tick(310)
            expect(wrapper.state("active")).toEqual(1)
            expect(wrapper.state("showArrow")).toEqual(false)
        })

        it('componentWillUnmount',()=>{
          const wrapper = mount(<Carousel
              defaultActive={0}
              duration={300}
            >
              {
                data.map((item,index) => {
                return <div key={index}>{item}</div>
                })
              }
            </Carousel>)
            wrapper.instance().componentWillUnmount()
            clock.tick(310)
            expect(wrapper.state("active")).toEqual(0)
              
      })
    })

    describe('props',()=>{
      
      it('duration',()=>{
        const wrapper = mount(<Carousel duration={300}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Carousel>)
        clock.tick(310)
        expect(wrapper.state("active")).toEqual(1)
        clock.tick(300)
        expect(wrapper.state("active")).toEqual(2)
      })

      it('showDots',()=>{
        const wrapper = mount(<Carousel>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </Carousel>)
        expect(wrapper.find('.hi-carousel__dots')).toHaveLength(1)
        wrapper.find('.hi-carousel__dot').at(3).simulate('click')
        expect(wrapper.state("active")).toEqual(3)
        wrapper.setProps({showDots:false})
        expect(wrapper.find('.hi-carousel__dots')).toHaveLength(0)

      })

      it('showArrows',()=>{
        const wrapper = mount(<Carousel>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Carousel>)
        expect(wrapper.find('.hi-carousel__arrows')).toHaveLength(1)
        wrapper.setProps({showArrows:false})
        expect(wrapper.find('.hi-carousel__arrows')).toHaveLength(0)
      })

      it('defaultActive',()=>{
        const wrapper = mount(<Carousel defaultActive={0}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Carousel>)
        expect(wrapper.find('.hi-carousel__arrows')).toHaveLength(1)
        expect(wrapper.state("active")).toEqual(0)

        wrapper.setProps({defaultActive:-1})
        expect(wrapper.state("active")).toEqual(0)

        wrapper.setProps({defaultActive:3})
        expect(wrapper.state("active")).toEqual(0)
        
        wrapper.find('.hi-carousel__arrow').first().simulate('click')
        expect(wrapper.state("active")).toEqual(2)

        wrapper.find('.hi-carousel__arrow').last().simulate('click')
        expect(wrapper.state("active")).toEqual(0)
      })

    })
})