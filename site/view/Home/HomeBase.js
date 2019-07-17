import React from 'react'
import './style/index.scss'

const HomeBase = WrapperComponent => class extends WrapperComponent {
  constructor (props) {
    super(props)
    this.designContent = React.createRef()
    this.efficiencyContent = React.createRef()
    this.featureContent = React.createRef()

    this.state = {
      designContent: false,
      efficiencyContent: false,
      featureContent: false
    }

    this.scrollEvent = this.scrollEvent.bind(this)
  }

  componentDidMount () {
    this.scrollEvent()
    window.addEventListener('scroll', this.scrollEvent)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollEvent)
  }

  scrollEvent () {
    const mapList = [
      'designContent',
      'efficiencyContent',
      'featureContent'
    ]

    mapList.forEach(item => {
      if (this.isElementInViewport(this[item].current)) {
        this.setState({
          [item]: true
        })
      }
    })
  }

  isElementInViewport (el) {
    const box = el.getBoundingClientRect()
    const clientHeight = (window.innerHeight || document.documentElement.clientHeight)

    return box.top < clientHeight - clientHeight / 5
  }

  render () {
    return super.render()
  }
}

export default HomeBase
