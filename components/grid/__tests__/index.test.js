import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import sinon, { fake, spy } from 'sinon'
import simulant from 'simulant'
import Grid from '../index'
/* eslint-env jest */
describe('Grid', () => {
  describe('Row&Col.PropTypes', () => {
    it('gutter', () => {
      const Row = Grid.Row
      const Col = Grid.Col
      const wrapper = mount(
        <Row gutter>
          <Col span={12}>div</Col>
          <Col span={12}>div</Col>
        </Row>
      )
      expect(wrapper.find('.hi-grid__row').hasClass('hi-grid__row--gutter')).toBeTruthy()
    })
    it('span', () => {
      const Row = Grid.Row
      const Col = Grid.Col
      const wrapper = mount(
        <Row>
          <Col>div</Col>
          <Col span={4}>div</Col>
          <Col span={8}>div</Col>
          <Col span={12}>div</Col>
        </Row>
      )
      expect(wrapper.find('.hi-grid__col-4')).toHaveLength(1)
      expect(wrapper.find('.hi-grid__col-8')).toHaveLength(1)
      expect(wrapper.find('.hi-grid__col-12')).toHaveLength(1)
    })
    it('offset', () => {
      const Row = Grid.Row
      const Col = Grid.Col
      const wrapper = mount(
        <Row>
          <Col span={3}>div</Col>
          <Col span={8}>div</Col>
          <Col span={4} offset={4}>div</Col>
        </Row>
      )
      expect(wrapper.find('.hi-grid__col-3')).toHaveLength(1)
      expect(wrapper.find('.hi-grid__col-8')).toHaveLength(1)
      expect(wrapper.find('.hi-grid__col-4').hasClass('hi-grid__offset-4')).toBeTruthy()
    })
    it('justify', () => {
      const Row = Grid.Row
      const Col = Grid.Col
      const wrapper = mount(
        <div>
          <Row justify='center'>
            <Col span={3} justify='flex-start'>div</Col>
            <Col span={8}>div</Col>
            <Col span={4} offset={4}>div</Col>
          </Row>
          <Row justify='space-between'>
            <Col span={3}>div</Col>
            <Col span={8}>div</Col>
            <Col span={4} offset={4}>div</Col>
          </Row>
        </div>
      )
      expect(window.getComputedStyle(wrapper.find('.hi-grid__row').first().getDOMNode()).getPropertyValue('justify-content')).toEqual('center')
      expect(window.getComputedStyle(wrapper.find('.hi-grid__row').at(1).getDOMNode()).getPropertyValue('justify-content')).toEqual('space-between')
      expect(window.getComputedStyle(wrapper.find('.hi-grid__col-3').at(0).getDOMNode()).getPropertyValue('justify-content')).toEqual('flex-start')
    })
  })

  describe('Br', () => {
    const Row = Grid.Row
    const Col = Grid.Col
    const Br = Grid.Br
    const wrapper = mount(
      <div>
        <Row>
          <Col span={3}>div</Col>
        </Row>
        <Br />
        <Row>
          <Col span={3}>div</Col>
        </Row>
      </div>
    )
    expect(wrapper.containsAnyMatchingElements([<Br />])).toBeTruthy()
  })
})
