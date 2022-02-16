import './styles/index.scss'

import { List as _List } from './List'
import { ListItem as Item } from './ListItem'

const List = Object.assign(_List, { Item })

export default List

export * from './List'
export * from './ListItem'
