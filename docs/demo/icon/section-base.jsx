import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Icon from '../../../components/icon'

const prefix = 'icon-base'
const code = `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Icon name="info-circle" style={{color: '#4284F5', fontSize: '24px'}} />
        <Icon name="check-circle" style={{color: '#1DA653', fontSize: '24px'}} />
        <Icon name="close-circle" style={{color: '#EB5252', fontSize: '24px'}} />
        <Icon name="close" style={{color: '#999', fontSize: '24px'}} />
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Icon }} prefix={prefix} />
export default DemoBase
