import React from 'react'
import { mount } from 'enzyme'
import Tooltip from '../index'
import Button from '../../button'
class Foo extends React.Component {
  render() {
    return (
      <div>
        <span ref="tooltipTargetref">First</span>
      </div>
    );
  }
}
describe('Tooltip', () => {
    beforeAll(() => {
      jest.useFakeTimers()
    })
    afterAll(() => {
      jest.useRealTimers()
    })
  
    describe('PropTypes', () => {
      it('title',()=>{
            expect(document.querySelectorAll('hi-tooltip__popper')).toHaveLength(0)
            const title ='tooltip top'
            const wrapper = mount(
                <Tooltip title={title}>
                    <Button type="line">Tooltip Top</Button>
                </Tooltip>
            )
            wrapper.find('.hi-tooltip').simulate('mouseenter')
            expect(document.querySelectorAll('.hi-tooltip-top')).toHaveLength(1)
            expect(document.querySelector('.hi-tooltip-top').textContent).toEqual('tooltip top')
            wrapper.find('.hi-tooltip').simulate('mouseleave')
            expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
            wrapper.find('.hi-tooltip').simulate('click')
            expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
            wrapper.unmount()
        })
        it('placement',()=>{
         
          const rightTootip = mount(
              <Tooltip title="tooltip right" style={{margin: '0 10px'}} placement="right" >
              <Button type="success" disabled>Tooltip Right</Button>
            </Tooltip>
          )
          const bottomTootip = mount(
              <Tooltip title="tooltip bottom" style={{margin: '0 10px'}} placement="bottom">
                <Button type="warning">Tooltip Bottom</Button>
              </Tooltip>
          )
          const leftTootip = mount(
              <Tooltip title="tooltip left" style={{margin: '0 10px'}} placement="left">
                <Button type="danger">Tooltip Left</Button>
              </Tooltip>
          )
          rightTootip.find('.hi-tooltip').simulate('mouseenter')
          bottomTootip.find('.hi-tooltip').simulate('mouseenter')
          leftTootip.find('.hi-tooltip').simulate('mouseenter')

          expect(document.querySelectorAll('.hi-tooltip-right')).toHaveLength(1)
          expect(document.querySelectorAll('.hi-tooltip-bottom')).toHaveLength(1)
          expect(document.querySelectorAll('.hi-tooltip-left')).toHaveLength(1)
          rightTootip.unmount()
          bottomTootip.unmount()
          leftTootip.unmount()
        })
        it('visible',()=>{
          const title ='tooltip top'
          const fn = (bol) => !bol
          const wrapper = mount(
              <Tooltip title={title} visible={fn(false)}>
                  <Button type="line">Tooltip Top</Button>
              </Tooltip>
          )
          wrapper.find('.hi-tooltip').simulate('mouseenter')
          wrapper.find('.hi-tooltip').simulate('mouseleave')
          expect(document.querySelectorAll('.hi-tooltip-top')).toHaveLength(1)
          expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(0)
          wrapper.unmount()
        })
        it('Methods',()=>{
          const wrapper = mount(
              <Foo/>
          )
          const title = 'title'
          const placement = 'right'
          const key = 'key'
          Tooltip.open(wrapper.ref('tooltipTargetref'),{title,placement,key})
          expect(document.querySelectorAll('.hi-tooltip-right')).toHaveLength(1)
          expect(document.querySelector('.hi-tooltip-right').textContent).toEqual('title')
          Tooltip.close(key)
          const key2 = 'key2'

          expect(document.querySelectorAll('.hi-tooltip-right')).toHaveLength(0)
          Tooltip.open(<Foo/>,{title,placement,key2}).close()
          
          
        })
      })
})