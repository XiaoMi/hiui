import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/preview.js'

export default class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      imgWidth: 0,
      imgHeight: 0
    }
  }

  static propTypes = {
    src: PropTypes.string,
    show: PropTypes.bool
  }

  onClose () {
    this.setState({
      imgWidth: 0,
      imgHeight: 0
    })
    this.props.onClose && this.props.onClose()
  }

  imgOnLoad () {
    this.setState({
      imgWidth: this.img.clientWidth,
      imgHeight: this.img.clientHeight
    })
  }

  render () {
    const { show, src } = this.props
    const {
      imgWidth,
      imgHeight
    } = this.state
    const windowRadio = window.innerWidth / window.innerHeight
    const imgRadio = imgHeight > 0 ? imgWidth / imgHeight : 0
    let extraClass
    let style = {}
    if (imgRadio > windowRadio) {
      extraClass = 'hi-preview--width'
      style = imgWidth > 0 ? {'width': window.innerWidth * 0.6 > imgWidth ? imgWidth : window.innerWidth * 0.6} : style
    } else {
      extraClass = 'hi-preview--height'
      style = imgHeight > 0 ? {'height': window.innerHeight * 0.6 > imgHeight ? imgHeight : window.innerHeight * 0.6} : style
    }

    return (
      <div className={classNames('hi-preview', extraClass, {'hi-preview--hide': !show})} onClick={this.onClose.bind(this)}>
        <div className='hi-preview-image' style={style}>
          <img
            ref={node => { this.img = node }}
            src={src}
            onLoad={this.imgOnLoad.bind(this)}
          />
        </div>
      </div>
    )
  }
}
