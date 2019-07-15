import Alert from './alert'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'
import AlertLegacy from './alert-legacy'

export default SwitchVersion(Alert, AlertLegacy)
