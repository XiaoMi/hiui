import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'theme-theme'
const code = `
import React from 'react'
import Table from '@hiui/hiui/es/table'\n
class Demo extends React.Component {
  render() {
    return (
      <Table columns={[
        { title: '主题', dataIndex: 'language'},
        { title: 'value', dataIndex: 'theme'}
      ]} data={[
        {language: '品牌蓝', theme: 'hiui-blue'},
        {language: '橙', theme: 'orange'},
        {language: '青', theme: 'cyan'},
        {language: '蓝', theme: 'blue'},
        {language: '紫', theme: 'purple'},
      ]} />
    )
  }
}`
const DemoTheme = () => <DocViewer code={code} scope={{ Table }} prefix={prefix} />
export default DemoTheme
