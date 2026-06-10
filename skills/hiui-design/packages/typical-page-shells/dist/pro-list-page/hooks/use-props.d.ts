import type { ProListPageProps } from '../types';
import { ReadonlyRefObject } from '@hi-ui/use-ref-state';
/** 统一化后的 ProListPage props，供 context 的 propsRef 使用 */
export type NormalizedProListPageProps = ProListPageProps;
declare function getNormalizedProps(props: ProListPageProps): NormalizedProListPageProps;
export declare function useProps(props: ProListPageProps): {
    propsRef: ReadonlyRefObject<ProListPageProps>;
};
export { getNormalizedProps };
