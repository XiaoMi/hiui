import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import './style/index.scss'

class Component extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchors: [],
      footNavs: [],
      pre: '',
      next: '',
      page: '',
      cComponent: null,
      topNav: 'docs',
      activeAnchor: ''
    }
    this.contentRef = React.createRef()
  }
  componentDidUpdate(prevProps) {
    window.scrollTo(0, 0)
  }
  componentDidMount() {
    this.getCurrentPage(() => {
      this.setState(
        {
          cComponent: this.getComponent(this.state.page)
        },
        () => {
          this.getAnchors()
          const anchorsDOM = document.querySelectorAll('#markdown-content > div > h2')
          const anchorsDOMList = [].slice.call(anchorsDOM)
          anchorsDOMList.map((v, i) => {
            v.id = v.innerHTML

            render(
              <span>
                {v.innerHTML}
                <a
                  href={'#' + v.innerHTML}
                  onClick={() => {
                    this.setActiveAnchor(v.id)
                  }}
                >
                  <i className="hi-icon icon-maodian" />
                </a>
              </span>,
              v
            )
          })
          if (window.location.hash) {
            const activeAnchor = decodeURI(window.location.hash.split('#')[1])
            this.setActiveAnchor(activeAnchor)
          }
        }
      )
    })

    this.collectNavs(() => {
      this.getSiblingNav()
    })
  }
  setActiveAnchor = id => {
    this.setState({ activeAnchor: id })
  }
  getAnchors() {
    const anchorsDOM = document.querySelectorAll('#markdown-content h2')
    const anchorsDOMList = [].slice.call(anchorsDOM)
    const anchors = anchorsDOMList.map((v, i) => {
      return { id: v.id, text: anchorsDOM[i].innerHTML }
    })

    this.setState({ anchors })
  }

  getSiblingNav() {
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
    this.setState({ pre, next })
  }

  // 收集所有导航
  collectNavs(fn) {
    let footNavs = []
    let page = this.props.match.path.split('/')[3]
    footNavs = this.props[page] || {}
    this.setState({ footNavs, topNav: page }, fn)
  }

  getCurrentPage(fn) {
    // TODO:这里可能要修改
    let page = this.props.match.path.split('/')[4]
    page = page || 'quick-start'
    this.setState({ page }, fn)
  }

  getComponent(page) {
    const { theme, locale } = this.props
    // 控制markdown显示隐藏
    const currentPage = this.props.allComponents[this.state.topNav][page]
    if (currentPage) {
      const el = React.createElement(currentPage.default || currentPage, {
        theme,
        locale
      })
      return el
    }
  }

  render() {
    const { pre, next, anchors, cComponent, topNav, activeAnchor } = this.state
    return (
      <div className="component">
        <div className="home-container">
          <div className="markdown-content article" id="markdown-content">
            {cComponent}
          </div>

          <div className="foot-nav clearfix">
            <a
              className={`pre ${pre.to ? '' : 'none'}`}
              href={pre.to ? `/hiui/${this.props.locale}/${topNav}/${pre.to}` : ''}
            >
              {pre.text ? pre.text : ''}
            </a>
            <a
              className={`next ${next.to ? '' : 'none'}`}
              href={next.to ? `/hiui/${this.props.locale}/${topNav}/${next.to}` : ''}
            >
              {next.text ? next.text : ''}
            </a>
          </div>
        </div>

        <div className="anchor">
          <ul>
            {anchors.map((v, i) => (
              <li key={i} className={activeAnchor === v.text ? 'active' : ''}>
                <a
                  href={'#' + v.text}
                  onClick={() => {
                    this.setActiveAnchor(v.text)
                  }}
                >
                  {v.text}
                </a>
              </li>
            ))}
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
  templates: state.global.templatesNavs,
  docs: state.global.componentsNavs,
  allComponents: state.global.components
}))(Component)
