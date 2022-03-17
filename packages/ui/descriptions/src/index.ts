import './styles/index.scss'
import { DescriptionsItem } from './DescriptionsItem'
import { Descriptions as _Descriptions } from './Descriptions'

const Descriptions = Object.assign(_Descriptions, { Item: DescriptionsItem })

export default Descriptions
export * from './Descriptions'
export * from './DescriptionsItem'
