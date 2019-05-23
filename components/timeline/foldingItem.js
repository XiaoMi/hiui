import React from 'react'
import Icon from '../icon'

export default class FoldingItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSub: false
    }
  }
  render () {
    const { showSub } = this.state
    const { texts } = this.props
    let text = showSub ? texts.collapse : texts.expand
    let iconName = showSub ? 'up' : 'down'
    return <li className='hi-timeline__item hi-timeline__item--folding'>
      { showSub && <ul>{this.props.subChildren}</ul> }
      <span className='hi-timeline__arrow' onClick={() => this.setState({showSub: !this.state.showSub})}>{text}   <Icon name={iconName} /></span>
      <div className='hi-timeline__line' />
    </li>
  }
}
