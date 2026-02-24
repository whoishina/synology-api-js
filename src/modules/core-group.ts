/**
 * Synology Core Group API module.
 * Ported from Python synology_api/core_group.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export interface GetGroupsOptions {
  readonly offset?: number;
  readonly limit?: number;
  readonly nameOnly?: boolean;
}

export class CoreGroup extends BaseModule {
  protected readonly application = 'Core';

  async getGroups(options?: GetGroupsOptions): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      offset: options?.offset ?? 0,
      limit: options?.limit ?? -1,
      name_only: options?.nameOnly ?? false,
      type: 'local',
    });
  }

  async getUsers(group: string, inGroup = true): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Group.Member';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
      group,
      ingroup: inGroup,
    });
  }

  async getSpeedLimits(group: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.BandwidthControl';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 2,
      method: 'get',
      name: group,
      owner_type: 'local_group',
    });
  }

  async getQuota(group: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Quota';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'get',
      name: group,
      subject_type: 'group',
      support_share_quota: true,
    });
  }

  async getPermissions(group: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Permission';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list_by_group',
      name: group,
      user_group_type: 'local_group',
      share_type: JSON.stringify(['dec', 'local', 'usb', 'sata', 'cluster', 'c2', 'cold_storage', 'worm']),
      additional: JSON.stringify(['hidden', 'encryption', 'is_aclmode']),
    });
  }

  async setGroupInfo(group: string, newName?: string, newDescription?: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set',
      name: group,
      new_name: newName ?? group,
      description: newDescription ?? '',
    });
  }

  async setShareQuota(group: string, shareQuotas: Record<string, unknown>[]): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Quota';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set',
      name: group,
      group_quota: JSON.stringify(shareQuotas),
    });
  }

  async setSharePermissions(group: string, permissions: Record<string, unknown>[]): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Permission';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set_by_user_group',
      name: group,
      user_group_type: 'local_group',
      permissions: JSON.stringify(permissions),
    });
  }

  async setSpeedLimit(
    group: string,
    uploadLimit: number,
    downloadLimit: number,
    protocol: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.BandwidthControl';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const settings = [{
      upload_limit_1: uploadLimit,
      download_limit_1: downloadLimit,
      policy: 'enabled',
      protocol,
      owner_type: 'local_group',
      schedule_plan: '1'.repeat(168),
      upload_limit_2: 0,
      download_limit_2: 0,
      name: group,
    }];

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set',
      bandwidths: JSON.stringify(settings),
    });
  }

  async addUsers(group: string, users: string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Group.Member';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'change',
      group,
      add_member: JSON.stringify(users),
      remove_member: '[]',
    });
  }

  async removeUsers(group: string, users: string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Group.Member';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'change',
      group,
      add_member: '[]',
      remove_member: JSON.stringify(users),
    });
  }

  async create(name: string, description = ''): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'create',
      name,
      description,
    });
  }

  async delete(groups: string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'delete',
      name: JSON.stringify(groups),
    });
  }
}
