import React from 'react'
import { connect } from 'react-redux'
import pages from '../../../pages'
import locales from '../../../locales'
import { globalSider } from '../../../redux/action/global'
import Icon from '../../../../components/icon'

import './style/index.scss'

class Component extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      anchors: [],
      footNavs: [],
      pre: '',
      next: '',
      page: ''
    }

    this.hashChangeEvent = this.hashChangeEvent.bind(this)
  }

  componentDidMount () {
    const sider = {
      items: this.getSiderItems()
    }
    globalSider(sider)

    this.getCurrentPage(() => {
      this.getAnchors()
      window.addEventListener('hashchange', this.hashChangeEvent)
    })

    this.collectNavs(() => {
      this.getSiblingNav()
    })
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.hashChangeEvent)
  }

  hashChangeEvent () {
    let routes = window.location.hash.split('/')
    if (routes[2] !== 'components') { return }

    // if (routes[1] !== window.localStorage.getItem('HIUI_LANGUAGE')) {
    //   this.setState({locale: routes[1]})
    // }

    window.scrollTo(0, 0)
    this.getCurrentPage()
    this.getAnchors()
    this.getSiblingNav()
  }

  getSiderName (key) {
    const map = locales[this.props.locale] || {}

    return key.split('.').reduce((a, b) => {
      const parent = map[a]
      if (b) {
        return (parent || {})[b]
      }

      return parent
    })
  }

  // 获取当前页面侧栏菜单
  getSiderItems () {
    const icons = [
      <span className='sider__icon-start' />,
      // <span className='sider__icon-principle' />,
      <span className='sider__icon-layout' />,
      <span className='sider__icon-vision' />,
      <Icon name='internet' />,
      <span className='sider__icon-component' />
    ]
    const siderDocuments = Object.keys(pages.documents).map((page, index) => {
      return {
        key: 'd' + index,
        title: this.getSiderName(`page.${page}`),
        to: `/${this.props.locale}/components/${page}`,
        icon: icons[index]
      }
    })

    let components = []
    Object.keys(pages.components).map((title, i) => {
      components.push({
        key: 'ct' + i,
        title: <span className='components-title'>{this.props.locale === 'en-US' ? locales[this.props.locale]['mini'][title] : title}</span>,
        to: '',
        noaction: true
      })

      Object.keys(pages.components[title]).map((page, j) => {
        components.push({
          key: 'cp' + i + '' + j,
          title: <span className='components-page'>{this.getSiderName(`page.${page}`)}</span>,
          to: `/${this.props.locale}/components/${page}`
        })
      })
    })

    return [].concat(siderDocuments, [{key: 'c', title: locales[this.props.locale]['misc']['components'], to: '', children: components, icon: icons[icons.length - 1]}])
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
    const index = footNavs.indexOf(this.state.page)
    const pre = footNavs[index - 1] ? footNavs[index - 1] : ''
    const next = footNavs[index + 1] ? footNavs[index + 1] : ''

    this.setState({pre, next})
  }

  // 收集所有导航
  collectNavs (fn) {
    const components = Object.keys(pages.components).map(group => {
      return Object.keys(pages.components[group]).map(page => page)
    })

    const documents = Object.keys(pages.documents).map(page => page)
    const footNavs = [].concat(...documents, ...components)

    this.setState({footNavs}, fn)
  }

  getCurrentPage (fn) {
    let routes = window.location.hash.split('/')
    // if (!routes) {
    //   window.location.hash = `#/${this.props.locale}/components/quick-start`
    // }
    let page = routes[3] ? routes[3] : 'quick-start'

    this.setState({ page }, fn)
  }

  getComponent (page) {
    const {
      theme,
      locale
    } = this.props

    this.components =
      this.components ||
      Object.assign(
        Object.values(pages.components).reduce((a, b) => {
          return Object.assign(a, b)
        }, {}),
        pages.documents
      )
    // 控制markdown显示隐藏
    const currentPage = this.components[page]
    if (currentPage) {
      return React.createElement(currentPage.default, { theme, locale })
    }
  }

  render () {
    const {
      pre,
      next,
      anchors
    } = this.state
    return (
      <div className='component'>
        <div className='home-container'>
          <div className='markdown-content' id='markdown-content'>
            {this.getComponent(this.state.page)}
          </div>

          <div className='foot-nav clearfix'>
            <a
              className={`pre ${pre ? '' : 'none'}`}
              href={pre ? `#/${this.props.locale}/components/${pre}` : ''}
            >
              {pre ? `${this.getSiderName(`page.${pre}`)}` : ''}
            </a>
            <a
              className={`next ${next ? '' : 'none'}`}
              href={next ? `#/${this.props.locale}/components/${next}` : ''}
            >
              {next ? `${this.getSiderName(`page.${next}`)}` : ''}
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
  locale: state.global.locale
}))(Component)
