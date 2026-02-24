/**
 * Synology Directory Server (Active Directory) API module.
 * Ported from Python synology_api/directory_server.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class DirectoryServer extends BaseModule {
  protected readonly application = 'Core';

  async getDirectoryInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveDirectory.Info';

    return this.request(apiName, 'entry.cgi', {
      api: apiName,
      method: 'get',
      version: 3,
    });
  }

  async listDirectoryObjects(
    basedn: string,
    offset = 0,
    limit = 40,
    objectCategory: string[] = ['person', 'group', 'organizationalUnit', 'computer', 'container', 'builtinDomain'],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveDirectory.Directory';

    return this.request(apiName, 'entry.cgi', {
      api: apiName,
      action: '"enum"',
      basedn: `"${basedn}"`,
      limit,
      method: '"list"',
      objectCategory: JSON.stringify(objectCategory),
      offset,
      scope: '"one"',
      version: 3,
    }, { method: 'post' });
  }

  async createNewUser(options: {
    logonName: string;
    email: string;
    password: string;
    locatedDn: string;
    description?: string;
    accountIsDisabled?: string;
    cannotChangePassword?: string;
    changePasswordNextLogon?: string;
    passwordNeverExpire?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveDirectory.User';

    return this.request(apiName, 'entry.cgi', {
      api: apiName,
      version: 1,
      method: 'create',
      logon_name: options.logonName,
      email: options.email,
      password: options.password,
      located_dn: options.locatedDn,
      description: options.description ?? '',
      account_is_disabled: options.accountIsDisabled ?? 'false',
      cannot_change_password: options.cannotChangePassword ?? 'false',
      change_password_next_logon: options.changePasswordNextLogon ?? 'null',
      password_never_expire: options.passwordNeverExpire ?? 'true',
    });
  }

  async resetPassword(username: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Auth.ForgotPwd';

    return this.request(apiName, 'entry.cgi', {
      method: 'send',
      user: `"${username}"`,
      version: 1,
    });
  }

  async changeUserPassword(userDn: string, password: string): Promise<SynoResponse> {
    const compound = JSON.stringify([{
      api: 'SYNO.ActiveDirectory.User',
      method: 'set',
      version: 2,
      userList: [{
        dn: userDn,
        enbl_change_password: true,
        password,
      }],
    }]);

    return this.request('SYNO.Entry.Request', 'entry.cgi', {
      api: 'SYNO.Entry.Request',
      method: 'request',
      compound,
      mode: 'sequential',
      stop_when_error: 'true',
      version: 1,
    });
  }

  async createNewGroup(options: {
    name: string;
    locatedDn: string;
    email?: string;
    description?: string;
    type?: string;
    scope?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveDirectory.Group';

    return this.request(apiName, 'entry.cgi', {
      api: apiName,
      method: 'create',
      name: options.name,
      located_dn: options.locatedDn,
      description: options.description ?? '',
      type: options.type ?? 'security',
      scope: options.scope ?? 'global',
      email: options.email ?? '',
      version: 1,
    });
  }

  async addUserToGroup(userDn: string, groupDn: string): Promise<SynoResponse> {
    const compound = JSON.stringify([{
      api: 'SYNO.ActiveDirectory.Group.Member',
      method: 'add',
      version: '1',
      dn: groupDn,
      members: [userDn],
    }]);

    return this.request('SYNO.Entry.Request', 'entry.cgi', {
      api: 'SYNO.Entry.Request',
      compound,
      method: 'request',
      mode: 'sequential',
      stop_when_error: true,
      version: 1,
    });
  }

  async doesDnExist(name: string): Promise<boolean> {
    const apiName = 'SYNO.ActiveDirectory.Group';

    const response = await this.request(apiName, 'entry.cgi', {
      version: 1,
      method: 'conflict',
      name,
    });

    const data = (response as unknown as Record<string, unknown>).data as Record<string, unknown> | undefined;
    return (data?.isConflict as boolean) ?? false;
  }

  async modifyUserInfo(options: {
    userDn: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    description?: string;
    initials?: string;
    physicalDeliveryOfficeName?: string;
    telephoneNumber?: string;
    web?: string;
  }): Promise<SynoResponse> {
    const userObject: Record<string, unknown> = { dn: options.userDn };

    if (options.firstName !== undefined) userObject.firstName = options.firstName;
    if (options.lastName !== undefined) userObject.lastName = options.lastName;
    if (options.displayName !== undefined) userObject.displayName = options.displayName;
    if (options.initials !== undefined) userObject.initials = options.initials;
    if (options.physicalDeliveryOfficeName !== undefined) {
      userObject.physicalDeliveryOfficeName = options.physicalDeliveryOfficeName;
    }
    if (options.telephoneNumber !== undefined) userObject.telephoneNumber = options.telephoneNumber;
    if (options.web !== undefined) userObject.web = options.web;

    const compound = JSON.stringify([{
      api: 'SYNO.ActiveDirectory.User',
      method: 'set',
      version: 2,
      userList: [userObject],
    }]);

    return this.request('SYNO.Entry.Request', 'entry.cgi', {
      api: 'SYNO.Entry.Request',
      method: 'request',
      compound,
      mode: '"sequential"',
      stop_when_error: true,
      version: 1,
    }, { method: 'post' });
  }

  async updateDomainRecords(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.Domain';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      domain_name: '"@all"',
      method: 'update_start',
      version: info.minVersion,
    });
  }

  async getTaskStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.Domain';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'update_status',
      task_id: taskId,
      version: info.minVersion,
    });
  }

  async deleteItems(dnList: string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveDirectory.Directory';

    const deleteResponse = await this.request(apiName, 'entry.cgi', {
      api: apiName,
      method: 'delete',
      dnList: JSON.stringify(dnList),
      version: 2,
    });

    const data = (deleteResponse as unknown as Record<string, unknown>).data as Record<string, unknown>;
    const taskId = data.task_id as string;

    // Poll until finished
    let result = await this.entryRequest(taskId);
    const resultData = (result as unknown as Record<string, unknown>).data as Record<string, unknown>;
    const results = ((resultData?.result ?? []) as Array<Record<string, unknown>>);

    if (results.length > 0 && results[0]?.data) {
      let notFinished = true;
      while (notFinished) {
        notFinished = false;
        for (const item of results) {
          const itemData = item.data as Record<string, unknown>;
          if (!itemData?.finished) {
            notFinished = true;
          }
        }
        if (notFinished) {
          result = await this.entryRequest(taskId);
        }
      }
    }

    return result;
  }

  async deleteItem(dn: string): Promise<SynoResponse> {
    return this.deleteItems([dn]);
  }

  private async entryRequest(taskId: string): Promise<SynoResponse> {
    const compound = JSON.stringify([{
      api: 'SYNO.ActiveDirectory.Polling',
      method: 'get',
      version: 1,
      task_id: taskId,
    }]);

    return this.request('SYNO.Entry.Request', 'entry.cgi', {
      api: 'SYNO.Entry.Request',
      method: 'request',
      compound,
      mode: 'parallel',
      version: 1,
    });
  }
}
