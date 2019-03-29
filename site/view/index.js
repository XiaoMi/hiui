import React from 'react'
import Header from './Component/Header'
import { connect } from 'react-redux'
import routes from './routes'
import {Classic as Page, Logo, History} from '@hi-ui/classic-theme'
import locales from '../locales'
import designs from '../pages/designs'
import pages from '../pages/components'
import templates from '../pages/templates'
import {setDesignNavs, setComponentsNavs, setComponents} from '../redux/action/global'
History.createHashHistory()

const logo = <Logo
  url='https://xiaomi.github.io/hiui/#/'
  logoUrl='https://xiaomi.github.io/hiui/static/img/logo.png?241e0618fe55d933c280e38954edea05'
  text='HIUI'
  title='HIUI'
  alt='HIUI'
/>
class Index extends React.Component {
  componentNavs = []
  designNavs = []
  constructor (props) {
    super(props)
    const _h = History.getHistory()
    let locale = window.location.hash.split('/')[1]
    if (!locale || !(locale in locales)) {
      locale = window.localStorage.getItem('HIUI_LANGUAGE')
      if (locale && (locale in locales)) {
        _h.push(`/${locale}`)
      } else {
        window.localStorage.setItem('HIUI_LANGUAGE', this.props.locale)
        _h.push(`/${this.props.locale}`)
      }
    } else {
      window.localStorage.setItem('HIUI_LANGUAGE', locale)
    }
    this.state = {
      locale: locale
    }

    const components = Object.assign(
      {
        docs: {
          ...Object.values(pages.components).reduce((a, b) => {
            return Object.assign(a, b)
          }, {}),
          ...pages.documents
        }
      }, {
        designs: {
          ...Object.values(designs.components).reduce((a, b) => {
            return Object.assign(a, b)
          }, {}),
          ...designs.documents
        }
      }, {
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

  getSiderName (key) {
    const map = locales[this.state.locale] || {}
    return key.split('.').reduce((a, b) => {
      const parent = map[a]
      if (b) {
        return (parent || {})[b]
      }

      return parent
    })
  }
  getSiderItems (items) {
    const icons = [
      <span className='sider__icon-start' />,
      // <span className='sider__icon-principle' />,
      <span className='sider__icon-layout' />,
      <span className='sider__icon-vision' />,
      <span className='sider__icon-i18n' />,
      <span className='sider__icon-changelog' />,
      <span className='sider__icon-component' />
    ]
    const {locale} = this.props
    let components = []
    let navs = {}
    let siderDocuments = []
    Object.keys(items.documents).forEach((title, i) => {
      const _title = locales[locale]['components'][title]
      siderDocuments.push({
        title: <span className='components-title'>{_title}</span>,
        to: `/${locale}/docs/${title}`,
        icon: icons[i]
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
          to: `/${locale}/docs/${page}`
        })
      })
    })
    this.componentNavs = navs
    setComponentsNavs(navs)
    return [].concat(siderDocuments, [{
      title: <span className='components-page'>{locales[locale]['misc']['components']}</span>,
      icon: icons[icons.length - 1],
      children: components
    }])
  }
  componentDidUpdate () {
    console.log('update')
    setComponentsNavs(this.componentNavs)
    setDesignNavs(this.designNavs)
  }
  getDesignTemplatesItems (items, path, callback) {
    let components = []
    let siderDocuments = []
    let navs = {}
    const {locale} = this.props
    Object.keys(items.documents).forEach((title, i) => {
      const _title = locales[locale][path][title]
      navs[title] = _title
      siderDocuments.push({
        title: _title,
        to: `/${locale}/${path}/${title}`
      })
    })
    Object.keys(items.components).forEach((title, i) => {
      const temp = []
      Object.keys(items.components[title]).forEach((page, j) => {
        const _title = locales[locale][path][page]
        temp.push({
          title: <span className='components-page'>{_title}</span>,
          to: `/${locale}/${path}/${page}`
        })
        navs[page] = _title
      })
      components.push({
        title: <span className='components-title'>{locales[locale][path][title]}</span>,
        children: temp
      })
    })
    this.designNavs = navs
    setDesignNavs(this.designNavs)
    return [].concat(siderDocuments, components)
  }
  render () {
    const siders = this.getSiderItems(pages)
    const _designs = this.getDesignTemplatesItems(designs, 'designs', setDesignNavs)
    const _templates = this.getDesignTemplatesItems(templates, 'templates')
    return (
      <Page
        header={<Header locale={this.props.locale} />}
        logo={logo}
        routes={routes(this.props.locale, siders, _designs, _templates)}
      />
    )
  }
}

// export default Index
export default connect(state => ({
  locale: state.global.locale
}))(Index)
