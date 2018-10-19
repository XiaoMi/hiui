import React from 'react'
import { connect } from 'react-redux'
import { setLocale } from '../../../redux/action/global'
import Dropdown from '../../../../components/dropdown'
import './style/index.scss'

const locales = ['zh-CN', 'en-US']
const localesLabel = ['中文', 'English']

class LocaleDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [{title: '中文'}, {title: 'English'}],
      title: localesLabel[locales.indexOf(this.props.locale || 0)]
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
      title: val
    })
    this.props.dispatch(setLocale(locales[localesLabel.indexOf(val)]))
    this.props.changeDropdown && this.props.changeDropdown(val)
  }

  render () {
    const {
      list,
      title
    } = this.state

    return (
      <Dropdown list={list} title={title} onClick={this.changeDropdown.bind(this)} />
    )
  }
}

export default connect(state => ({
  locale: state.global.locale
}))(LocaleDropdown)
