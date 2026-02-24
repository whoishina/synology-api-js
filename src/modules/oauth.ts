/**
 * Synology OAuth API module.
 * Ported from Python synology_api/oauth.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class OAuth extends BaseModule {
  protected readonly application = 'OAUTH';

  async clients(offset = 0, limit = 20): Promise<SynoResponse> {
    const apiName = 'SYNO.OAUTH.Client';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      offset,
      limit,
    });
  }

  async tokens(offset = 0, limit = 20): Promise<SynoResponse> {
    const apiName = 'SYNO.OAUTH.Token';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      offset,
      limit,
    });
  }

  async logs(offset = 0, limit = 20): Promise<SynoResponse> {
    const apiName = 'SYNO.OAUTH.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      action: 'list',
      offset,
      limit,
    });
  }
}
