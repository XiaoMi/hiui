import React from 'react'
import Header from './Component/Header'
import { connect } from 'react-redux'
import routes from './routes'
import { Classic as Page, Logo, History } from '@hi-ui/classic-theme'
import locales from '../locales'
import designs from '../pages/designs'
import pages from '../pages/components'
import docs from '../pages/docs'
import templates from '../pages/templates'
import utils from '../utils'
import { version } from '../../package.json'
import { setDesignNavs, setComponentsNavs, setComponents, setTemplatesNavs, setDocsNavs } from '../redux/action/global'
History.createBrowserHistory()

const logo = (
  <Logo
    url='<BASE_URL>/'
    logoUrl='<BASE_URL>/static/img/logo.png'
    text={
      <React.Fragment>
        HiUI<span className='version'>{`v${version}`}</span>
      </React.Fragment>
    }
    title='HiUI'
    alt='HiUI'
  />
)
class Index extends React.Component {
  componentNavs = []
  designNavs = []
  constructor(props) {
    super(props)
    const _h = History.getHistory()
    let locale = props.locale
    if (!utils.getLocaleFromPath()) {
      const locale = window.localStorage.getItem('HIUI_LANGUAGE') || 'zh-CN'
      _h.push(`<BASE_URL>/${locale}`)
      window.localStorage.setItem('HIUI_LANGUAGE', locale)
    }
    this.state = {
      locale: locale
    }

    const components = Object.assign(
      {
        components: {
          ...Object.values(pages.components).reduce((a, b) => {
            return Object.assign(a, b)
          }, {}),
          ...pages.documents
        }
      },
      {
        docs: {
          ...docs.documents
        }
      },
      {
        designs: {
          ...Object.values(designs.components).reduce((a, b) => {
            return Object.assign(a, b)
          }, {})
        }
      },
      {
        templates: {
          ...Object.values(templates.components).reduce((a, b) => {
            return Object.assign(a, b)
          }, {}),
          ...templates.documents
        }
      }
    )
    setComponents(components)
  }

  getSiderName(key) {
    const map = locales[this.state.locale] || {}
    return key.split('.').reduce((a, b) => {
      const parent = map[a]
      if (b) {
        return (parent || {})[b]
      }

      return parent
    })
  }

  componentDidUpdate() {
    setComponentsNavs(this.componentNavs)
    setDesignNavs(this.designNavs)
    setDesignNavs(this.templatesNavs)
    setDesignNavs(this.docsNavs)
  }
  getSiderItems(items) {
    const { locale } = this.props
    let components = []
    let navs = {}
    let siderDocuments = []
    Object.keys(items.documents).forEach((title, i) => {
      const _title = locales[locale]['components'][title]
      siderDocuments.push({
        title: <span className='components-title'>{_title}</span>,
        to: `<BASE_URL>/${locale}/components/${title}`,
        name: title
      })
      navs[title] = _title
    })
    Object.keys(items.components).forEach((title, i) => {
      components.push({
        title: <span className='components-title'>{locales[locale]['components'][title]}</span>
      })

      Object.keys(items.components[title]).forEach((page, j) => {
        const _title = locales[locale]['components'][page]
        navs[page] = _title
        components.push({
          title: <span className='components-page'>{_title}</span>,
          to: `<BASE_URL>/${locale}/components/${page}`,
          name: title
        })
      })
    })
    this.componentNavs = navs
    setComponentsNavs(navs)
    return [].concat(siderDocuments, components)
  }

  getDesignTemplatesItems(items, path, callback) {
    let components = []
    let siderDocuments = []
    let navs = {}
    const { locale } = this.props
    Object.keys(items.documents).forEach((title, i) => {
      const _title = locales[locale][path][title]
      navs[title] = _title
      siderDocuments.push({
        title: _title,
        to: `<BASE_URL>/${locale}/${path}/${title}`,
        name: title
      })
    })
    Object.keys(items.components).forEach((title, i) => {
      const temp = []
      Object.keys(items.components[title]).forEach((page, j) => {
        const _title = locales[locale][path][page]
        temp.push({
          title: <span className='components-page'>{_title}</span>,
          to: `<BASE_URL>/${locale}/${path}/${page}`,
          name: title
        })
        navs[page] = _title
      })
      components.push({
        title: <span className='components-title'>{locales[locale][path][title]}</span>,
        children: temp
      })
    })
    this[path] = navs
    if (callback) {
      callback(this[path])
    }
    return [].concat(siderDocuments, components)
  }
  render() {
    const siders = this.getSiderItems(pages)

    const _docs = this.getDesignTemplatesItems(docs, 'docs', setDocsNavs)
    const _designs = this.getDesignTemplatesItems(designs, 'designs', setDesignNavs)
    const _templates = this.getDesignTemplatesItems(templates, 'templates', setTemplatesNavs)
    return (
      <Page
        header={<Header locale={this.props.locale} />}
        logo={logo}
        routes={routes(this.props.locale, siders, _designs, _templates, _docs)}
      />
    )
  }
}

export default connect((state) => ({
  locale: state.global.locale
}))(Index)
