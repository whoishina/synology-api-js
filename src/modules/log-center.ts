/**
 * Synology Log Center API module.
 * Ported from Python synology_api/log_center.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class LogCenter extends BaseModule {
  protected readonly application = 'LogCenter';

  async getReceiveRules(): Promise<SynoResponse> {
    const apiName = 'SYNO.LogCenter.RecvRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async getClientStatusCount(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SyslogClient.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'cnt_get',
    });
  }

  async getClientStatusEps(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SyslogClient.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'eps_get',
    });
  }

  async getRemoteLogArchives(): Promise<SynoResponse> {
    const apiName = 'SYNO.LogCenter.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get_remotearch_subfolder',
    });
  }

  async getLogs(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SyslogClient.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async getStorageSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.LogCenter.Setting.Storage';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getRegistrySendList(): Promise<SynoResponse> {
    const apiName = 'SYNO.LogCenter.Client';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getHistory(): Promise<SynoResponse> {
    const apiName = 'SYNO.LogCenter.History';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }
}
