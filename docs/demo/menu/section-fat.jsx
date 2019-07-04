import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Menu from '../../../components/menu'
const prefix = 'menu-fat'
const code = `
import React from 'react'
import Menu from '@hiui/hiui/es/menu'\n
class Demo extends React.Component {
  render(){
    const datas = [
      {
        content: '电视',
        id: 1,
        icon: 'internet'
      },
      {
        content: '小米MIX',
        id: 2
      },
      {
        content: '手机',
        icon: 'phone',
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
                id: 'xiaomi8'
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
            children: [
              {
                content: '红米 7',
                id: 'hongmi 7'
              },
              {
                content: '红米 6',
                id: 'hongmi 6'
              },
              {
                content: '红米 5',
                id: 'hongmi 5'
              },
              {
                content: '红米 4',
                id: 'hongmi 4'
              },
              {
                content: '红米 3',
                id: 'hongmi 3'
              }
            ]
          },
          {
            content: '小米note',
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
          mode="horizontal"
          activeId={'xiaomi9'}
          fatMenu
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
          datas={datas}
        />
      </div>
    )
  }
}`

const DemoFat = () => (
  <DocViewer
    code={code}
    scope={{ Menu }}
    prefix={prefix}
  />
)
export default DemoFat
