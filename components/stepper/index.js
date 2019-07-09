import Stepper from './Stepper'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'
import StepperLegacy from './stepper-legacy/index'

export default SwitchVersion(Stepper, StepperLegacy)
