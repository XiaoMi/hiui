import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Cascader from '../../../components/cascader'
const prefix = 'section-basic'
const desc = '展示从多个收起的备选项中选出的一个选项'
const rightOptions = ['带默认值', '基础', '可清空', '禁用']
const code = [
  {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value:['8','10'],
      options: [
        {
          id: '1',
          content: '手机',
          children: [
            {
              id: '2',
              content: '小米',
              children: [
                {
                  id: '3',
                  content: '小米3'
                },
                {
                  id: '4',
                  content: '小米4'
                },
              ]
            },
            {
              id: '5',
              content: '红米',
              children: [
                {
                  id: '6',
                  content: '红米3'
                },
                {
                  id: '7',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '8',
          content: '电视',
          children: [
            {
              id: '9',
              content: '小米电视4A'
            },
            {
              id: '10',
              content: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    const {value} = this.state
    return(
      <Cascader
        onChange={(id)=>{
          console.log('change')
          this.setState({
            value:id
          })
        }}
     
        value={value}
        data={this.state.options}
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['基础']
  }, {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(id)=>{
          console.log('on change', id)
        }}
        defaultValue={['电视','小米电视4C']}
        data={this.state.options}
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['带默认值']
  }, {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(id)=>{
          console.log('on change', id)
        }}
        data={this.state.options}
        style={{ width: 240 }}
        clearable
      />
    )
  }
}`,
    opt: ['可清空']
  }, {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        disabled
        onChange={(id)=>{
          console.log('on change', id)
        }}
        data={this.state.options}
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['禁用']
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Cascader }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoBasic
