import Counter from './Counter'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'
import CounterLegacy from './counter-legacy'

export default SwitchVersion(Counter, CounterLegacy)
