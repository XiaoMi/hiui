import React from 'react'
import { connect } from 'react-redux'

class Design extends React.Component {
  render () {
    return (
      <div className='design'>
        design
      </div>
    )
  }
}

export default connect(state => ({
  sider: state.global.state
}))(Design)
