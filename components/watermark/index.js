import React from 'react'
import PropTypes from 'prop-types'
import WaterMarker from './watermark'
import _ from 'lodash'
class Watermark extends React.Component {
  constructor (props) {
    super(props)

    this.rootRef = React.createRef()
  }
  componentDidMount () {
    const container = this.rootRef.current
    const options = _.cloneDeep(this.props)
    delete options.children

    WaterMarker(container, options)
  }
  render () {
    return (
      <div ref={this.rootRef} style={{ overflow: 'hidden' }}>
        {this.props.children}
      </div>
    )
  }
}

Watermark.propTypes = {
  id: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  textAlign: PropTypes.string,
  font: PropTypes.string,
  color: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  rotate: PropTypes.number,
  zIndex: PropTypes.number,
  logo: PropTypes.string,
  grayLogo: PropTypes.bool,
  isAutoWrap: PropTypes.bool,
  textOverflowEffect: PropTypes.oneOfType(['zoom', 'cut'])
}

Watermark.defaultProps = {
  id: null,
  density: 'default',
  textAlign: 'left',
  font: '16px microsoft yahei',
  color: 'rgba(128, 128, 128, 0.2)',
  content: '请勿外传',
  rotate: -30,
  zIndex: 1000,
  logo: null,
  grayLogo: true,
  isAutoWrap: false,
  textOverflowEffect: 'zoom'
}
Watermark.generate = WaterMarker
export default Watermark
