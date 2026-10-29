import type { ProDetailPageProps } from '../types';
import { ReadonlyRefObject } from '@hi-ui/use-ref-state';
/** 统一化后的 ProDetailPage props，供 context 的 propsRef 使用 */
export type NormalizedProDetailPageProps = ProDetailPageProps;
declare function getNormalizedProps(props: ProDetailPageProps): NormalizedProDetailPageProps;
export declare function useProps(props: ProDetailPageProps): {
    propsRef: ReadonlyRefObject<ProDetailPageProps>;
};
export { getNormalizedProps };
