import type { TextAreaProps } from '@hi-ui/textarea';
import { ProTextArea } from '@hi-ui/schema-fields/bundle';
import type { ProFieldRenderFormItemCtx } from '@hi-ui/schema-core';
import './stable-pro-textarea.scss';
/** Schema `textarea` 字段：长文本编辑页推荐替换默认 ProTextArea */
export declare class StableProTextArea extends ProTextArea {
    renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<TextAreaProps>): import("react/jsx-runtime").JSX.Element;
}
