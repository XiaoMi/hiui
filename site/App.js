/* global localStorage, location */
import React, { Component } from 'react'
import './styles/page/index.scss'

import locales from './locales'
import pages from './pages'
import Dropdown from '../components/dropdown'

const req = require.context('../components', true, /^\.\/[^_][\w-]+\/style\/index\.js?$/)

req.keys().forEach((mod) => {
  let v = req(mod)
  if (v && v.default) {
    v = v.default
  }
  // console.log(mod, 'this is mod')
  // console.log(v, 'this is v')
  // const match = mod.match(/^\.\/([^_][\w-]+)\/index\.js?$/)
  // console.log(match, 'this is match')
})

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      anchors: [],
      footNavs: [],
      pre: '',
      next: '',
      theme: 'default',
      locale: 'zh-CN',
      themes: [
        {
          title: '默认',
          value: 'default',
          prefix: <i className='theme-icon default' />
        },
        {
          title: '经典',
          value: 'classics',
          prefix: <i className='theme-icon classics' />
        }
      ],
      locales: [
        {
          title: '中文',
          value: 'zh-CN'
        },
        {
          title: 'English',
          value: 'en-US'
        }
      ]
    }
  }

  static markdown

  componentWillMount () {
    this.setPage(() => {
      window.addEventListener(
        'hashchange',
        () => {
          window.scrollTo(0, 0)
          this.setPage()
          this.getAnchors()
          this.getSiblingNav()
        },
        false
      )

      this.traverse(() => {
        this.getSiblingNav()
      })
    })
  }

  componentDidMount () {
    this.getAnchors()

    if (!this.state.locale) {
      this.setLocale(localStorage.getItem('HIUI_LANGUAGE') || 'zh-CN')
    }
    this.setTheme(localStorage.getItem('HIUI_THEME') || 'default')
  }
  // 切换中英文文档
  // componentDidUpdate(props, state) {
  //   if (state.locale != this.state.locale) {
  //     switch(this.state.locale) {
  //       case 'en-US':
  //         i18n.use(en); break;
  //       default:
  //         i18n.use(zh); break;
  //     }
  //   }
  // }
  setLocale (locale) {
    window.location.hash = `/${locale}/${this.state.page}`
  }
  setTheme (theme) {
    this.setState({theme}, () => {
      localStorage.setItem('HIUI_THEME', this.state.theme)
    })
  }

  getLocale (key) {
    const map = locales['zh-CN'] || {}

    return key.split('.').reduce((a, b) => {
      const parent = map[a]
      if (b) {
        return (parent || {})[b]
      }

      return parent
    })
  }

  getPage () {
    const routes = location.hash.match(/(?:\/(.+))?\/(.+)/)

    if (routes) {
      if (locales.hasOwnProperty(routes[1])) {
        this.setState({ locale: routes[1] }, () => {
          localStorage.setItem('HIUI_LANGUAGE', this.state.locale)
        })
      }

      return routes[2]
    } else {
      return 'quick-start'
    }
    // return default //打开默认页面
  }

  setPage (fn) {
    this.setState({ page: this.getPage() }, fn)
  }

  getComponent (page) {
    const { theme, locale } = this.state
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

    console.log('---index', index, this.state.page)
    const next = footNavs[index + 1] ? footNavs[index + 1] : ''

    console.log('---pre,next', pre, next)

    this.setState({pre, next})
  }

  // 收集所有导航
  traverse (fn) {
    const components = Object.keys(pages.components).map(group => {
      return Object.keys(pages.components[group]).map(page => page)
    })

    const documents = Object.keys(pages.documents).map(page => page)

    const footNavs = [].concat(...documents, ...components)

    this.setState({footNavs}, fn)
  }

  render () {
    const { anchors, pre, next } = this.state

    return (
      <div className='hiui-avicii'>
        <header className='header'>
          <div className='logo'>
            <div className='logo-img' />
            <span className='logo-desc'>HIUI DESIGN</span>
          </div>
          <div className='switches'>
            <Dropdown list={this.state.themes} title='主题' onClick={(val) => this.setTheme(val)} />
            <Dropdown list={this.state.locales} title='语言' onClick={(val) => this.setLocale(val)} />
          </div>
        </header>
        <div className='main'>
          <div className='side-nav'>
            <ul className='side'>
              <li className='nav-item'>
                <a className='sub-nav-title'>{this.getLocale('misc.development')}</a>
                <ul className='pure-menu-list'>
                  {Object.keys(pages.documents).map(page => {
                    return (
                      <li key={page} className={page === this.state.page ? 'nav-item-active nav-item' : 'nav-item'}>
                        <a href={`#/${this.state.locale}/${page}`}>{this.getLocale(`page.${page}`)}</a>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className='nav-item'>
                <a className='sub-nav-title'>{this.getLocale('misc.components')}</a>
                {Object.keys(pages.components).map(group => {
                  return (
                    <div className='nav-group' key={group}>
                      <div className='nav-group-title'>{group}</div>
                      <ul className='pure-menu-list'>
                        {Object.keys(pages.components[group]).map(page => {
                          return (
                            <li key={page} className={page === this.state.page ? 'nav-item nav-item-active' : 'nav-item'}>
                              <a href={`#/${this.state.locale}/${page}`}>
                                {this.getLocale(`page.${page}`)}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </li>
            </ul>
          </div>
          <div className='content'>
            <div className='markdown-content'
              id='markdown-content'
              ref={arg => { this.markdown = arg }}
            >
              {this.getComponent(this.state.page)}
            </div>

            <div
              className='foot-nav'
            >
              <a
                className={`pre ${pre ? '' : 'none'}`}
                href={pre ? `#/${this.state.locale}/${pre}` : ''}
              >
                {pre ? `${this.getLocale(`page.${pre}`)}` : ''}
              </a>
              <a
                className={`next ${next ? '' : 'none'}`}
                href={next ? `#/${this.state.locale}/${next}` : ''}
              >
                {next ? `${this.getLocale(`page.${next}`)}` : ''}
              </a>
            </div>
          </div>

          <div
            className='anchor'
          >
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
        {/* <footer className='footer'>
          <div className='footer-col'>
            <h3>资源</h3>
            <ul>
              <li>
                <a href='#' target='_blank'>HIUI LIbrary</a>
              </li>
              <li>
                <a href='#' target='_blank'>HIUI Components</a>
              </li>
              <li>
                <a href='#' target='_blank'>HIUI Components</a>
              </li>
            </ul>
          </div>

          <div className='footer-col'>
            <h3>社区</h3>
            <ul>
              <li>
                <a href='https://www.github.com' target='_blank'>Github</a>
              </li>
              <li>
                <a href='https://juejin.im' target='_blank'>掘金</a>
              </li>
              <li>
                <a href='https://www.zhihu.com' target='_blank'>知乎</a>
              </li>
              <li>
                <a href='https://www.segmentfault.com' target='_blank'>SegmentFault</a>
              </li>
            </ul>
          </div>

          <div className='footer-col'>
            <h3>常见问题</h3>
            <ul>
              <li>
                <a href='#' target='_blank'>更新时间</a>
              </li>
              <li>
                <a href='#' target='_blank'>常见Bug</a>
              </li>
              <li>
                <a href='#' target='_blank'>讨论列表</a>
              </li>
              <li>
                <a href='#' target='_blank'>SegmentFault</a>
              </li>
            </ul>
          </div>
        </footer> */}
      </div>
    )
  }
}

export default App
