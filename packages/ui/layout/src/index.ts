import './styles/index.scss'

import { Layout as _Layout } from './Layout'
import { Header } from './Header'
import { Sider } from './Sider'
import { Content } from './Content'
import { Footer } from './Footer'
import { SearchTrigger } from './SearchTrigger'
import { FloatMenuContainer } from './FloatMenuContainer'
import { AppListPopover } from './AppList'

const Layout = Object.assign(_Layout, {
  Header,
  Sider,
  Content,
  Footer,
  SearchTrigger,
  FloatMenuContainer,
  AppListPopover,
})

export default Layout

export * from './Layout'
export * from './Header'
export * from './Sider'
export * from './Content'
export * from './Footer'
export * from './SearchTrigger'
export * from './FloatMenuContainer'
export * from './AppList'
