/**
 * Synology USB Copy API module.
 * Ported from Python synology_api/usb_copy.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class USBCopy extends BaseModule {
  protected readonly application = 'USBCopy';

  async getPackageSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.USBCopy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get_global_setting',
    });
  }

  async getPackageLogs(offset = 0, limit = 200): Promise<SynoResponse> {
    const apiName = 'SYNO.USBCopy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get_log_list',
      offset,
      limit,
      log_filter: '{"log_desc_id_list":[0,1,2,3,10,11,100,101,102,103,104,105,1000]}',
    });
  }

  async getTaskSettings(taskId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.USBCopy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      id: taskId,
    });
  }

  async toggleTask(taskId: number, enable = true): Promise<SynoResponse> {
    const apiName = 'SYNO.USBCopy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: enable ? 'enable' : 'disable',
      id: taskId,
    });
  }
}
