/**
 * Synology Download Station API module.
 * Ported from Python synology_api/downloadstation.py
 *
 * Supports both DownloadStation and DownloadStation2 APIs
 * via the dsVersion constructor parameter.
 */
import { BaseModule } from './base-module.ts';
import { readLocalFile } from '../core/utils.ts';
import type { SynoClient } from '../core/client.ts';
import type { SynoResponse } from '../types/api-info.ts';

/** Server configuration options for Download Station. */
interface ServerConfig {
  bt_max_download?: number;
  bt_max_upload?: number;
  emule_max_download?: number;
  emule_max_upload?: number;
  nzb_max_download?: number;
  http_max_download?: number;
  ftp_max_download?: number;
  emule_enabled?: boolean;
  unzip_service_enabled?: boolean;
  default_destination?: string;
  emule_default_destination?: string;
}

/** BT search result query options. */
interface BtSearchResultOptions {
  offset?: number;
  limit?: number;
  sort_by?: string;
  sort_direction?: string;
  filter_category?: string;
  filter_title?: string;
}

export class DownloadStation extends BaseModule {
  protected readonly application = 'DownloadStation';
  private readonly dsVersion: '' | '2';

  constructor(client: SynoClient, dsVersion: '' | '2' = '') {
    super(client);
    this.dsVersion = dsVersion;
  }

  // ---------- Helpers ----------

  /** Build a versioned API name, e.g. SYNO.DownloadStation2.Task */
  private apiName(suffix: string): string {
    return `SYNO.DownloadStation${this.dsVersion}.${suffix}`;
  }

  /** Normalize a string-or-array task/rss ID to a comma-separated string. */
  private static joinIds(id: string | string[]): string {
    return Array.isArray(id) ? id.join(',') : id;
  }

  // ---------- Info ----------

  /** Get Download Station info. */
  async getInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.DownloadStation.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getinfo',
    });
  }

  /** Get Download Station config. */
  async getConfig(): Promise<SynoResponse> {
    const apiName = 'SYNO.DownloadStation.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getconfig',
    });
  }

  /** Set Download Station server configuration. */
  async setServerConfig(config: ServerConfig): Promise<SynoResponse> {
    const apiName = 'SYNO.DownloadStation.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'setserverconfig',
    };

    for (const [key, val] of Object.entries(config)) {
      if (val !== undefined) {
        params[key] = val;
      }
    }

    return this.request(apiName, info.path, params);
  }

  // ---------- Schedule ----------

  /** Get Download Station schedule configuration. */
  async getScheduleInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.DownloadStation.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getconfig',
    });
  }

  /** Set Download Station schedule configuration. */
  async setScheduleConfig(
    enabled: boolean = false,
    emuleEnabled: boolean = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.DownloadStation.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'setconfig',
      enabled: String(enabled).toLowerCase(),
      emule_enabled: String(emuleEnabled).toLowerCase(),
    });
  }

  // ---------- Tasks ----------

  /** List download tasks. */
  async tasksList(
    additionalParam?: string | string[],
    offset: number = 0,
    limit: number = -1,
  ): Promise<SynoResponse> {
    const apiName = this.apiName('Task');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional =
      additionalParam === undefined
        ? ['detail', 'transfer', 'file', 'tracker', 'peer']
        : typeof additionalParam === 'string'
          ? [additionalParam]
          : additionalParam;

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      additional: JSON.stringify(additional),
      limit,
      offset,
    });
  }

  /** Get information for specific download tasks. */
  async tasksInfo(
    taskId: string | string[],
    additionalParam?: string | string[],
  ): Promise<SynoResponse> {
    const apiName = this.apiName('Task');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional =
      additionalParam === undefined
        ? ['detail', 'transfer', 'file', 'tracker', 'peer']
        : typeof additionalParam === 'string'
          ? [additionalParam]
          : additionalParam;

    const ids = Array.isArray(taskId) ? taskId : [taskId];

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      id: JSON.stringify(ids),
      additional: JSON.stringify(additional),
    });
  }

  /**
   * Download task source (requires DownloadStation2).
   * Returns raw binary content as ArrayBuffer.
   */
  async tasksSource(taskId: string): Promise<ArrayBuffer> {
    const apiName = 'SYNO.DownloadStation2.Task.Source';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const response = await this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'download',
      id: taskId,
    }, { rawResponse: true });

    return response as unknown as ArrayBuffer;
  }

  /**
   * Get info from a task list containing the files to be downloaded.
   * Use after creating a task and before starting the download.
   */
  async getTaskList(listId: string): Promise<SynoResponse> {
    const apiName = this.apiName('Task.List');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      list_id: listId,
    });
  }

  /**
   * Create a new download task.
   * Provide exactly one of `url` or `filePath`.
   *
   * @param options.url - Download URL
   * @param options.filePath - Path to a local file (e.g. .torrent) to upload
   * @param options.destination - Download destination folder
   */
  async createTask(options: {
    url?: string;
    filePath?: string;
    destination?: string;
  }): Promise<SynoResponse> {
    const { url, filePath, destination = '' } = options;

    if (Boolean(url) === Boolean(filePath)) {
      throw new Error("Provide exactly one of 'url' or 'filePath', not both or neither");
    }

    const apiName = this.apiName('Task');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (filePath) {
      const { blob } = await readLocalFile(filePath);
      const formData = new FormData();
      formData.append('api', apiName);
      formData.append('method', 'create');
      formData.append('version', String(info.maxVersion));
      formData.append('type', '"file"');
      formData.append('file', '["torrent"]');
      formData.append('destination', `"${destination}"`);
      formData.append('create_list', 'true');
      formData.append('torrent', blob);

      return this.uploadRequest(apiName, info.path, formData);
    }

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'create',
      type: 'url',
      create_list: 'true',
      destination,
      url: `["${url}"]`,
    });
  }

  /** Delete a download task. */
  async deleteTask(
    taskId: string | string[],
    force: boolean = false,
  ): Promise<SynoResponse> {
    const apiName = this.apiName('Task');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'delete',
      id: DownloadStation.joinIds(taskId),
      force_complete: String(force).toLowerCase(),
    });
  }

  /** Pause a download task. */
  async pauseTask(taskId: string | string[]): Promise<SynoResponse> {
    const apiName = this.apiName('Task');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'pause',
      id: DownloadStation.joinIds(taskId),
    });
  }

  /** Resume a download task. */
  async resumeTask(taskId: string | string[]): Promise<SynoResponse> {
    const apiName = this.apiName('Task');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'resume',
      id: DownloadStation.joinIds(taskId),
    });
  }

  /** Edit a download task (change destination). */
  async editTask(
    taskId: string | string[],
    destination: string = 'sharedfolder',
  ): Promise<SynoResponse> {
    const apiName = this.apiName('Task');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'edit',
      id: DownloadStation.joinIds(taskId),
      destination,
    });
  }

  /**
   * Download files from a task list.
   *
   * @param listId - Task list ID
   * @param fileIndexes - List of file indexes to download
   * @param destination - Download destination, e.g. 'sharedfolder/subfolder'
   * @param createSubfolder - Create subfolder (defaults to true)
   */
  async downloadTaskList(
    listId: string,
    fileIndexes: number[],
    destination: string,
    createSubfolder: boolean = true,
  ): Promise<SynoResponse> {
    const apiName = this.apiName('Task.List.Polling');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'download',
      list_id: listId,
      file_indexes: fileIndexes.map(String).join(','),
      destination,
      create_subfolder: createSubfolder,
    });
  }

  // ---------- Statistics ----------

  /** Get Download Station statistics. */
  async getStatisticInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.DownloadStation.Statistic';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getinfo',
    });
  }

  // ---------- RSS ----------

  /** Get RSS site info list. */
  async getRssInfoList(
    offset?: number,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.DownloadStation.RSS.Site';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'list',
    };

    if (offset !== undefined) params.offset = offset;
    if (limit !== undefined) params.limit = limit;

    return this.request(apiName, info.path, params);
  }

  /** Refresh an RSS site. */
  async refreshRssSite(rssId: string | string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.DownloadStation.RSS.Site';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'refresh',
      id: DownloadStation.joinIds(rssId),
    });
  }

  /** Get RSS feed list. */
  async rssFeedList(
    rssId: string | string[],
    offset?: number,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = this.apiName('RSS.Feed');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'list',
      id: DownloadStation.joinIds(rssId),
    };

    if (offset !== undefined) params.offset = offset;
    if (limit !== undefined) params.limit = limit;

    return this.request(apiName, info.path, params);
  }

  /** Get RSS feed filter list. */
  async rssFeedFilterList(
    feedId: number,
    offset?: number,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = this.apiName('RSS.Filter');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'list',
      feed_id: feedId,
    };

    if (offset !== undefined) params.offset = offset;
    if (limit !== undefined) params.limit = limit;

    return this.request(apiName, info.path, params);
  }

  /** Add an RSS feed filter. */
  async rssFeedFilterAdd(options: {
    feedId: number;
    filterName: string;
    match: string;
    notMatch: string;
    destination: string;
    isRegex?: boolean;
  }): Promise<SynoResponse> {
    const apiName = this.apiName('RSS.Filter');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'add',
      feed_id: options.feedId,
      name: `"${options.filterName}"`,
      match: `"${options.match}"`,
      not_match: `"${options.notMatch}"`,
      destination: `"${options.destination}"`,
      is_regex: String(options.isRegex ?? false).toLowerCase(),
    });
  }

  /** Set (update) an RSS feed filter. */
  async rssFeedFilterSet(options: {
    filterId: number;
    filterName: string;
    match: string;
    notMatch: string;
    destination: string;
    isRegex?: boolean;
  }): Promise<SynoResponse> {
    const apiName = this.apiName('RSS.Filter');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set',
      feed_id: 'null',
      id: options.filterId,
      name: `"${options.filterName}"`,
      match: `"${options.match}"`,
      not_match: `"${options.notMatch}"`,
      destination: `"${options.destination}"`,
      is_regex: String(options.isRegex ?? false).toLowerCase(),
    });
  }

  /** Delete an RSS feed filter. */
  async rssFeedFilterDelete(filterId: number): Promise<SynoResponse> {
    const apiName = this.apiName('RSS.Filter');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'delete',
      id: filterId,
    });
  }

  // ---------- BT Search ----------

  /**
   * Start a BT search.
   * Returns the search response containing the taskid.
   */
  async startBtSearch(
    keyword: string,
    module: string = 'all',
  ): Promise<SynoResponse> {
    const apiName = this.apiName('BTSearch');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'start',
      keyword,
      module,
    });
  }

  /** Get BT search results. */
  async getBtSearchResults(
    taskid: string | string[],
    options?: BtSearchResultOptions,
  ): Promise<SynoResponse> {
    const apiName = this.apiName('BTSearch');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'list',
      taskid: DownloadStation.joinIds(taskid),
    };

    if (options) {
      if (options.offset !== undefined) params.offset = options.offset;
      if (options.limit !== undefined) params.limit = options.limit;
      if (options.sort_by !== undefined) params.sort_by = options.sort_by;
      if (options.sort_direction !== undefined) params.sort_direction = options.sort_direction;
      if (options.filter_category !== undefined) params.filter_category = options.filter_category;
      if (options.filter_title !== undefined) params.filter_title = options.filter_title;
    }

    return this.request(apiName, info.path, params);
  }

  /** Get BT search categories. */
  async getBtSearchCategory(): Promise<SynoResponse> {
    const apiName = this.apiName('BTSearch');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Clean BT search tasks. */
  async cleanBtSearch(taskid: string | string[]): Promise<SynoResponse> {
    const apiName = this.apiName('BTSearch');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'clean',
      taskid: DownloadStation.joinIds(taskid),
    });
  }

  /** Get BT search modules. */
  async getBtModule(): Promise<SynoResponse> {
    const apiName = this.apiName('BTSearch');
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getModule',
    });
  }
}
