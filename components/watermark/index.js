import React from 'react'
import PropTypes from 'prop-types'
import WaterMarker from './watermark'
import Provider from '../context/index'

import _ from 'lodash'
class InternalWatermark extends React.Component {
  constructor(props) {
    super(props)

    this.rootRef = React.createRef()
  }

  componentDidMount() {
    const container = this.rootRef.current
    const { localeDatas, content } = this.props
    const options = _.cloneDeep(this.props)
    options.content = content || localeDatas.watermark.content
    delete options.children

    WaterMarker(container, options)
  }

  render() {
    const { allowCopy } = this.props
    return (
      <div ref={this.rootRef} style={{ overflow: 'hidden', userSelect: allowCopy ? 'text' : 'none' }}>
        {this.props.children}
      </div>
    )
  }
}

InternalWatermark.propTypes = {
  id: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  textAlign: PropTypes.string,
  font: PropTypes.number,
  color: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  rotate: PropTypes.number,
  zIndex: PropTypes.number,
  logo: PropTypes.string,
  grayLogo: PropTypes.bool,
  isAutoWrap: PropTypes.bool,
  textOverflowEffect: PropTypes.oneOf(['zoom', 'cut'])
}

InternalWatermark.defaultProps = {
  id: null,
  density: 'default',
  textAlign: 'left',
  font: 14,
  color: 'rgba(148, 148, 148, 0.2)',
  rotate: -30,
  zIndex: 1000,
  logo: null,
  grayLogo: true,
  isAutoWrap: false,
  textOverflowEffect: 'zoom',
  allowCopy: false
}
const Watermark = Provider(InternalWatermark)
Watermark.generate = WaterMarker
export default Watermark
