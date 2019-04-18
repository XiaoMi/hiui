import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Tooltip from '../'
import Button from '../../button'

describe('Tooltip', () => {
  it('renders correctly', () => {
    const wrapper = renderer.create(
      <div>
        <Tooltip title="tooltip top" style={{margin: '0 10px'}}><Button type="line">Tooltip Top</Button></Tooltip>
        <Tooltip title="tooltip right" style={{margin: '0 10px'}} placement="right"><Button type="success">Tooltip Right</Button></Tooltip>
        <Tooltip title="tooltip bottom" style={{margin: '0 10px'}} placement="bottom"><Button type="warning">Tooltip Bottom</Button></Tooltip>
        <Tooltip title="tooltip left" style={{margin: '0 10px'}} placement="left"><Button type="danger">Tooltip Left</Button></Tooltip>
      </div>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should show overlay when trigger is hovered', () => {
    const wrapper = mount(
      <Tooltip title="tooltip top" style={{margin: '0 10px'}}><Button type="line">Tooltip Top</Button></Tooltip>
    )
    wrapper.find('.hi-tooltip').simulate('mouseenter')
    expect(document.querySelectorAll('.hi-popper__container')).toHaveLength(1)
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(0)
    wrapper.find('.hi-tooltip').simulate('mouseleave')
    expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1)
  })
})
