import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Cascader from '../../../components/cascader'
const prefix = 'section-forbidclear'
const rightOptions = ['禁止清空', '不禁止']
const code = [
  {
    code: `import React from 'react'
import Cascader from '@hiui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        value={['手机', '红米', '红米4']}
        onChange={(value)=>{
          console.log('on change', value)
        }}
        clearable={false}
        options={this.state.options}
        style={{width: '240px'}}
      />
    )
  }
}`,
    opt: ['禁止清空']
  }, {
    code: `import React from 'react'
import Cascader from '@hiui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        value={['手机', '红米', '红米4']}
        onChange={(value)=>{
          console.log('on change', value)
        }}
        options={this.state.options}
        style={{width: '240px'}}
      />
    )
  }
}`,
    opt: ['不禁止']
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Cascader }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoBasic
