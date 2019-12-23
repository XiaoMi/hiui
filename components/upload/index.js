import Upload from './main.js'
import SwitchVersion from '../_util/SwitchVersion'
import UploadLegacy from './upload-legacy'
import Provider from '../context'

export default SwitchVersion(Provider(Upload), UploadLegacy)
