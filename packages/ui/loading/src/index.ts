import './styles/index.scss'

import { Loading as _Loading } from './Loading'
import { withLoading } from './with-api'

export type { LoadingProps, LoadingSizeEnum } from './Loading'
export type { LoadingApiProps } from './with-api'

export const Loading = withLoading(_Loading)
export default Loading
