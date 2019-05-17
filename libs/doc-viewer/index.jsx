import React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import Icon from '../../components/icon'
import Tooltip from '../../components/tooltip'
import './index.scss'
import Clipboard from 'clipboard'
import theme from './theme'

class Editor extends React.Component {
  state = {
    collapse: false,
    copyed: false
  }
  componentDidMount () {
    const codeViewer = document.getElementsByClassName('editor-inner')[0]
    this.innerHeight = codeViewer.clientHeight
    const clipboard = new Clipboard('.copy-btn')
    const _this = this
    clipboard.on('success', function (e) {
      _this.setState({
        copyed: true
      })
      _this.resetCopy()
      console.info('Action:', e.action)
      console.info('Text:', e.text)
      console.info('Trigger:', e.trigger)

      e.clearSelection()
    })
  }
  resetCopy = () => {
    setTimeout(() => {
      this.setState({
        copyed: false
      })
    }, 2000)
  }
  render () {
    const { copyed } = this.state
    return (
      <div
        className='doc-viewer'
        style={{ height: this.state.collapse ? this.innerHeight + 41 : 41, overflow: 'hidden' }}
      >
        <div
          style={{
            minHeight: 40,
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: 20,
            paddingRight: 20,
            alignItems: 'center',
            borderBottom: this.state.collapse ? '1px dashed #e6e7e8' : 'none'
          }}
        >
          <div>{this.props.desc}</div>
          <div>
            <Tooltip
              title={this.state.collapse ? '收起代码' : '展开代码'}
              style={{ margin: '0 8px', cursor: 'pointer' }}
            >
              <span
                onClick={() => {
                  this.setState({
                    collapse: !this.state.collapse
                  })
                }}
              >
                {this.state.collapse ? <Icon name='shrink' /> : <Icon name='expand-alt' />}
              </span>
            </Tooltip>
            {copyed ? (
              <Tooltip title='复制成功' style={{ margin: '0 8px', cursor: 'pointer' }}>
                <span>
                  <Icon name='check' />
                </span>
              </Tooltip>
            ) : (
              <Tooltip title='复制代码' style={{ margin: '0 8px', cursor: 'pointer' }}>
                <span
                  className='copy-btn'
                  data-clipboard-target='.npm__react-simple-code-editor__textarea'
                >
                  <Icon name='copy' />
                </span>
              </Tooltip>
            )}
            <Tooltip title='重置代码' style={{ margin: '0 8px', cursor: 'pointer' }}>
              <span onClick={() => {}}>
                <Icon name='synchronize' />
              </span>
            </Tooltip>
          </div>
        </div>
        <div className='editor-inner'>{this.props.children}</div>
      </div>
    )
  }
}
export default class DocViewer extends React.Component {
  render () {
    const { code, scope, desc } = this.props
    return (
      <LiveProvider code={code} scope={scope} theme={theme}>
        <div style={{ border: '1px solid #e6e7e8', borderRadius: '2px' }}>
          <div
            style={{
              padding: 20,
              borderBottom: '1px dashed #e6e7e8'
            }}
          >
            <LivePreview />
          </div>
          <Editor desc={desc}>
            <LiveEditor />
            <LiveError />
          </Editor>
        </div>
      </LiveProvider>
    )
  }
}
