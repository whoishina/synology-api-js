/**
 * Utility functions for Synology API operations.
 * Ported from Python synology_api/utils.py
 */
import { randomBytes } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { basename } from 'node:path';

/**
 * Read a local file as a Blob with metadata.
 * Prefers Bun.file() when available, falls back to node:fs for Node.js.
 */
export async function readLocalFile(filePath: string): Promise<{
  blob: Blob;
  size: number;
  name: string;
}> {
  const name = basename(filePath);

  if (typeof globalThis.Bun !== 'undefined') {
    const file = Bun.file(filePath);
    if (!(await file.exists())) {
      throw new Error(`File not found: ${filePath}`);
    }
    return { blob: file, size: file.size, name };
  }

  const stats = await stat(filePath).catch(() => null);
  if (!stats) {
    throw new Error(`File not found: ${filePath}`);
  }
  const buffer = await readFile(filePath);
  return { blob: new Blob([buffer]), size: stats.size, name };
}

/**
 * Merge two record objects. Values from `b` override `a`.
 */
export function mergeDicts<T extends Record<string, unknown>>(a: T, b: T): T {
  return { ...a, ...b };
}

/**
 * Create a list of folder metadata objects from a given path.
 * Splits the path by '/' and creates metadata entries for each component.
 */
export function makeFolderMetaListFromPath(path: string): Array<{
  alternatelink: string;
  file_id: string;
  mtime: number;
  parent_id: string;
  title: string;
  path: string;
}> {
  const parts = path.split('/').filter(Boolean);
  return parts.map((folder) => ({
    alternatelink: '',
    file_id: '',
    mtime: 0,
    parent_id: '',
    title: '',
    path: `/${folder}`,
  }));
}

/**
 * Generate a multipart boundary mimicking Firefox/Gecko format.
 */
export function generateGeckoBoundary(): string {
  const hex = randomBytes(16).toString('hex');
  return `----geckoformboundary${hex}`;
}

/**
 * Validate a Synology FileStation path.
 *
 * Rules:
 * - Must start with '/'
 * - Must not contain forbidden characters: * ? " < > |
 * - Must not end with space, tab, or '/'
 * - If the path has an extension, no spaces are allowed in the extension
 */
export function validatePath(path: string | string[]): boolean {
  const pathPattern = /^\/[^*?"<>|]+$/;

  function isValid(singlePath: string): boolean {
    if (typeof singlePath !== 'string') return false;
    if (!pathPattern.test(singlePath)) return false;
    const last = singlePath[singlePath.length - 1];
    if (last === ' ' || last === '\t' || last === '/') return false;
    const parts = singlePath.split('.');
    if (parts.length >= 2) {
      const ext = parts[parts.length - 1];
      if (ext !== undefined && ext.includes(' ')) return false;
    }
    return true;
  }

  if (typeof path === 'string') return isValid(path);
  if (Array.isArray(path)) return path.every((p) => typeof p === 'string' && isValid(p));
  return false;
}

/**
 * Build a FormData payload for file upload requests.
 *
 * @param filePath - Path to the file to upload
 * @param fields - Additional form fields
 * @param calledFrom - Calling module name ('DownloadStation' or 'FileStation')
 * @returns FormData ready for upload
 */
export async function buildUploadFormData(
  filePath: string,
  fields: Record<string, string>,
  calledFrom: 'DownloadStation' | 'FileStation' = 'DownloadStation',
): Promise<FormData> {
  const { blob, size, name } = await readLocalFile(filePath);
  const formData = new FormData();

  // Add text fields
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  formData.append('size', String(size));

  // Add file field
  const fieldName = calledFrom === 'FileStation' ? 'files' : 'torrent';
  formData.append(fieldName, blob, name);

  return formData;
}

/**
 * Convert boolean values in a params object to lowercase strings.
 * Synology API expects "true"/"false" strings.
 */
export function normalizeBooleans(params: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    result[key] = typeof value === 'boolean' ? String(value) : value;
  }
  return result;
}
