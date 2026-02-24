/**
 * Synology Drive Admin Console API module.
 * Ported from Python synology_api/drive_admin_console.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class DriveAdminConsole extends BaseModule {
  protected readonly application = 'SynologyDrive';

  async statusInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get_status',
    });
  }

  async configInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Config';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async connections(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Connection';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'summary',
    });
  }

  async checkUser(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'check_user',
    });
  }

  async activeConnections(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Connection';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async activeSyncConnections(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDriveShareSync.Connection';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async shareActiveList(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list_active',
    });
  }

  async getLogs(options?: {
    shareType?: string;
    getAll?: boolean;
    limit?: number;
    keyword?: string;
    dateFrom?: number;
    dateTo?: number;
    username?: string;
    target?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      share_type: options?.shareType ?? 'all',
      get_all: options?.getAll ? 'true' : 'false',
      limit: options?.limit ?? 1000,
      keyword: options?.keyword ?? '',
      datefrom: options?.dateFrom ?? 0,
      dateto: options?.dateTo ?? 0,
      username: options?.username ?? '',
      target: options?.target ?? 'user',
    });
  }

  async c2fsShare(): Promise<SynoResponse> {
    const apiName = 'SYNO.C2FS.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async settings(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Settings';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async dbUsage(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.DBUsage';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async deleteStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Node.Delete';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
    });
  }

  async filePropertyTransferStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Migration.UserHome';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
    });
  }

  async userSyncProfile(
    user = '',
    start = 0,
    limit: string | number = 'null',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Profiles';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      start,
      limit,
      user,
    });
  }

  async indexPause(timePause = 60): Promise<SynoResponse> {
    const apiName = 'SYNO.SynologyDrive.Index';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set_native_client_index_pause',
      pause_duration: timePause,
    });
  }
}
