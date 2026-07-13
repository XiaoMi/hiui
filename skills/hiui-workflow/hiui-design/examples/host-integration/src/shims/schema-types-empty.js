/**
 * @hi-ui/schema-types only ships declarations and has no ESM runtime entry.
 * Vite prebundling can fail when upstream schema packages import it for type merging.
 */
export {}
