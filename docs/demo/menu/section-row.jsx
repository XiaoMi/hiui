import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Menu from '../../../components/menu'
const prefix = 'menu-row'
const desc = '水平方向的导航菜单，菜单项在4-7个为适'
const code = `import React from 'react'
import Menu from '@hi-ui/hiui/es/menu'\n
class Demo extends React.Component {
  render(){
    const datas = [
      {
        content: '电视',
        id: 1,
        icon: 'global'
      },
      {
        content: '小米MIX',
        id: 2
      },
      {
        content: '手机',
        children: [
          {
            content: '小米',
            icon: 'phone',
            children: [
              {
                content: '小米9',
                id: 'xiaomi9'
              },
              {
                content: '小米8',
                id: 'xiaomi8',
                disabled: true
              },
              {
                content: '小米7',
                id: 'xiaomi7'
              },
              {
                content: '小米6',
                id: 'xiaomi6'
              },
              {
                content: '小米5',
                id: 'xiaomi5'
              },
              {
                content: '小米4',
                id: 'xiaomi4'
              },
              {
                content: '小米3',
                id: 'xiaomi3'
              }
            ]
          },
          {
            content: '红米',
            id: 'hongmi'
          },
          {
            content: '小米note',
            disabled: true,
            children: [
              {
                content: '小米 note7',
                id: 'xiaomi note7'
              },
              {
                content: '小米 note6',
                id: 'xiaomi note6'
              },
              {
                content: '小米 note5',
                id: 'xiaomi note5'
              },
              {
                content: '小米 note4',
                id: 'xiaomi note4'
              },
              {
                content: '小米 note3',
                id: 'xiaomi note3'
              }
            ]
          }
        ]
      },
      {
        content: '超长超长超长字符超长超长超长字符',
        id: 4
      }
    ]
    return(
      <div>
        <Menu
          placement="horizontal"
          activeId={'xiaomi9'}
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
          onClickSubMenu={index => console.log('-----onClickSubMenu', index)}
          data={datas}
        />
      </div>
    )
  }
}`
const DemoRow = () => (
  <DocViewer code={code} desc={desc} scope={{ Menu }} prefix={prefix} />
)
export default DemoRow
