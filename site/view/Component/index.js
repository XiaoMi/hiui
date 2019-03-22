import React from 'react'
import { connect } from 'react-redux'
import './style/index.scss'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      anchors: [],
      footNavs: [],
      pre: '',
      next: '',
      page: '',
      cComponent: null,
      topNav: 'docs'
    }
    this.hashChangeEvent = this.hashChangeEvent.bind(this)
  }

  componentDidMount () {
    window.scrollTo(0, 0)
    this.getCurrentPage(() => {
      this.getAnchors()
      this.setState({
        cComponent: this.getComponent(this.state.page)
      })
    })

    this.collectNavs(() => {
      this.getSiblingNav()
    })
  }
  hashChangeEvent () {
    let routes = window.location.hash.split('/')
    if (routes[2] !== 'docs') { return }
    window.scrollTo(0, 0)
    this.getCurrentPage()
    this.getAnchors()
    this.getSiblingNav()
  }

  getAnchors () {
    const anchorsDOM = document.getElementById('markdown-content').getElementsByTagName('h3')
    const anchorsDOMList = [].slice.call(anchorsDOM)

    const anchors = anchorsDOMList.map((v, i) => {
      const id = 'component-anchors-' + i
      anchorsDOM[i].id = id
      return {id, text: anchorsDOM[i].innerHTML}
    })

    this.setState({anchors})
  }

  getSiblingNav () {
    const footNavs = this.state.footNavs
    const tempArr = Object.keys(footNavs)
    const index = tempArr.indexOf(this.state.page)
    const pre = {
      to: tempArr[index - 1],
      text: footNavs[tempArr[index - 1]] ? footNavs[tempArr[index - 1]] : ''
    }
    const next = {
      to: tempArr[index + 1],
      text: footNavs[tempArr[index + 1]] ? footNavs[tempArr[index + 1]] : ''
    }
    this.setState({pre, next})
  }

  // 收集所有导航
  collectNavs (fn) {
    let footNavs = []
    let page = this.props.match.path.split('/')[2]
    footNavs = this.props[page] || {}
    this.setState({footNavs, topNav: page}, fn)
  }

  getCurrentPage (fn) {
    let page = this.props.match.path.split('/')[3]
    page = page || 'quick-start'
    this.setState({ page }, fn)
  }

  getComponent (page) {
    const {
      theme,
      locale
    } = this.props
    // 控制markdown显示隐藏
    const currentPage = this.props.allComponents[this.state.topNav][page]
    if (currentPage) {
      const el = React.createElement(currentPage.default || currentPage, { theme, locale })
      return el
    }
  }

  render () {
    const {
      pre,
      next,
      anchors,
      cComponent,
      topNav
    } = this.state
    return (
      <div className='component'>
        <div className='home-container'>
          <div className='markdown-content' id='markdown-content'>
            {cComponent}
          </div>

          <div className='foot-nav clearfix'>
            <a
              className={`pre ${pre.to ? '' : 'none'}`}
              href={pre.to ? `#/${this.props.locale}/${topNav}/${pre.to}` : ''}
            >
              {pre.text ? pre.text : ''}
            </a>
            <a
              className={`next ${next.to ? '' : 'none'}`}
              href={next.to ? `#/${this.props.locale}/${topNav}/${next.to}` : ''}
            >
              {next.text ? next.text : ''}
            </a>
          </div>
        </div>

        <div className='anchor'>
          <ul>
            {
              anchors.map((v, i) => (
                <li key={i}>
                  <a
                    onClick={() => {
                      const target = document.querySelector(`#${v.id}`)

                      if (target) {
                        target.scrollIntoView({ block: 'start', behavior: 'smooth' })
                      }
                    }}
                  >
                    {v.text}
                  </a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  sider: state.global.sider,
  theme: state.global.theme,
  locale: state.global.locale,
  designs: state.global.designNavs,
  docs: state.global.componentsNavs,
  allComponents: state.global.components
}))(Component)
