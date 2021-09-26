import {ReactQuill} from 'react-quill'
export interface RichTextEditorProps extends ReactQuill {
  showTooltip?: boolean
  tooltipTitle?: string,
  toolbarsName?: string
}
declare const RichTextEditor: React.ComponentType<RichTextEditorProps>
export default RichTextEditor
