/**
 * Configuration for creating a SynoClient instance.
 */
export interface ClientConfig {
  /** Base URL of the Synology NAS, e.g. 'https://192.168.1.100:5001' */
  readonly baseUrl: string;
  /** Login account name */
  readonly account: string;
  /** Login password */
  readonly password: string;
  /** DSM version (6 or 7), defaults to 7 */
  readonly dsmVersion?: 6 | 7;
  /** One-time password for 2FA */
  readonly otpCode?: string;
  /** Device ID for device binding */
  readonly deviceId?: string;
  /** Device name for device binding */
  readonly deviceName?: string;
  /** Whether to verify SSL certificates, defaults to false */
  readonly certVerify?: boolean;
}

/**
 * Lifecycle events emitted by SynoClient.
 */
export type ClientEvent =
  | 'connect'
  | 'disconnect'
  | 'beforeRequest'
  | 'afterResponse'
  | 'onError';

/**
 * Context passed to the 'beforeRequest' event handler.
 */
export interface BeforeRequestContext {
  readonly apiName: string;
  readonly apiPath: string;
  readonly params: Record<string, unknown>;
}

/**
 * Context passed to the 'afterResponse' event handler.
 */
export interface AfterResponseContext {
  readonly apiName: string;
  readonly response: unknown;
}

/**
 * Options for individual API requests.
 */
export interface RequestOptions {
  /** HTTP method, defaults to 'get' */
  readonly method?: 'get' | 'post';
  /** Whether to return raw Response instead of JSON */
  readonly rawResponse?: boolean;
}

/**
 * A single entry in a compound/batch request.
 */
export interface CompoundEntry {
  readonly api: string;
  readonly method: string;
  readonly version: number | string;
  readonly [key: string]: unknown;
}

/**
 * Options for batch requests.
 */
export interface BatchOptions {
  /** Execution mode: 'sequential' or 'parallel' */
  readonly mode?: 'sequential' | 'parallel';
  /** HTTP method, defaults to 'get' */
  readonly method?: 'get' | 'post';
}
