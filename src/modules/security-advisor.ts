/**
 * Synology Security Advisor API module.
 * Ported from Python synology_api/security_advisor.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class SecurityAdvisor extends BaseModule {
  protected readonly application = 'SecurityAdvisor';

  async getGeneralInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.SecurityAdvisor.Conf.Location';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getSecurityScan(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SecurityScan.Conf';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getChecklist(): Promise<SynoResponse> {
    const apiName = 'SYNO.SecurityAdvisor.Conf.Checklist';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      group: 'home',
    });
  }

  async getLoginActivity(offset = 0, limit = 20): Promise<SynoResponse> {
    const apiName = 'SYNO.SecurityAdvisor.LoginActivity';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      offset,
      limit,
    });
  }

  async getAdvisorConfig(): Promise<SynoResponse> {
    const apiName = 'SYNO.SecurityAdvisor.Conf';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getScanConfig(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SecurityScan.Conf';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'group_enum',
      argGroup: 'custom',
    });
  }
}
