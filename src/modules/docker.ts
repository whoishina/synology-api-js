/**
 * Synology Docker API module.
 * Ported from Python synology_api/docker_api.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class Docker extends BaseModule {
  protected readonly application = 'Docker';

  /**
   * Get list of containers.
   */
  async containers(): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Container';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      limit: '-1',
      offset: '0',
      type: 'all',
    });
  }

  /**
   * Get resources of all containers.
   */
  async containerResources(): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Container.Resource';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /**
   * Get system resources (CPU, memory, disk, network).
   */
  async systemResources(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.Utilization';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /**
   * List docker images available on the Synology NAS.
   */
  async downloadedImages(
    limit = -1,
    offset = 0,
    showDsm = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Image';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      limit,
      offset,
      show_dsm: JSON.stringify(showDsm),
    });
  }

  /**
   * Get list of docker registries.
   */
  async imagesRegistryResources(): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Registry';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /**
   * Get list of docker networks.
   */
  async network(): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Network';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /**
   * Search for a docker image in all available registries.
   */
  async searchImage(query: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Registry';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    // version 1 contains methods: search, tags, get, create, set, using, delete
    // version 2 contains methods: tags
    return this.request(apiName, info.path, {
      version: 1,
      method: 'search',
      offset: 0,
      limit: 50,
      page_size: 50,
      q: query,
    });
  }

  /**
   * Get list of projects.
   */
  async listProjects(): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Project';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /**
   * Get information about a specific project.
   */
  async getProjectInfo(projectId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Project';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      id: projectId,
    });
  }

  /**
   * Start a container by its name.
   */
  async startContainer(container: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Container';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'start',
      name: container,
    });
  }

  /**
   * Stop a container by its name.
   */
  async stopContainer(container: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Container';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stop',
      name: container,
    });
  }

  /**
   * Export container profile (settings) to a path on the NAS.
   * Creates a <container>.syno.json file at the specified path.
   */
  async exportContainerSettings(
    container: string,
    path: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Container.Profile';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'export',
      name: container,
      path,
    });
  }

  /**
   * Export container profile and content to a path on the NAS.
   * Creates a <container>.syno.txz archive at the specified path.
   */
  async exportContainer(
    container: string,
    path: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Container';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'export',
      name: container,
      path,
    });
  }

  /**
   * Get container logs with optional filtering.
   */
  async getLogs(
    name: string,
    options: {
      fromDate?: string;
      toDate?: string;
      level?: string;
      keyword?: string;
      sortDir?: 'ASC' | 'DESC';
      offset?: number;
      limit?: number;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Container.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const {
      fromDate,
      toDate,
      level,
      keyword,
      sortDir = 'DESC',
      offset = 0,
      limit = 1000,
    } = options;

    return this.request(
      apiName,
      info.path,
      {
        version: info.maxVersion,
        method: 'get',
        name,
        from: fromDate,
        to: toDate,
        level,
        keyword,
        sort_dir: sortDir,
        offset,
        limit,
      },
      { method: 'post' },
    );
  }

  /**
   * Get containers resource usage statistics (docker stats).
   */
  async dockerStats(): Promise<SynoResponse> {
    const apiName = 'SYNO.Docker.Container';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stats',
    });
  }
}
