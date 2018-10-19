import React from 'react'
import './style/index.scss'
import { connect } from 'react-redux'
import LocaleDropdown from '../Component/Dropdown/LocaleDropdown'
import locales from '../../locales'

class Home extends React.Component {
  constructor (props) {
    super(props)

    // const locale = this.storeLang()

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
    // window.addEventListener('hashchange', this.hashChangeEvent)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollEvent)
    // window.removeEventListener('hashchange', this.hashChangeEvent)
  }

  // hashChangeEvent () {
  //   let locale = window.location.hash.split('/')[1]

  //   if (!locale) { return }

  //   // 临时用于隐藏语言
  //   if (locale !== 'zh-CN') {
  //     window.location.hash = window.location.hash.replace(locale, 'zh-CN')
  //   }

  //   if (locale !== window.localStorage.getItem('HIUI_LANGUAGE')) {
  //     window.localStorage.setItem('HIUI_LANGUAGE', locale)

  //     this.setState({locale})
  //   }
  // }

  // 保存语言类型
  storeLang () {
    let locale = window.location.hash.split('/')[1]

    if (!locale || !(locale in locales)) {
      locale = window.localStorage.getItem('HIUI_LANGUAGE')
      if (locale && (locale in locales)) {
        window.location.hash = `#/${locale}`
      }
    } else {
      locale = 'zh-CN'
      window.localStorage.setItem('HIUI_LANGUAGE', locale)
      window.location.hash = `#/${locale}`
    }

    return locale
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

  changeLocale () {
    const locale = this.props.locale
    const LANG = {
      'zh-CN': 'English',
      'en-US': '中文'
    }

    return LANG[locale]
  }

  render () {
    const {designText, efficiencyText, excelText, excelList} = this.state
    const {
      locale
    } = this.props
    return (
      <div className='page'>
        <div className='section-header'>
          <div className='container'>
            <div className='logo-con fl'>
              <span className='logo' />
              <span>HIUI Design</span>
            </div>
            <div className='intro fr'>
              <a className='active item' href=''>首页</a>
              {/* <a href=''>规范设计</a> */}
              <a className='item' href={`#/${locale}/components`}>组件</a>
              <div className='item'>
                <LocaleDropdown />
              </div>
            </div>
          </div>
        </div>
        <div className='section-banner'>
          <div className='container'>
            <div className='bg' />
            <div className='con'>
              <div className='text'>HIUI，设计原则的布道者</div>
              <div className='desc'>HIUI是一套适用于前中后台交互与界面设计标准的制定与实施的前端解决方案</div>
              <div className='use'><a href={`#/${locale}/components`}>开始使用</a></div>
            </div>
          </div>
        </div>

        <div className='section-design'>
          <div className='container'>
            <div className={`text ${designText ? 'trans' : ''}`} ref={this.designText}>好用的设计</div>
            <div className={`item-list clearfix ${designText ? 'trans' : ''}`} ref={this.designList}>
              <div className='item'>
                <div className='pic' />
                <div className='title'>交互一致性</div>
                <div className='desc'>最大限度减少用户对交互的认知成本及交互的可预期性</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>视觉统一</div>
                <div className='desc'>制定视觉风格，产出典型场景的视觉设计方案和界面规范</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>从业务中来</div>
                <div className='desc'>高度提炼 OA、仓储售后系统、BI 系统、企业中台等项目的设计经验累积</div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-efficiency'>
          <div className='container'>
            <div className='bg' />
            <div className={`con ${efficiencyText ? 'trans' : ''}`} ref={this.efficiencyText}>
              <div className='text'>一切优势, 最终都是效率优势</div>
              <div className='desc'>所有控件组件化，无论前端工程师、PHP 工程师、JAVA 工程师，不必为日新月异的前端技术所困扰。规范统一所有 API 接口，方便调用。</div>
            </div>
          </div>
        </div>

        <div className='section-excel'>
          <div className='container'>
            <div className={`text ${excelText ? 'trans' : ''}`} ref={this.excelText}>优秀到不能被忽视</div>
            <div className={`item-list clearfix ${excelList ? 'trans' : ''}`} ref={this.excelList}>
              <div className='item'>
                <div className='pic' />
                <div className='title'>实践出真知</div>
                <div className='desc'>深入海量业务实践，总结典型应用场景</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>多终端支持</div>
                <div className='desc'>广泛适用于 PC、H5、APP 以及小程序等各个终端<sup>*</sup></div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>国际化</div>
                <div className='desc'>充分预留项目 i18n 的需求，无论在 API 接口还是设计要求</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>极速产出</div>
                <div className='desc'>产品经理、设计者或工程师，都能快速产出</div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-renren'>
          <div className='container'>
            <div className='text'>我为人人</div>
            <div className='item-list clearfix'>
              <div className='item'>
                <div className='pic' />
                <div className='text-con'>
                  <div className='title'>HIUI Template<sup>*</sup></div>
                  <div className='desc'>无需掌握前端框架即可进行页面开发</div>
                </div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='text-con'>
                  <div className='title'>HIUI Library<sup>*</sup></div>
                  <div className='desc'>集成所有 HIUI 组件的 Axure/Sketch 部件库</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-footer'>* 敬请期待</div>
      </div>
    )
  }
}

export default connect(state => ({
  locale: state.global.locale
}))(Home)
