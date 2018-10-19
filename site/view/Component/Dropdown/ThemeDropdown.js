import React from 'react'
import { connect } from 'react-redux'
import { setTheme } from '../../../redux/action/global'
import Dropdown from '../../../../components/dropdown'
import './style/index.scss'

const themes = ['classics', 'default']
const themesLabel = ['经典', '默认']

class ThemeDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [{title: '默认'}, {title: '经典'}],
      title: themesLabel[themes.indexOf(this.props.theme || 0)]
    }
  }

  changeDropdown (val) {
    this.setState({
      title: val
    })
    this.props.dispatch(setTheme(themes[themesLabel.indexOf(val)]))
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
  theme: state.global.theme
}))(ThemeDropdown)
