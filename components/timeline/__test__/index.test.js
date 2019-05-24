import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Timeline from '../'

const datas = [{
  groupTitle: '2月',
  children: [{
    title: 'Title - 1',
    description: 'Here are some descriptions',
    timestamp: '10:00',
    extraTime: '02-23'
  }, {
    dot: 'circle',
    title: 'Title 2',
    description: 'Here are some descriptions',
    timestamp: '10:00',
    extraTime: '02-27'
  }]
}, {
  groupTitle: '3月',
  children: [{
    dot: 'circle',
    title: 'Title 3',
    description: 'Here are some descriptions',
    timestamp: '12:00',
    extraTime: '03-02'
  }, {
    dot: 'circle',
    title: 'Title 4',
    description: 'Here are some descriptions',
    timestamp: '11:00',
    extraTime: '03-10'
  }]
}]

describe('Timeline', () => {
  it('renders correctly', () => {
    const wrapper = renderer.create(
      <div>
        <Timeline />
      </div>
    )
    expect(wrapper).toMatchSnapshot()
  })
})
