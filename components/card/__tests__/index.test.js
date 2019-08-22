import React from 'react'
import { mount } from 'enzyme'
import Card from '../'

describe('Card', () => {
  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      const wrapper = mount(<Card />)

      expect(wrapper.instance()).toBeInstanceOf(Card)

      expect(wrapper.find(`.hi-card`)).toHaveLength(1)
    })
  })

  describe('PropTypes', () => {
    it('type', () => {
      const types = [
        'simple',
        'default'
      ]

      const wrapper = mount(
        <div>
          { types.map((type, index) => <Card {...{type}} key={`${type}-${index}`} />) }
        </div>
      )

      expect(wrapper.find(`.hi-card`)).toHaveLength(2)
      expect(wrapper.find(`.hi-card__content--simple`)).toHaveLength(1)
    })

    it('extraType', () => {
      const extraTypes = [
        'hover',
        'default'
      ]

      const wrapper = mount(
        <div>
          { extraTypes.map((extraType, index) => <Card {...{extraType}} key={`${`extraType`}-${index}`} />) }
        </div>
      )

      const firstCard = wrapper.find(Card).first()

      expect(firstCard.state().extraShow).toBeFalsy()

      firstCard.find('.hi-card').simulate('mouseenter')
      expect(firstCard.state().extraShow).toBeTruthy()

      firstCard.find('.hi-card').simulate('mouseleave')
      expect(firstCard.state().extraShow).toBeFalsy()
    })

    // NOTE 将要废弃 添加 it.skip
    it('extraShow', () => {
      const extraShows = [
        'hover',
        'stay'
      ]

      const wrapper = mount(
        <div>
          { extraShows.map((extraShow, index) => <Card {...{extraShow}} key={`${`extraShow`}-${index}`} />) }
        </div>
      )

      const firstCard = wrapper.find(Card).first()

      expect(firstCard.state().extraShow).toEqual(false)

      firstCard.find('.hi-card').simulate('mouseenter')
      expect(firstCard.state().extraShow).toEqual(true)

      firstCard.find('.hi-card').simulate('mouseleave')
      expect(firstCard.state().extraShow).toEqual(false)
    })

    // NOTE 将要废弃 添加 it.skip
    it('disabled', () => {
      const wrapper = mount(
        <Card disabled={true} />
      )

      expect(wrapper.find(`.hi-card--disabled`)).toHaveLength(1)
    })

    it('children', () => {
      const Children = function () {
        return <div>children</div>
      }

      const wrapper = mount(
        <Card><Children /></Card>
      )

      expect(wrapper.find(Children)).toHaveLength(1)
    })

    it('content', () => {
      const content = 'custom-content'

      const wrapper = mount(
        <Card cover={<div />} {...{content}} />
      )

      expect(wrapper.text()).toEqual(expect.stringContaining(content))
    })

    // NOTE 将要废弃 添加 it.skip
    it('description', () => {
      const description = 'custom-description'

      const wrapper = mount(
        <Card cover={<div />} {...{description}} />
      )

      expect(wrapper.text()).toEqual(expect.stringContaining(description))
    })

    it('coverUrl', () => {
      const coverUrl = 'custom-coverUrl'

      const wrapper = mount(
        <Card {...{coverUrl}} />
      )

      expect(wrapper.find('img').prop('src')).toEqual(coverUrl)
    })

    it('cover', () => {
      const cover = <div className='cover-class' />

      const wrapper = mount(
        <Card {...{cover}} />
      )

      expect(wrapper.find(`.cover-class`)).toHaveLength(1)
    })

    it('extra', () => {
      const extras = [
        <img className='extra-element-class' />,
        'extra-string',
        [
          <i className='extra-array-element' key='extra-array-element' />,
          'extra-array-string'
        ]
      ]

      const wrapper = mount(
        <div>
          { extras.map((extra, index) => <Card {...{extra}} key={`${`extra`}-${index}`} />) }
        </div>
      )

      expect(wrapper.find(`.extra-element-class`)).toHaveLength(1)
      expect(wrapper.find(`.extra-array-element`)).toHaveLength(1)

      expect(wrapper.text()).toEqual(expect.stringContaining('extra-string'))
      expect(wrapper.text()).toEqual(expect.stringContaining('extra-array-string'))
    })

    it('title', () => {
      const titles = [
        <img className='title-element-class' />,
        'title-string'
      ]

      const wrapper = mount(
        <div>
          { titles.map((title, index) => <Card {...{title}} key={`${`title`}-${index}`} />) }
        </div>
      )

      expect(wrapper.find(`.title-element-class`)).toHaveLength(1)

      expect(wrapper.text()).toEqual(expect.stringContaining('title-string'))
    })

    it('hoverable', () => {
      const wrapper = mount(
        <Card hoverable={true} />
      )

      expect(wrapper.find(`.hi-card--hover`)).toHaveLength(1)
    })

    it('size', () => {
      const sizes = [
        'small',
        'default',
        'large'
      ]

      const wrapper = mount(
        <div>
          { sizes.map((size, index) => <Card type='simple' {...{size}} key={`${`size`}-${index}`} />) }
        </div>
      )

      expect(wrapper.find(`.hi-card--small`)).toHaveLength(1)
      expect(wrapper.find(`.hi-card--middle`)).toHaveLength(1)
      expect(wrapper.find(`.hi-card--large`)).toHaveLength(1)
    })

    it('style', () => {
      const style = {
        color: '#ffff00'
      }
      const wrapper = mount(
        <Card {...{style}} />
      )

      expect(wrapper.find(`.hi-card`).prop('style')).toMatchObject(style)
    })
  })
})


