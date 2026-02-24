/**
 * Synology Virtual Machine Manager API module.
 * Ported from Python synology_api/virtualization.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class Virtualization extends BaseModule {
  protected readonly application = 'Virtualization';

  async getTaskList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Task.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async clearTask(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Task.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'clear',
      taskid: taskId,
    });
  }

  async getTaskInfo(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Task.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      taskid: taskId,
    });
  }

  async getNetworkGroupList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Network';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async getStorageOperation(): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Storage';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async getHostOperation(): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Host';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async getVmOperation(additional = false): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      additional,
    });
  }

  async getSpecificVmInfo(options: {
    guestId?: string;
    guestName?: string;
    additional?: string | string[];
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (!options.guestId && !options.guestName) {
      throw new Error('Specify at least one of guestId or guestName');
    }

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'get',
    };

    if (options.guestName) params.guest_name = options.guestName;
    if (options.guestId) params.guest_id = options.guestId;
    if (options.additional !== undefined) params.additional = options.additional;

    return this.request(apiName, info.path, params);
  }

  async setVmProperty(options: {
    guestId?: string;
    guestName?: string;
    autorun?: number;
    description?: string;
    newGuestName?: string;
    vcpuNum?: number;
    vramSize?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (!options.guestId && !options.guestName) {
      throw new Error('Specify at least one of guestId or guestName');
    }

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'set',
    };

    if (options.guestName) params.guest_name = options.guestName;
    if (options.guestId) params.guest_id = options.guestId;
    if (options.autorun !== undefined) params.autorun = options.autorun;
    if (options.description !== undefined) params.description = options.description;
    if (options.newGuestName !== undefined) params.new_guest_name = options.newGuestName;
    if (options.vcpuNum !== undefined) params.vcpu_num = options.vcpuNum;
    if (options.vramSize !== undefined) params.vram_size = options.vramSize;

    return this.request(apiName, info.path, params);
  }

  async deleteVm(options: {
    guestId?: string;
    guestName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (!options.guestId && !options.guestName) {
      throw new Error('Specify at least one of guestId or guestName');
    }

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'delete',
    };

    if (options.guestName) params.guest_name = options.guestName;
    if (options.guestId) params.guest_id = options.guestId;

    return this.request(apiName, info.path, params);
  }

  async vmPowerOn(options: {
    guestId?: string;
    guestName?: string;
    hostId?: string;
    hostName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest.Action';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (!options.guestId && !options.guestName) {
      throw new Error('Specify at least one of guestId or guestName');
    }

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'poweron',
    };

    if (options.guestName) params.guest_name = options.guestName;
    if (options.guestId) params.guest_id = options.guestId;
    if (options.hostId) params.host_id = options.hostId;
    if (options.hostName) params.host_name = options.hostName;

    return this.request(apiName, info.path, params);
  }

  async vmForcePowerOff(options: {
    guestId?: string;
    guestName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest.Action';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (!options.guestId && !options.guestName) {
      throw new Error('Specify at least one of guestId or guestName');
    }

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'poweroff',
    };

    if (options.guestName) params.guest_name = options.guestName;
    if (options.guestId) params.guest_id = options.guestId;

    return this.request(apiName, info.path, params);
  }

  async vmShutDown(options: {
    guestId?: string;
    guestName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest.Action';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (!options.guestId && !options.guestName) {
      throw new Error('Specify at least one of guestId or guestName');
    }

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'shutdown',
    };

    if (options.guestName) params.guest_name = options.guestName;
    if (options.guestId) params.guest_id = options.guestId;

    return this.request(apiName, info.path, params);
  }

  async getImagesList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest.Image';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async deleteImage(options: {
    imageId?: string;
    imageName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest.Image';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (!options.imageId && !options.imageName) {
      throw new Error('Specify at least one of imageId or imageName');
    }

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'delete',
    };

    if (options.imageName) params.image_name = options.imageName;
    if (options.imageId) params.image_id = options.imageId;

    return this.request(apiName, info.path, params);
  }

  async createImage(options: {
    autoCleanTask?: boolean;
    storageNames?: string;
    storageIds?: string;
    type: 'disk' | 'vdsm' | 'iso';
    dsFilePath: string;
    imageName: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Virtualization.API.Guest.Image';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (!options.storageNames && !options.storageIds) {
      throw new Error('Specify at least one of storageNames or storageIds');
    }

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'create',
      auto_clean_task: options.autoCleanTask ?? true,
      type: options.type,
      ds_file_path: options.dsFilePath,
      image_name: options.imageName,
    };

    if (options.storageIds) params.storage_ids = options.storageIds;
    if (options.storageNames) params.storage_names = options.storageNames;

    return this.request(apiName, info.path, params);
  }
}
