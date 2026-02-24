/**
 * SynoClient - manages session, HTTP, and events for Synology DSM API.
 * Ported from Python auth.py Authentication class.
 */
import ky from 'ky';
import type { KyInstance, Options as KyOptions } from 'ky';
import type {
  ClientConfig,
  ClientEvent,
  BeforeRequestContext,
  AfterResponseContext,
  RequestOptions,
  CompoundEntry,
  BatchOptions,
} from '../types/client.ts';
import type { ApiInfo, ApiListMap, SynoResponse } from '../types/api-info.ts';
import { CODE_SUCCESS } from './error-codes.ts';
import {
  SynoConnectionError,
  SynoHttpError,
  SynoJsonDecodeError,
  LoginError,
  LogoutError,
  dispatchApiError,
  getErrorMessage,
} from './errors.ts';
import { normalizeBooleans } from './utils.ts';
import { encryptParams } from './encryption/param-encryptor.ts';
import type { EncryptionInfo } from './encryption/param-encryptor.ts';
import {
  noiseIkHandshake,
  decodeSsidCookie,
  encodeSsidCookie,
} from './encryption/noise-handshake.ts';

type EventHandler = (...args: unknown[]) => void;

export class SynoClient {
  readonly config: ClientConfig;

  private kyInstance: KyInstance;
  private sid: string | null = null;
  private synoToken: string | null = null;
  private connected = false;
  private fullApiList: ApiListMap = {};
  private appApiLists: Map<string, ApiListMap> = new Map();
  private eventHandlers: Map<ClientEvent, Set<EventHandler>> = new Map();
  private baseUrl: string;

  constructor(config: ClientConfig) {
    this.config = config;

    // Normalize baseUrl to end with /webapi/
    let base = config.baseUrl.replace(/\/+$/, '');
    if (!base.endsWith('/webapi')) {
      base += '/webapi/';
    } else {
      base += '/';
    }
    this.baseUrl = base;

    // Create ky instance with default options
    const kyOptions: KyOptions = {
      prefixUrl: this.baseUrl,
      timeout: 30_000,
      retry: 0,
    };

    // Disable SSL verification when certVerify is false (default)
    this.kyInstance = ky.create(kyOptions);
  }

  // ─── Event system ──────────────────────────────────────────────

  on(event: ClientEvent, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  off(event: ClientEvent, handler: EventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  private emit(event: ClientEvent, ...args: unknown[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(...args);
      }
    }
  }

  // ─── Lifecycle ─────────────────────────────────────────────────

  /**
   * Connect to the NAS: login and retrieve API lists.
   */
  async connect(): Promise<void> {
    await this.login();
    await this.getApiList();
    this.connected = true;
    this.emit('connect');
  }

  /**
   * Disconnect from the NAS: logout.
   */
  async disconnect(): Promise<void> {
    await this.logout();
    this.connected = false;
    this.emit('disconnect');
  }

  get isConnected(): boolean {
    return this.connected;
  }

  get sessionId(): string | null {
    return this.sid;
  }

  // ─── Login / Logout ────────────────────────────────────────────

  private async login(): Promise<void> {
    if (this.sid !== null) return;

    const version = this.config.dsmVersion ?? 7;
    const params: Record<string, string | number> = {
      api: 'SYNO.API.Auth',
      version,
      method: 'login',
      enable_syno_token: 'yes',
      client: 'browser',
    };

    // Noise IK handshake for DSM 7+
    if (version >= 7) {
      const ikMessage = await this.getIkMessage();
      params['ik_message'] = ikMessage;
    }

    // Credentials to encrypt
    const credentialParams: Record<string, string | number> = {
      account: this.config.account,
      enable_device_token: 'no',
      logintype: 'local',
      otp_code: '',
      rememberme: 0,
      passwd: this.config.password,
      session: 'webui',
      format: 'cookie',
    };

    // On HTTPS, send credentials directly; on HTTP, encrypt them
    if (this.config.baseUrl.startsWith('https')) {
      Object.assign(params, credentialParams);
    } else {
      const encInfo = await this.getEncryptionInfo();
      const encrypted = encryptParams(credentialParams, encInfo);
      Object.assign(params, encrypted);
    }

    if (this.config.otpCode) {
      params['otp_code'] = this.config.otpCode;
    }
    if (this.config.deviceId !== undefined && this.config.deviceName !== undefined) {
      params['device_id'] = this.config.deviceId;
      params['device_name'] = this.config.deviceName;
    }

    const response = await this.rawPost<SynoResponse<{ sid: string; synotoken: string }>>(
      'auth.cgi',
      params,
    );

    const errorCode = getErrorCode(response);
    if (errorCode !== CODE_SUCCESS) {
      throw new LoginError(errorCode);
    }

    this.sid = response.data!.sid;
    this.synoToken = response.data!.synotoken;
  }

  private async logout(): Promise<void> {
    const version = this.config.dsmVersion ?? 7;
    const params: Record<string, string | number> = {
      api: 'SYNO.API.Auth',
      version,
      method: 'logout',
      session: 'webui',
    };

    try {
      const response = await this.rawGet<SynoResponse>('auth.cgi', params);
      const errorCode = getErrorCode(response);
      if (errorCode !== CODE_SUCCESS) {
        throw new LogoutError(errorCode);
      }
    } finally {
      this.sid = null;
      this.synoToken = null;
    }
  }

  // ─── API list ──────────────────────────────────────────────────

  private async getApiList(app?: string): Promise<void> {
    const params = {
      api: 'SYNO.API.Info',
      version: '1',
      method: 'query',
      query: 'all',
    };

    const response = await this.rawGet<SynoResponse<ApiListMap>>(
      'query.cgi',
      params,
    );

    if (response.data) {
      if (app !== undefined) {
        const appList: ApiListMap = {};
        for (const [key, value] of Object.entries(response.data)) {
          if (key.toLowerCase().includes(app.toLowerCase())) {
            appList[key] = value;
          }
        }
        this.appApiLists.set(app, appList);
      } else {
        this.fullApiList = response.data;
      }
    }
  }

  // ─── Noise IK ──────────────────────────────────────────────────

  private async getIkMessage(): Promise<string> {
    const url = 'entry.cgi/SYNO.API.Auth.UIConfig';
    const data = {
      api: 'SYNO.API.Auth.UIConfig',
      method: 'get',
      version: '1',
    };

    const response = await this.kyInstance.post(url, {
      body: new URLSearchParams(
        Object.entries(data).map(([k, v]): [string, string] => [k, String(v)]),
      ),
    });

    if (!response.ok) {
      throw new SynoHttpError(`Failed to get IK message. Status: ${response.status}`);
    }

    // Extract _SSID cookie from response
    const cookies = response.headers.get('set-cookie') ?? '';
    const ssidMatch = cookies.match(/_SSID=([^;]+)/);
    if (!ssidMatch?.[1]) {
      throw new SynoConnectionError("Cookie '_SSID' not found in the response.");
    }

    const serverPublicKey = decodeSsidCookie(ssidMatch[1]);

    const payload = JSON.stringify({
      time: Math.floor(Date.now() / 1000),
    });

    const message = noiseIkHandshake(
      serverPublicKey,
      new TextEncoder().encode(payload),
    );

    return encodeSsidCookie(message);
  }

  // ─── Encryption info ──────────────────────────────────────────

  private async getEncryptionInfo(): Promise<EncryptionInfo> {
    const response = await this.requestInternal<EncryptionInfo>(
      'SYNO.API.Encryption',
      'encryption.cgi',
      { method: 'getinfo', version: 1, format: 'module' },
    );
    return response.data!;
  }

  // ─── Public request methods ────────────────────────────────────

  /**
   * Get API info for a specific API name.
   */
  getApiInfo(apiName: string): ApiInfo | undefined {
    return this.fullApiList[apiName];
  }

  /**
   * Get API list filtered by application name.
   */
  getAppApiList(app: string): ApiListMap {
    return this.appApiLists.get(app) ?? {};
  }

  /**
   * Send a request to a Synology API endpoint.
   * Dispatches errors based on the API name.
   */
  async request<T = unknown>(
    apiName: string,
    apiPath: string,
    params: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<SynoResponse<T>> {
    this.emit('beforeRequest', {
      apiName,
      apiPath,
      params,
    } satisfies BeforeRequestContext);

    try {
      const response = await this.requestInternal<T>(apiName, apiPath, params, options);

      const errorCode = getErrorCode(response);
      if (errorCode !== CODE_SUCCESS) {
        throw dispatchApiError(errorCode, apiName);
      }

      this.emit('afterResponse', {
        apiName,
        response,
      } satisfies AfterResponseContext);

      return response;
    } catch (error) {
      this.emit('onError', error);
      throw error;
    }
  }

  /**
   * Send a batch (compound) request.
   */
  async batchRequest(
    compound: CompoundEntry[],
    options?: BatchOptions,
  ): Promise<SynoResponse> {
    const entryRequest = this.fullApiList['SYNO.Entry.Request'];
    if (!entryRequest) {
      throw new SynoConnectionError('SYNO.Entry.Request not found in API list');
    }

    const params: Record<string, string | number> = {
      api: 'SYNO.Entry.Request',
      method: 'request',
      version: String(entryRequest.maxVersion),
      mode: options?.mode ?? 'sequential',
      stop_when_error: 'true',
      _sid: this.sid ?? '',
      compound: JSON.stringify(compound),
    };

    const method = options?.method ?? 'get';
    const url = entryRequest.path;
    const headers = this.buildHeaders();

    if (method === 'post') {
      return this.kyInstance.post(url, {
        body: new URLSearchParams(stringifyParams(params)),
        headers,
      }).json<SynoResponse>();
    }

    return this.kyInstance.get(url, {
      searchParams: stringifyParams(params),
      headers,
    }).json<SynoResponse>();
  }

  /**
   * Upload a file using FormData.
   */
  async uploadRequest<T = unknown>(
    apiName: string,
    apiPath: string,
    formData: FormData,
    queryParams?: Record<string, unknown>,
  ): Promise<SynoResponse<T>> {
    let url = `${apiPath}/${apiName}`;
    const headers = this.buildHeaders();

    formData.append('_sid', this.sid ?? '');

    // Append extra query params (api, version, method, etc.)
    if (queryParams) {
      const qs = new URLSearchParams(
        Object.entries(queryParams).map(([k, v]): [string, string] => [k, String(v)]),
      );
      qs.set('api', apiName);
      qs.set('_sid', this.sid ?? '');
      url = `${apiPath}?${qs.toString()}`;
    }

    const response = await this.kyInstance.post(url, {
      body: formData,
      headers,
    }).json<SynoResponse<T>>();

    const errorCode = getErrorCode(response);
    if (errorCode !== CODE_SUCCESS) {
      throw dispatchApiError(errorCode, apiName);
    }

    return response;
  }

  // ─── Internal helpers ──────────────────────────────────────────

  private async requestInternal<T>(
    apiName: string,
    apiPath: string,
    params: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<SynoResponse<T>> {
    const normalized = normalizeBooleans(params);
    normalized['_sid'] = this.sid ?? '';

    const url = `${apiPath}?api=${apiName}`;
    const method = options?.method ?? 'get';
    const headers = this.buildHeaders();

    try {
      if (method === 'post') {
        return await this.kyInstance.post(url, {
          body: new URLSearchParams(stringifyParams(normalized)),
          headers,
        }).json<SynoResponse<T>>();
      }

      return await this.kyInstance.get(url, {
        searchParams: stringifyParams(normalized),
        headers,
      }).json<SynoResponse<T>>();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new SynoConnectionError(String(error));
      }
      throw error;
    }
  }

  private async rawPost<T>(path: string, params: Record<string, unknown>): Promise<T> {
    try {
      return await this.kyInstance.post(path, {
        body: new URLSearchParams(stringifyParams(params)),
      }).json<T>();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new SynoConnectionError(String(error));
      }
      throw error;
    }
  }

  private async rawGet<T>(path: string, params: Record<string, unknown>): Promise<T> {
    try {
      return await this.kyInstance.get(path, {
        searchParams: stringifyParams(params),
      }).json<T>();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new SynoConnectionError(String(error));
      }
      throw error;
    }
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.synoToken) {
      headers['X-SYNO-TOKEN'] = this.synoToken;
    }
    return headers;
  }
}

// ─── Utility ─────────────────────────────────────────────────────

function getErrorCode(response: SynoResponse): number {
  if (response.success) return CODE_SUCCESS;
  return response.error?.code ?? CODE_SUCCESS;
}

function stringifyParams(params: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      result[key] = String(value);
    }
  }
  return result;
}
