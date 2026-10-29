import { ProCheckSelect } from '@hi-ui/schema-fields/bundle';
/**
 * Schema 表单内 CheckSelect：TagInputMock 依赖 ResizeDetector 量宽。
 * 在 Grid + flex 链上宽度不稳定时，内联 maxWidth 会把标签文案裁成只剩关闭图标或计数。
 * 默认开启 wrap，样式层再兜底覆盖异常的内联 maxWidth。
 */
export declare class StableProCheckSelect extends ProCheckSelect {
    getSelfFieldProps(ctx: Parameters<ProCheckSelect['getSelfFieldProps']>[0]): ReturnType<ProCheckSelect['getSelfFieldProps']>;
}
