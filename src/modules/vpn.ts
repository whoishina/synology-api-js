/**
 * Synology VPN Server API module.
 * Ported from Python synology_api/vpn.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class VPN extends BaseModule {
  protected readonly application = 'VPNServer';

  async getSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.VPNServer.Settings.Config';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status_load',
    });
  }

  async getActiveConnections(
    sort = 'login_time',
    sortDir: 'ASC' | 'DESC' = 'DESC',
    start = 0,
    limit = 100,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.VPNServer.Management.Connection';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'enum',
      sort,
      dir: sortDir,
      start,
      limit,
    });
  }

  async getLogs(start = 0, limit = 50, protocolType = 0): Promise<SynoResponse> {
    const apiName = 'SYNO.VPNServer.Management.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
      start,
      limit,
      prtltype: protocolType,
    });
  }

  async getNetworkInterfaceSetting(): Promise<SynoResponse> {
    const apiName = 'SYNO.VPNServer.Management.Interface';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
    });
  }

  async getSecurityAutoblockSetting(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Security.AutoBlock';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getPermissionSetting(start = 0, limit = 100): Promise<SynoResponse> {
    const apiName = 'SYNO.VPNServer.Management.Account';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
      action: 'enum',
      start: String(start),
      limit: String(limit),
    });
  }

  async getPptpSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.VPNServer.Settings.Config';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
      serv_type: 'pptp',
    });
  }

  async getOpenvpnSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.VPNServer.Settings.Config';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
      serv_type: 'openvpn',
    });
  }

  async getL2tpSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.VPNServer.Settings.Config';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
      serv_type: 'l2tp',
    });
  }

  async exportOpenvpnConfig(): Promise<ArrayBuffer> {
    const apiName = 'SYNO.VPNServer.Settings.Certificate';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const response = await this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'export',
      serv_type: 'openvpn',
    }, { rawResponse: true });

    return response as unknown as ArrayBuffer;
  }
}
