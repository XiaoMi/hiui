import './styles/index.scss'

import { Layout as _Layout } from './Layout'
import { Sider } from './Sider'
import { Content } from './Content'
import { SearchTrigger } from './SearchTrigger'
import { FloatMenuContainer } from './FloatMenuContainer'

const Layout = Object.assign(_Layout, {
  Sider,
  Content,
  SearchTrigger,
  FloatMenuContainer,
})

export default Layout

export * from './Layout'
export * from './Sider'
export * from './Content'
export * from './SearchTrigger'
export * from './FloatMenuContainer'
