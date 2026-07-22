export const CANDIDATE_IGNORE_MARKER = 'hiui-design candidate: ignore'

export function hasManagedPageIgnoreMarker(sourceRaw) {
  return String(sourceRaw || '').includes(CANDIDATE_IGNORE_MARKER)
}
