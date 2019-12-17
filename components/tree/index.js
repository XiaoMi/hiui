import Tree from './Tree'
import TreeLegacy from './tree-legacy/index'
import SwitchVersion from '../_util/SwitchVersion'
export default SwitchVersion(Tree, TreeLegacy)
