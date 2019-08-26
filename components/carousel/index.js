import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style/index'

// const url = 'http://i1.mifile.cn/f/i/hiui/docs/'
class Carousel extends Component {
  constructor (props) {
    super(props)
    this.tempArr = [1, 2, 3, 4, 5, 6, 7, 8]
    this.rootRef = React.createRef()
    this.state = {
      rootWidth: 0
    }
  }
  componentDidMount () {
    this.setState({
      rootWidth: this.rootRef.current.clientWidth
    })
  }
  render () {
    const children = React.Children.toArray(this.props.children)
    console.log(children)
    return <div className='hi-carousel' ref={this.rootRef}>
      {/* {this.props.children} */}
      <div className='hi-carousel__container' style={{width: this.state.rootWidth * children.length}}>
        {
          children.map((child, index) => {
            return React.cloneElement(child, {
              key: index,
              style: {
                width: this.state.rootWidth,
                display: 'inline-block'
              }
            })
          })
        }
      </div>
    </div>
  }
}

Carousel.propTypes = {
  separator: PropTypes.string,
  data: PropTypes.array,
  onClick: PropTypes.func
}
Carousel.defaultProps = {
  separator: '|',
  data: [],
  onClick: () => { }
}
export default Carousel
