import React from 'react'
import { connect } from 'react-redux'
import { setTheme } from '../../../redux/action/global'
import classnames from 'classnames'
import './style/index.scss'

class ThemeDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isShow: false,
      selected: 'hiui-blue',
      isShowList: false
    }
  }

  changeDropdown (val) {
    this.setState({
      selected: val,
      isShowList: false
    })
    this.props.dispatch(setTheme(val))
    this.props.changeDropdown && this.props.changeDropdown(val)
  }
  toggleDropdown (isShow) {
    this.setState({
      isShowList: isShow
    })
  }
  render () {
    const {
      isShowList
    } = this.state
    const _cls = classnames('hi-demo__list', !isShowList && 'hi-demo__list--hide', 'hi-demo__list--colors')
    return (
      <div
        className='hi-demo__dropdown'
        onMouseEnter={this.toggleDropdown.bind(this, true)}
        onMouseLeave={this.toggleDropdown.bind(this, false)}
      >
        <a className='hi-demo__title' >
          <span className='hi-demo__text'>主题</span>
          <i className='hi-icon icon-down' />
        </a>
        <ul className={_cls}>
          <li className='hi-demo__item hi-demo__item--color' title='品牌蓝' onClick={this.changeDropdown.bind(this, 'hiui-blue')}><span className='hi-demo__item-dot theme__hiui-blue' /><span>品牌蓝</span></li>
          <li className='hi-demo__item hi-demo__item--color' title='橙' onClick={this.changeDropdown.bind(this, 'orange')}><span className='hi-demo__item-dot theme__orange' /><span>橙</span></li>
          <li className='hi-demo__item hi-demo__item--color' title='青' onClick={this.changeDropdown.bind(this, 'cyan')}><span className='hi-demo__item-dot theme__cyan' /><span>青</span></li>
          <li className='hi-demo__item hi-demo__item--color' title='蓝' onClick={this.changeDropdown.bind(this, 'blue')}><span className='hi-demo__item-dot theme__blue' /><span>蓝</span></li>
          <li className='hi-demo__item hi-demo__item--color' title='紫' onClick={this.changeDropdown.bind(this, 'purple')}><span className='hi-demo__item-dot theme__purple' /><span>紫</span></li>
        </ul>
      </div>
    )
  }
}

export default connect(state => ({
  theme: state.global.theme
}))(ThemeDropdown)
