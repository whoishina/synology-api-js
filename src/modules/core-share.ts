/**
 * Synology Core Share API module.
 * Ported from Python synology_api/core_share.py
 *
 * Includes: Share, SharePermission, KeyManagerStore, KeyManagerAutoKey
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

interface ShareInfo {
  name: string;
  vol_path: string;
  desc?: string;
  enable_share_compress?: boolean;
  enable_share_cow?: boolean;
  enc_passwd?: string;
  encryption?: boolean;
}

interface CreateFolderOptions {
  name: string;
  volPath: string;
  desc?: string;
  hidden?: boolean;
  enableRecycleBin?: boolean;
  recycleBinAdminOnly?: boolean;
  hideUnreadable?: boolean;
  enableShareCow?: boolean;
  enableShareCompress?: boolean;
  shareQuota?: number;
  nameOrg?: string;
  encryption?: boolean;
  encPasswd?: string;
}

interface CloneFolderOptions {
  name: string;
  nameOrg: string;
  volPath: string;
  desc?: string;
  hidden?: boolean;
  enableRecycleBin?: boolean;
  recycleBinAdminOnly?: boolean;
  hideUnreadable?: boolean;
  enableShareCow?: boolean;
  enableShareCompress?: boolean;
  shareQuota?: number;
}

interface PermissionEntry {
  name: string;
  is_writable?: boolean;
  is_readonly?: boolean;
  is_deny?: boolean;
  [key: string]: unknown;
}

export class CoreShare extends BaseModule {
  protected readonly application = 'Core';

  // ---------- Share ----------

  async validateSet(
    name: string,
    volPath: string,
    desc = '',
    enableShareCompress = false,
    enableShareCow = false,
    encPasswd = '',
    encryption = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const shareinfo: ShareInfo = {
      name,
      vol_path: volPath,
      desc,
      enable_share_compress: enableShareCompress,
      enable_share_cow: enableShareCow,
      enc_passwd: encPasswd,
      encryption,
    };

    return this.request(apiName, info.path, {
      method: 'validate_set',
      version: info.maxVersion,
      name,
      shareinfo: JSON.stringify(shareinfo),
    }, { method: 'post' });
  }

  async listFolders(
    shareType = 'all',
    additional: string[] = [],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'list',
      version: info.minVersion,
      shareType,
      additional: JSON.stringify(additional),
    });
  }

  async getFolder(name: string, additional: string[] = []): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'get',
      version: info.minVersion,
      name,
      additional: JSON.stringify(additional),
    });
  }

  async createFolder(options: CreateFolderOptions): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const shareinfo = {
      desc: options.desc ?? '',
      enable_recycle_bin: options.enableRecycleBin ?? true,
      enable_share_compress: options.enableShareCompress ?? false,
      enable_share_cow: options.enableShareCow ?? false,
      name: options.name,
      name_org: options.nameOrg ?? '',
      vol_path: options.volPath,
      recycle_bin_admin_only: options.recycleBinAdminOnly ?? true,
      hidden: options.hidden ?? false,
      hide_unreadable: options.hideUnreadable ?? false,
      share_quota: options.shareQuota ?? 0,
      encryption: options.encryption ?? false,
      enc_passwd: options.encPasswd ?? '',
    };

    return this.request(apiName, info.path, {
      method: 'create',
      version: info.maxVersion,
      name: options.name,
      shareinfo: JSON.stringify(shareinfo),
    }, { method: 'post' });
  }

  async deleteFolders(names: string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'delete',
      version: info.minVersion,
      name: names,
    });
  }

  async cloneFolder(options: CloneFolderOptions): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const shareinfo = {
      desc: options.desc ?? '',
      enable_recycle_bin: options.enableRecycleBin ?? true,
      enable_share_compress: options.enableShareCompress ?? false,
      enable_share_cow: options.enableShareCow ?? false,
      name: options.name,
      name_org: options.nameOrg,
      vol_path: options.volPath,
      recycle_bin_admin_only: options.recycleBinAdminOnly ?? true,
      hidden: options.hidden ?? false,
      hide_unreadable: options.hideUnreadable ?? false,
      share_quota: options.shareQuota ?? 0,
    };

    return this.request(apiName, info.path, {
      method: 'clone',
      version: info.maxVersion,
      name: options.name,
      shareinfo: JSON.stringify(shareinfo),
    }, { method: 'post' });
  }

  async decryptFolder(name: string, password: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Crypto';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'decrypt',
      version: info.maxVersion,
      name,
      password,
    }, { method: 'post' });
  }

  async encryptFolder(name: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Crypto';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'encrypt',
      version: info.maxVersion,
      name,
    }, { method: 'post' });
  }

  // ---------- SharePermission ----------

  async getFolderPermissionByName(
    name: string,
    permissionSubstr: string,
    offset = 0,
    limit = 50,
    isUnitePermission = false,
    withInherit = false,
    userGroupType = 'local_user',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Permission';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
      name,
      offset,
      limit,
      action: 'find',
      substr: permissionSubstr,
      is_unite_permission: isUnitePermission,
      with_inherit: withInherit,
      user_group_type: userGroupType,
    });
  }

  async getFolderPermissions(
    name: string,
    offset = 0,
    limit = 50,
    isUnitePermission = false,
    withInherit = false,
    userGroupType = 'local_user',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Permission';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
      name,
      offset,
      limit,
      action: 'enum',
      is_unite_permission: isUnitePermission,
      with_inherit: withInherit,
      user_group_type: userGroupType,
    });
  }

  async setFolderPermissions(
    name: string,
    userGroupType: string,
    permissions: PermissionEntry[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Permission';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set',
      name,
      user_group_type: userGroupType,
      permissions: JSON.stringify(permissions),
    });
  }

  async getLocalGroupPermissions(group: string): Promise<SynoResponse> {
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

  async setLocalGroupPermissions(
    group: string,
    permissions: PermissionEntry[],
  ): Promise<SynoResponse> {
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

  // ---------- KeyManagerStore ----------

  async getKeyManagerStores(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.KeyManager.Store';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'explore',
    });
  }

  // ---------- KeyManagerAutoKey ----------

  async listAutoKeys(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.KeyManager.AutoKey';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
    });
  }
}
