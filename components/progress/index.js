import Progress from './progress'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'
import ProgressLegacy from './progress-legacy'

export default SwitchVersion(Progress, ProgressLegacy)
