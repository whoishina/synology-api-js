/**
 * API endpoint information returned by SYNO.API.Info.
 */
export interface ApiInfo {
  readonly path: string;
  readonly minVersion: number;
  readonly maxVersion: number;
  readonly requestFormat?: string;
}

/**
 * Map of API name to its endpoint info.
 */
export type ApiListMap = Record<string, ApiInfo>;

/**
 * Standard Synology API response envelope.
 */
export interface SynoResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: number;
    readonly errors?: unknown[];
  };
}
