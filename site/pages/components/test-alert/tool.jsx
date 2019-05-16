import React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import Icon from '../../../../components/icon'
import Tooltip from '../../../../components/tooltip'
import './index.scss'

class Editor extends React.Component {
  state = {
    collapse: false
  }
  componentDidMount () {
    const codeViewer = document.getElementsByClassName('editor-inner')[0]
    this.innerHeight = codeViewer.clientHeight
  }
  render () {
    return (
      <div
        className='doc-viewer'
        style={{ height: this.state.collapse ? this.innerHeight + 51 : 51, overflow: 'hidden' }}
      >
        <div
          style={{
            minHeight: 50,
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
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
            <Tooltip title='复制代码' style={{ margin: '0 8px', cursor: 'pointer' }}>
              <span onClick={() => {}}>
                <Icon name='copy' />
              </span>
            </Tooltip>
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
    console.log('code', code)
    return (
      <LiveProvider code={code} scope={scope}>
        <div style={{ border: '1px solid #e6e7e8' }}>
          <div
            style={{
              padding: 10,
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
