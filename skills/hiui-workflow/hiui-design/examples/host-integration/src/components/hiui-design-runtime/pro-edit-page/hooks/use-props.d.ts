import type { ReadonlyRefObject } from '@hi-ui/use-ref-state';
import type { ProEditPageProps } from '../types';
/** 统一化后的 ProEditPage props，供 context 的 propsRef 使用 */
export type NormalizedProEditPageProps = ReturnType<typeof getNormalizedProps>;
declare function getNormalizedProps(props: ProEditPageProps): {
    fields: import("@hi-ui/schema-core").FieldConfigType<AnyObject, Pick<import("@hi-ui/grid").ColProps, "span" | "offset" | "justify" | "order">>[];
    groups: import("@hi-ui/schema-core").GroupConfigType<import("@hi-ui/schema-core").FormGroupType>[] | undefined;
    steps: [] | undefined;
    beforeSubmit: import("../types").BeforeActionFn | undefined;
    beforeStash: import("../types").BeforeActionFn | undefined;
    onCancel: (() => void) | undefined;
    onSubmitSuccess: ((res: import("../types").EditResponse) => void) | undefined;
    onSubmitError: ((res: import("../types").EditResponse) => void) | undefined;
    onStashSuccess: ((res: import("../types").EditResponse) => void) | undefined;
    onStashError: ((res: import("../types").EditResponse) => void) | undefined;
};
export declare function useProps(props: ProEditPageProps): {
    propsRef: ReadonlyRefObject<{
        fields: import("@hi-ui/schema-core").FieldConfigType<AnyObject, Pick<import("@hi-ui/grid").ColProps, "span" | "offset" | "justify" | "order">>[];
        groups: import("@hi-ui/schema-core").GroupConfigType<import("@hi-ui/schema-core").FormGroupType>[] | undefined;
        steps: [] | undefined;
        beforeSubmit: import("../types").BeforeActionFn | undefined;
        beforeStash: import("../types").BeforeActionFn | undefined;
        onCancel: (() => void) | undefined;
        onSubmitSuccess: ((res: import("../types").EditResponse) => void) | undefined;
        onSubmitError: ((res: import("../types").EditResponse) => void) | undefined;
        onStashSuccess: ((res: import("../types").EditResponse) => void) | undefined;
        onStashError: ((res: import("../types").EditResponse) => void) | undefined;
    }>;
};
export { getNormalizedProps };
