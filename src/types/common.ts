/**
 * Sort direction for list queries.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Generic pagination options shared across modules.
 */
export interface PaginationOptions {
  readonly offset?: number;
  readonly limit?: number;
}

/**
 * Folder metadata used by FileStation and Drive operations.
 */
export interface FolderMeta {
  readonly alternatelink: string;
  readonly file_id: string;
  readonly mtime: number;
  readonly parent_id: string;
  readonly title: string;
  readonly path: string;
}
