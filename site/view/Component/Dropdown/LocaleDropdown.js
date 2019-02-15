import React from 'react'
import { connect } from 'react-redux'
import { setLocale } from '../../../redux/action/global'
import classnames from 'classnames'
import './style/index.scss'

const locales = ['zh-CN', 'en-US']
const localesLabel = ['中文', 'English']

class LocaleDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [{title: '中文'}, {title: 'English'}],
      title: localesLabel[locales.indexOf(this.props.locale || 0)],
      isShowList: false
    }
  }

  componentWillMount () {
    // 直接从路由进来，判断路由的locale是否和localStorage一致
    const locale = window.location.hash.split('/')
    if (locale.length > 2 && locale[1] !== this.props.locale && locales.indexOf(locale[1]) > -1) {
      this.changeDropdown(localesLabel[locales.indexOf(locale[1])])
    }
  }

  changeDropdown (val) {
    this.setState({
      title: val,
      isShowList: false
    })
    this.props.dispatch(setLocale(locales[localesLabel.indexOf(val)]))
    // this.props.changeDropdown && this.props.changeDropdown(locales[localesLabel.indexOf(val)])
  }
  toggleDropdown (isShow) {
    this.setState({
      isShowList: isShow
    })
  }
  render () {
    const {
      list,
      title,
      isShowList
    } = this.state
    const _cls = classnames('hi-demo__list', !isShowList && 'hi-demo__list--hide')
    return (
      <div
        className='hi-demo__dropdown'
        onMouseEnter={this.toggleDropdown.bind(this, true)}
        onMouseLeave={this.toggleDropdown.bind(this, false)}
      >
        <a className='hi-demo__title' >
          <span className='hi-demo__text'>{title}</span>
          <i className='hi-icon icon-down' />
        </a>
        <ul className={_cls}>
          {
            list.map((item, index) => {
              return (
                <li
                  key={index}
                  className='hi-demo__item'
                  onClick={() => {
                    this.changeDropdown(item.title)
                  }}
                >
                  {item.title}
                </li>
              )
            })
          }
        </ul>
      </div>

    )
  }
}

export default connect(state => ({
  locale: state.global.locale
}))(LocaleDropdown)
