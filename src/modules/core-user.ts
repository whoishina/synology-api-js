/**
 * Synology Core User API module.
 * Ported from Python synology_api/core_user.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export interface GetUsersOptions {
  readonly offset?: number;
  readonly limit?: number;
  readonly sortBy?: string;
  readonly sortDirection?: 'ASC' | 'DESC';
  readonly additional?: string[];
}

export interface CreateUserOptions {
  readonly name: string;
  readonly password: string;
  readonly description?: string;
  readonly email?: string;
  readonly expire?: string;
  readonly cannotChgPasswd?: boolean;
  readonly passwdNeverExpire?: boolean;
  readonly notifyByEmail?: boolean;
  readonly sendPassword?: boolean;
}

export interface ModifyUserOptions {
  readonly name: string;
  readonly newName: string;
  readonly password?: string;
  readonly description?: string;
  readonly email?: string;
  readonly expire?: string;
  readonly cannotChgPasswd?: boolean;
  readonly passwdNeverExpire?: boolean;
  readonly notifyByEmail?: boolean;
  readonly sendPassword?: boolean;
}

export interface SetPasswordPolicyOptions {
  readonly enableResetPasswdByEmail?: boolean;
  readonly passwordMustChange?: boolean;
  readonly excludeUsername?: boolean;
  readonly includedNumericChar?: boolean;
  readonly includedSpecialChar?: boolean;
  readonly minLength?: number;
  readonly minLengthEnable?: boolean;
  readonly mixedCase?: boolean;
  readonly excludeCommonPassword?: boolean;
  readonly excludeHistory?: boolean;
}

export interface SetPasswordExpiryOptions {
  readonly passwordExpireEnable?: boolean;
  readonly maxAge?: number;
  readonly minAgeEnable?: boolean;
  readonly minAge?: number;
  readonly enableLoginPrompt?: boolean;
  readonly loginPromptDays?: number;
  readonly allowResetAfterExpired?: boolean;
  readonly enableMailNotification?: boolean;
  readonly neverExpiredList?: string[];
}

export class CoreUser extends BaseModule {
  protected readonly application = 'Core';

  async getUsers(options?: GetUsersOptions): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'list',
      version: info.minVersion,
      type: 'local',
      offset: options?.offset ?? 0,
      limit: options?.limit ?? -1,
      sort_by: options?.sortBy ?? 'name',
      sort_direction: options?.sortDirection ?? 'ASC',
      additional: JSON.stringify(options?.additional ?? []),
    });
  }

  async getUser(name: string, additional: string[] = []): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'get',
      type: 'local',
      version: info.minVersion,
      name,
      additional: JSON.stringify(additional),
    });
  }

  async createUser(options: CreateUserOptions): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      method: 'create',
      version: info.minVersion,
      name: options.name,
      password: options.password,
      description: options.description ?? '',
      email: options.email ?? '',
      expired: options.expire ?? 'never',
      cannot_chg_passwd: options.cannotChgPasswd ?? false,
      passwd_never_expire: options.passwdNeverExpire ?? true,
      notify_by_email: options.notifyByEmail ?? false,
      send_password: options.sendPassword ?? false,
    };

    return this.request(apiName, info.path, params, { method: 'post' });
  }

  async modifyUser(options: ModifyUserOptions): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      method: 'set',
      version: info.minVersion,
      name: options.name,
      new_name: options.newName,
      password: options.password ?? '',
      description: options.description ?? '',
      email: options.email ?? '',
      expired: options.expire ?? 'never',
      cannot_chg_passwd: options.cannotChgPasswd ?? false,
      passwd_never_expire: options.passwdNeverExpire ?? true,
      notify_by_email: options.notifyByEmail ?? false,
      send_password: options.sendPassword ?? false,
    };

    return this.request(apiName, info.path, params, { method: 'post' });
  }

  async deleteUser(name: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'delete',
      version: info.minVersion,
      name,
    });
  }

  async affectGroups(
    name: string,
    joinGroups: string[] = [],
    leaveGroups: string[] = [],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'join',
      version: info.minVersion,
      join_group: JSON.stringify(joinGroups),
      leave_group: JSON.stringify(leaveGroups),
      name,
    });
  }

  async affectGroupsStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'join_status',
      version: info.minVersion,
      task_id: taskId,
    });
  }

  async getPasswordPolicy(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.PasswordPolicy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'get',
      version: info.minVersion,
    });
  }

  async setPasswordPolicy(options?: SetPasswordPolicyOptions): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.PasswordPolicy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'set',
      version: info.minVersion,
      enable_reset_passwd_by_email: options?.enableResetPasswdByEmail ?? false,
      password_must_change: options?.passwordMustChange ?? false,
      strong_password: {
        exclude_username: options?.excludeUsername ?? true,
        included_numeric_char: options?.includedNumericChar ?? true,
        included_special_char: options?.includedSpecialChar ?? false,
        min_length_enable: options?.minLengthEnable ?? true,
        min_length: options?.minLength ?? 8,
        mixed_case: options?.mixedCase ?? true,
        exclude_common_password: options?.excludeCommonPassword ?? false,
        exclude_history: options?.excludeHistory ?? false,
      },
    });
  }

  async getPasswordExpiry(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.PasswordExpiry';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'get',
      version: info.minVersion,
    });
  }

  async setPasswordExpiry(options?: SetPasswordExpiryOptions): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.PasswordExpiry';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'set',
      version: info.minVersion,
      password_expire_enable: options?.passwordExpireEnable ?? false,
      max_age: options?.maxAge ?? 30,
      min_age_enable: options?.minAgeEnable ?? false,
      min_age: options?.minAge ?? 1,
      enable_login_prompt: options?.enableLoginPrompt ?? false,
      login_prompt_days: options?.loginPromptDays ?? 1,
      allow_reset_after_expired: options?.allowResetAfterExpired ?? true,
      enable_mail_notification: options?.enableMailNotification ?? false,
      never_expired_list: JSON.stringify(options?.neverExpiredList ?? []),
    });
  }

  async passwordConfirm(password: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.PasswordConfirm';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'auth',
      password,
    }, { method: 'post' });
  }

  async getUsernamePolicy(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.UsernamePolicy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'list',
      version: info.minVersion,
    });
  }
}
