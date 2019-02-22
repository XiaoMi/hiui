import React from 'react'
import './style/index.scss'

const HomeBase = WrapperComponent => class extends WrapperComponent {
  constructor (props) {
    super(props)
    this.designText = React.createRef()
    this.designList = React.createRef()
    this.efficiencyText = React.createRef()

    this.excelText = React.createRef()
    this.excelList = React.createRef()

    this.state = {
      designText: false,
      designList: false,
      efficiencyText: false,
      excelText: false,
      excelList: false
    }

    // this.hashChangeEvent = this.hashChangeEvent.bind(this)
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
      'designText',
      'designList',
      'efficiencyText',
      'excelText',
      'excelList'
    ]

    mapList.forEach(item => {
      if (this.isElementInViewport(this[item].current)) {
        this.setState({
          [item]: true
        })
      }
    })
  }

  isElementInViewport (el, offset = 0) {
    const box = el.getBoundingClientRect()

    const top = (box.top >= 0)
    const bottom = (box.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset)
    return (top && bottom)
  }

  render () {
    return super.render()
  }
}

export default HomeBase
