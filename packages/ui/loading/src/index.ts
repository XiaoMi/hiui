import './styles/index.scss'

import { Loading as _Loading } from './Loading'
import withLoading from './with-api'

export const Loading = withLoading(_Loading)
export default Loading
