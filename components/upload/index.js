import Upload from './main.js'
import SwitchVersion from '../_util/SwitchVersion'
import UploadLegacy from './upload-legacy'

export default SwitchVersion(Upload, UploadLegacy)
