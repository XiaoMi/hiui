import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Counter from '../../../components/counter'
const prefix = 'counter-base'
const leftOptions = ['基础用法', '受控', '步长', '禁用']
const code = [
  {
    code: `import React from 'react'
    import Counter from '@hi-ui/hiui/es/counter'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.state={
          value:4
        }
      }
      render() {
        return (
          <div>
            <Counter
              defaultValue='4'
              min='-10'
              max='10'
            />
          </div>
        )
      }
    }`,
    opt: ['基础用法']
  },
  {
    code: `import React from 'react'
    import Counter from '@hi-ui/hiui/es/counter'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.state={
          value:2
        }
      }
      render() {
        return (
          <div>
            <Counter
              value={this.state.value}
              min='2'
              max='8'
              onChange={(val) => {this.setState({value:val})}}
            />
          </div>
        )
      }
    }`,
    opt: ['受控']
  },
  {
    code: `import React from 'react'
    import Counter from '@hi-ui/hiui/es/counter'\n
    class Demo extends React.Component {
      render() {
        return (
          <div>
            <Counter
              step='2'
              min='2'
              max='8'
              onChange={(val) => {console.log('val:',val)}}
            />
          </div>
        )
      }
    }`,
    opt: ['步长']
  },
  {
    code: `import React from 'react'
    import Counter from '@hi-ui/hiui/es/counter'\n
    class Demo extends React.Component {
      render() {
        return (
          <div>
            <Counter
              disabled
            />
          </div>
        )
      }
    }`,
    opt: ['禁用']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Counter }}
    leftOptions={leftOptions}
    prefix={prefix}
  />
)
export default DemoBase
