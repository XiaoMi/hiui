import Input from './Input'
import './style/index'
import InputLegacy from './input-legacy'
import SwitchVersion from '../_util/SwitchVersion'
import Provider from '../context'

export default SwitchVersion(Provider(Input), InputLegacy)
export {Input}
