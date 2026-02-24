/**
 * Synology Core Package API module.
 * Ported from Python synology_api/core_package.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class CorePackage extends BaseModule {
  protected readonly application = 'Core';

  async getPackage(packageId: string, additional: string[] = []): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'get',
      version: info.minVersion,
      id: packageId,
      additional: JSON.stringify(additional),
    });
  }

  async listInstalled(additional: string[] = [], ignoreHidden = false): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'list',
      version: info.maxVersion,
      ignore_hidden: ignoreHidden,
      additional: JSON.stringify(additional),
    });
  }

  async listInstallable(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Server';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'list',
      version: info.maxVersion,
      blforcereload: false,
      blloadothers: false,
    });
  }

  async getPackageCenterSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'get',
      version: info.maxVersion,
    });
  }

  async setPackageCenterSettings(options: {
    enableEmail: boolean;
    enableDsm: boolean;
    enableAutoupdate: boolean;
    autoupdateAll: boolean;
    autoupdateImportant: boolean;
    defaultVol: string;
    updateChannel: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'set',
      version: info.maxVersion,
      enable_email: options.enableEmail,
      enable_dsm: options.enableDsm,
      enable_autoupdate: options.enableAutoupdate,
      autoupdateall: options.autoupdateAll,
      autoupdateimportant: options.autoupdateImportant,
      default_vol: options.defaultVol,
      update_channel: options.updateChannel,
    });
  }

  async getPackageCenterInfos(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'get',
      version: info.maxVersion,
    });
  }

  async feasibilityCheckInstall(packages: string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'feasibility_check',
      version: info.maxVersion,
      type: 'install_check',
      packages: JSON.stringify(packages),
    });
  }

  async downloadPackage(
    url: string,
    packageId: string,
    checksum: string,
    filesize: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Installation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'install',
      version: info.minVersion,
      operation: 'install',
      type: 0,
      blqinst: false,
      url,
      name: packageId,
      checksum,
      filesize,
    });
  }

  async getDownloadPackageStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Installation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'status',
      version: info.minVersion,
      task_id: taskId,
    });
  }

  async checkInstallationFromDownload(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Installation.Download';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'check',
      version: info.minVersion,
      taskid: taskId,
    });
  }

  async uploadPackageFile(
    file: File | Blob,
    fileName: string,
    additional: string[] = [],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Installation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const formData = new FormData();
    formData.append('additional', JSON.stringify(additional));
    formData.append('file', file, fileName);

    return this.uploadRequest(apiName, info.path, formData, {
      version: info.minVersion,
      method: 'upload',
    });
  }

  async getDefaultInstallVolume(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Setting.Volume';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'get',
      version: info.maxVersion,
    });
  }

  async checkInstallation(
    packageId: string,
    installType = '',
    installOnColdStorage = false,
    blCheckDep = false,
    replacePkgs: Record<string, string> = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Installation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'check',
      version: info.maxVersion,
      id: packageId,
      install_type: installType,
      install_on_cold_storage: installOnColdStorage,
      breakpkgs: null,
      blCheckDep,
      replacepkgs: JSON.stringify(replacePkgs),
    });
  }

  async upgradePackage(
    taskId: string,
    checkCodesign = false,
    force = false,
    installRunPackage = true,
    extraValues: Record<string, unknown> = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Installation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'upgrade',
      version: info.minVersion,
      type: 0,
      check_codesign: checkCodesign,
      force,
      installrunpackage: installRunPackage,
      task_id: taskId,
      extra_values: JSON.stringify(extraValues),
    });
  }

  async installPackage(
    packageId: string,
    volumePath: string,
    filePath: string,
    checkCodesign = true,
    force = true,
    installRunPackage = true,
    extraValues: Record<string, unknown> = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Installation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.batchRequest([
      {
        api: apiName,
        method: 'check',
        version: info.minVersion,
        id: packageId,
        install_type: '',
        install_on_cold_storage: false,
        breakpkgs: null,
        blCheckDep: false,
        replacepkgs: null,
      },
      {
        api: apiName,
        method: 'install',
        version: info.minVersion,
        type: 0,
        volume_path: volumePath,
        path: filePath,
        check_codesign: checkCodesign,
        force,
        installrunpackage: installRunPackage,
        extra_values: JSON.stringify(extraValues),
      },
    ]);
  }

  async uninstallPackage(packageId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package.Uninstallation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'uninstall',
      version: info.minVersion,
      id: packageId,
      dsm_apps: '',
    });
  }
}
