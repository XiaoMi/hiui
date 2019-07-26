import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import { fake } from 'sinon'
import Button from '../'
import Icon from '../../icon'
import IconLoading from '../IconLoading'

describe('Button', () => {
  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      const wrapper = mount(<Button />)

      expect(wrapper.instance()).toBeInstanceOf(Button)

      expect(wrapper.find(`button`)).toHaveLength(1)
    })
  })

  describe('PropTypes', () => {
    it('type', () => {
      const types = [
        'primary',
        'line',
        'success',
        'danger',
        'default',
        'warning',
        'info'
      ]

      const wrapper = mount(
        <div>
          { types.map((type, index) => <Button {...{type}} key={`${type}-${index}`} />) }
        </div>
      )

      types.map((type) => expect(wrapper.find(`button.hi-btn--type--${type}`)).toHaveLength(1))
    })

    it('size', () => {
      const sizes = [
        'large',
        'small',
        'normal'
      ]

      const wrapper = mount(
        <div>
          { sizes.map((size, index) => <Button {...{size}} key={`${size}-${index}`} />) }
        </div>
      )

      sizes.map((size) => expect(wrapper.find(`button.hi-btn--size--${size}`)).toHaveLength(1))
    })

    it('appearance', () => {
      const appearances = [
        'link',
        'button',
        'line'
      ]

      const wrapper = mount(
        <div>
          { appearances.map((appearance, index) => <Button {...{appearance}} key={`${appearance}-${index}`} />) }
        </div>
      )

      appearances.map((appearance) => expect(wrapper.find(`button.hi-btn--appearance--${appearance}`)).toHaveLength(1))
    })

    it('theme', () => {
      const theme = 'custom-theme'

      const wrapper = mount(
        <Button {...{theme}} />
      )

      expect(wrapper.find(`button.theme__${theme}`)).toHaveLength(1)
    })

    it('icon', () => {
      const icon = 'custom-icon'

      const wrapper = mount(
        <Button {...{icon}} />
      )

      expect(wrapper.find(Icon)).toHaveLength(1)
    })

    it('loading', () => {
      const wrapper = mount(
        <Button loading={true} />
      )

      expect(wrapper.find(IconLoading)).toHaveLength(1)
    })

    it('className', () => {
      const className = 'test-class'
      const wrapper = mount(
        <Button {...{className}} />
      )

      expect(wrapper.find(`button.${className}`)).toHaveLength(1)
    })

    it('style', () => {
      const style = {
        color: '#ffff00'
      }
      const wrapper = mount(
        <Button {...{style}} />
      )

      expect(wrapper.find(`button`).prop('style')).toMatchObject(style)
    })

    it('disabled', () => {
      const wrapper = mount(
        <Button disabled={true} />
      )

      expect(wrapper.find(`button.hi-btn--disabled`)).toHaveLength(1)
    })

    it('href', () => {
      const href = 'https://www.mi.com'
      const wrapper = mount(
        <Button {...{href}} />
      )

      expect(wrapper.find(`a`).prop('href')).toEqual(expect.stringMatching(href))
    })

    // FIXME 源码 target 有遗漏
    it('target', () => {
      const targets = [
        '_self',
        '_blank',
        '_parent',
        '_top'
      ]
      const href = 'https://www.mi.com'
      const wrapper = mount(
        <div>
          { targets.map((target, index) => <Button {...{target, href}} key={`${target}-${index}`} />) }
        </div>
      )

      targets.map((target, index) => expect(wrapper.find(`a`).at(index).prop('target')).toEqual(expect.stringMatching(target)))
    })

    it('children', () => {
      const Children = function () {
        return <div>children</div>
      }

      const wrapper = mount(
        <Button><Children /></Button>
      )

      expect(wrapper.find(Children)).toHaveLength(1)
    })

    it('onClick', () => {
      const callback = fake()
      const wrapper = mount(
        <Button onClick={callback} />
      )

      wrapper.find('button').first().simulate('click')
      expect(callback.callCount).toEqual(1)
    })
  })

  describe('Branch', () => {
    it('props: icon && children', () => {
      const icon = 'custom-icon'
      const children = 'children'
      const wrapper = mount(
        <Button {...{icon}}>
          {children}
        </Button>
      )

      expect(wrapper.find(Icon)).toHaveLength(1)
      expect(wrapper.text()).toEqual(expect.stringContaining(children))
    })

    it('props: type && appearance', () => {
      const props = {
        type: 'primary',
        appearance: 'line'
      }
      const wrapper = mount(<Button {...props} />)

      expect(wrapper.find(`button.hi-btn--type--line`)).toHaveLength(1)
    })
  })
})

describe('ButtonGroup', () => {
  const Children = () => (
    <Fragment>
      <Button type="primary">type0</Button>
      <Button type="line">type1</Button>
      <Button type="success">type2</Button>
      <Button type="danger">type3</Button>
      <Button type="default">type4</Button>
      <Button type="warning">type5</Button>
      <Button type="info">type6</Button>
    </Fragment>
  )

  describe('Lifecycle', () => {
    it('componentDidMount', () => {
      const wrapper = mount(
        <Button.Group>
          <Children />
        </Button.Group>
      )

      expect(wrapper.instance()).toBeInstanceOf(Button.Group)

      expect(wrapper.find(`.hi-btn-group`)).toHaveLength(1)
    })
  })
})
