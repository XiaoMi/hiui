import Counter from './Counter'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'
import CounterLegacy from './counter-legacy'
import Provider from '../context'

export default Provider(SwitchVersion(Counter, CounterLegacy))
