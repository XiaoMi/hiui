import Progress from './progress'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'
import BadgeLegacy from './progress-legacy'

export default SwitchVersion(Progress, BadgeLegacy)
