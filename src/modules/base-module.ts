/**
 * Abstract base class for all Synology API modules.
 * Ported from Python base_api.py BaseApi class.
 */
import type { SynoClient } from '../core/client.ts';
import type { ApiInfo, SynoResponse } from '../types/api-info.ts';
import type { RequestOptions, CompoundEntry, BatchOptions } from '../types/client.ts';

export abstract class BaseModule {
  protected readonly client: SynoClient;

  /**
   * Application name used to filter API lists.
   * Override in subclasses (e.g., 'Core', 'FileStation', 'DownloadStation').
   */
  protected abstract readonly application: string;

  constructor(client: SynoClient) {
    this.client = client;
  }

  /**
   * Get API endpoint info for a specific API name.
   */
  protected getApiInfo(apiName: string): ApiInfo | undefined {
    return this.client.getApiInfo(apiName);
  }

  /**
   * Send a request to a Synology API.
   */
  protected request<T = unknown>(
    apiName: string,
    apiPath: string,
    params: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<SynoResponse<T>> {
    return this.client.request<T>(apiName, apiPath, params, options);
  }

  /**
   * Send a batch (compound) request.
   */
  protected batchRequest(
    compound: CompoundEntry[],
    options?: BatchOptions,
  ): Promise<SynoResponse> {
    return this.client.batchRequest(compound, options);
  }

  /**
   * Upload a file using FormData.
   */
  protected uploadRequest<T = unknown>(
    apiName: string,
    apiPath: string,
    formData: FormData,
    queryParams?: Record<string, unknown>,
  ): Promise<SynoResponse<T>> {
    return this.client.uploadRequest<T>(apiName, apiPath, formData, queryParams);
  }
}
