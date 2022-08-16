import './styles/index.scss'

import { Anchor as _Anchor, AnchorItem as Item } from './Anchor'

const Anchor = Object.assign(_Anchor, {
  Item,
})

export default Anchor

export * from './Anchor'
