import Tree from './Tree'
import TreeLegacy from '../tree-v1/index'
import SwitchVersion from '../../../_util/SwitchVersion'
import Provider from '../../../context'
export default SwitchVersion(Provider(Tree), TreeLegacy)
