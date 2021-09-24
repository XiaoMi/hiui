import {ReactQuill} from 'react-quill'
export interface Props extends ReactQuill{
  showTooltip?: boolean
  tooltipTitle?: string,
  toolbarsName?: string
}
declare const RichTextEditor: React.ComponentType<Props>
export default RichTextEditor
