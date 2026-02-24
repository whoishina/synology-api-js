/**
 * Synology FileStation API module.
 * Ported from Python synology_api/filestation.py
 *
 * Provides methods to interact with Synology NAS FileStation API for file
 * and folder operations, search, upload, download, and background task management.
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

// Helper: normalise a string-or-array value into a comma-separated string.
function toCommaSeparated(value: string | string[]): string {
  return Array.isArray(value) ? value.join(',') : value;
}

// Helper: normalise a path (or list of paths) into the JSON array format
// the Synology API expects, e.g. `["/path/a","/path/b"]`.
function toPathParam(path: string | string[]): string {
  if (Array.isArray(path)) {
    return JSON.stringify(path);
  }
  return path;
}

// Helper: build a params record, omitting entries whose value is undefined.
function buildParams(
  base: Record<string, unknown>,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };
  for (const [key, val] of Object.entries(extra)) {
    if (val !== undefined && val !== null) {
      result[key] = val;
    }
  }
  return result;
}

// Helper: parse a time value that can be a date-string ("YYYY-MM-DD HH:MM:SS")
// or a numeric Unix timestamp. Returns a stringified Unix timestamp.
function parseTimeParam(value: string | number): string {
  if (typeof value === 'number') {
    return String(value);
  }
  // Try to parse as date string
  const parsed = Date.parse(value.replace(' ', 'T'));
  if (Number.isNaN(parsed)) {
    throw new Error(
      'Invalid date/time format. Use "YYYY-MM-DD HH:MM:SS" or a Unix timestamp.',
    );
  }
  return String(Math.floor(parsed / 1000));
}

export class FileStation extends BaseModule {
  protected readonly application = 'FileStation';

  // ------------------------------------------------------------------
  // Info
  // ------------------------------------------------------------------

  /** Get FileStation information. */
  async getInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ------------------------------------------------------------------
  // List / File info
  // ------------------------------------------------------------------

  /** List shared folders. */
  async getListShare(options: {
    additional?: string | string[];
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: string;
    onlywritable?: boolean;
  } = {}): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.List';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional = options.additional ?? ['real_path', 'size', 'owner', 'time'];

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'list_share' },
      {
        additional: toCommaSeparated(additional),
        offset: options.offset,
        limit: options.limit,
        sort_by: options.sortBy,
        sort_direction: options.sortDirection,
        onlywritable: options.onlywritable,
      },
    ));
  }

  /** List files in a folder. */
  async getFileList(
    folderPath: string,
    options: {
      offset?: number;
      limit?: number;
      sortBy?: string;
      sortDirection?: string;
      pattern?: string;
      filetype?: string;
      gotoPath?: string;
      additional?: string | string[];
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.List';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional = options.additional ?? ['real_path', 'size', 'owner', 'time'];

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'list', folder_path: folderPath },
      {
        offset: options.offset,
        limit: options.limit,
        sort_by: options.sortBy,
        sort_direction: options.sortDirection,
        pattern: options.pattern,
        filetype: options.filetype ? options.filetype.toLowerCase() : undefined,
        goto_path: options.gotoPath,
        additional: Array.isArray(additional) ? additional : additional,
      },
    ));
  }

  /** Get information about one or more files. */
  async getFileInfo(
    path: string | string[],
    additionalParam?: string | string[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.List';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional = additionalParam ?? [
      'real_path', 'size', 'owner', 'time', 'perm', 'type',
    ];
    const normalised = Array.isArray(additional) ? additional
      : [additional];

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getinfo',
      path: JSON.stringify(path),
      additional: JSON.stringify(normalised),
    });
  }

  // ------------------------------------------------------------------
  // Search
  // ------------------------------------------------------------------

  /** Start a file search task. Returns the raw API response containing the taskid. */
  async searchStart(
    folderPath: string,
    options: {
      recursive?: boolean;
      pattern?: string;
      extension?: string;
      filetype?: string;
      sizeFrom?: number;
      sizeTo?: number;
      mtimeFrom?: string | number;
      mtimeTo?: string | number;
      crtimeFrom?: string | number;
      crtimeTo?: string | number;
      atimeFrom?: string | number;
      atimeTo?: string | number;
      owner?: string;
      group?: string;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'start',
      folder_path: `"${folderPath}"`,
    };

    if (options.recursive !== undefined) params.recursive = options.recursive;
    if (options.pattern !== undefined) params.pattern = options.pattern;
    if (options.extension !== undefined) params.extension = options.extension;
    if (options.filetype !== undefined) params.filetype = `"${options.filetype}"`;
    if (options.sizeFrom !== undefined) params.size_from = options.sizeFrom;
    if (options.sizeTo !== undefined) params.size_to = options.sizeTo;
    if (options.owner !== undefined) params.owner = options.owner;
    if (options.group !== undefined) params.group = options.group;

    // Time parameters: accept "YYYY-MM-DD HH:MM:SS" or Unix timestamp
    if (options.mtimeFrom !== undefined) params.mtime_from = `"${parseTimeParam(options.mtimeFrom)}"`;
    if (options.mtimeTo !== undefined) params.mtime_to = `"${parseTimeParam(options.mtimeTo)}"`;
    if (options.crtimeFrom !== undefined) params.crtime_from = `"${parseTimeParam(options.crtimeFrom)}"`;
    if (options.crtimeTo !== undefined) params.crtime_to = `"${parseTimeParam(options.crtimeTo)}"`;
    if (options.atimeFrom !== undefined) params.atime_from = `"${parseTimeParam(options.atimeFrom)}"`;
    if (options.atimeTo !== undefined) params.atime_to = `"${parseTimeParam(options.atimeTo)}"`;

    return this.request(apiName, info.path, params);
  }

  /** Get the results of a search task. */
  async getSearchList(
    taskId: string,
    options: {
      filetype?: string;
      limit?: number;
      sortBy?: string;
      sortDirection?: string;
      offset?: number;
      additional?: string | string[];
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional = options.additional ?? ['size', 'owner', 'time'];
    const additionalStr = JSON.stringify(
      Array.isArray(additional) ? additional : [additional],
    );

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'list', taskid: taskId },
      {
        filetype: options.filetype ? options.filetype.toLowerCase() : undefined,
        limit: options.limit,
        sort_by: options.sortBy,
        sort_direction: options.sortDirection,
        offset: options.offset,
        additional: additionalStr,
      },
    ));
  }

  /** Stop a search task. */
  async stopSearchTask(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stop',
      taskid: taskId,
    });
  }

  /** Stop all running search tasks (batch). */
  async stopAllSearchTasks(taskIds: string[]): Promise<SynoResponse[]> {
    const apiName = 'SYNO.FileStation.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (taskIds.length === 0) {
      throw new Error('Task list is empty');
    }

    const results: SynoResponse[] = [];
    for (const taskId of taskIds) {
      const result = await this.request(apiName, info.path, {
        version: info.maxVersion,
        method: 'stop',
        taskid: taskId,
      });
      results.push(result);
    }
    return results;
  }

  // ------------------------------------------------------------------
  // Virtual Folder / Mount Points
  // ------------------------------------------------------------------

  /** List mount points. */
  async getMountPointList(
    mountType: string,
    options: {
      offset?: number;
      limit?: number;
      sortBy?: string;
      sortDirection?: string;
      additional?: string | string[];
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.VirtualFolder';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional = options.additional ?? [
      'real_path', 'owner', 'time', 'perm', 'mount_point_type',
    ];

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'list', type: mountType },
      {
        offset: options.offset,
        limit: options.limit,
        sort_by: options.sortBy,
        sort_direction: options.sortDirection,
        additional: toCommaSeparated(additional),
      },
    ));
  }

  // ------------------------------------------------------------------
  // Favorites
  // ------------------------------------------------------------------

  /** List favorite files and folders. */
  async getFavoriteList(options: {
    offset?: number;
    limit?: number;
    sortBy?: string;
    statusFilter?: string;
    additional?: string | string[];
  } = {}): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Favorite';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional = options.additional ?? ['real_path', 'size', 'owner', 'time'];

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'list' },
      {
        offset: options.offset,
        limit: options.limit,
        sort_by: options.sortBy,
        status_filter: options.statusFilter,
        additional: toCommaSeparated(additional),
      },
    ));
  }

  /** Add a file or folder to favorites. */
  async addFavorite(
    path: string,
    options: {
      name?: string;
      index?: number;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Favorite';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'add', path },
      {
        name: options.name,
        index: options.index,
      },
    ));
  }

  /** Delete a favorite. */
  async deleteFavorite(path: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Favorite';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'delete',
      path,
    });
  }

  /** Clear broken favorites. */
  async clearBrokenFavorites(): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Favorite';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'clear_broken',
    });
  }

  /** Edit the name of a favorite. */
  async editFavoriteName(path: string, newName: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Favorite';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'edit',
      path,
      new_name: newName,
    });
  }

  /** Replace all favorites with new paths and names. */
  async replaceAllFavorites(
    path: string | string[],
    name: string | string[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Favorite';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'edit',
      path: toCommaSeparated(path),
      name: toCommaSeparated(name),
    });
  }

  // ------------------------------------------------------------------
  // Directory Size
  // ------------------------------------------------------------------

  /** Start a directory size calculation task. Returns the API response with taskid. */
  async startDirSizeCalc(path: string | string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.DirSize';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'start',
      path: toPathParam(path),
    });
  }

  /** Stop a directory size calculation task. */
  async stopDirSizeCalc(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.DirSize';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stop',
      taskid: taskId,
    });
  }

  /** Get the status of a directory size calculation task. */
  async getDirStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.DirSize';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
      taskid: taskId,
    });
  }

  // ------------------------------------------------------------------
  // MD5
  // ------------------------------------------------------------------

  /** Start an MD5 calculation task. Returns the API response with taskid. */
  async startMd5Calc(filePath: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.MD5';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'start',
      file_path: filePath,
    });
  }

  /** Get the status of an MD5 calculation task. */
  async getMd5Status(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.MD5';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
      taskid: taskId,
    });
  }

  /** Stop an MD5 calculation task. */
  async stopMd5Calc(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.MD5';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stop',
      taskid: taskId,
    });
  }

  // ------------------------------------------------------------------
  // Permissions
  // ------------------------------------------------------------------

  /** Check permissions for a file or folder. */
  async checkPermissions(
    path: string,
    filename: string,
    options: {
      overwrite?: boolean;
      createOnly?: boolean;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.CheckPermission';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'write', path, filename },
      {
        overwrite: options.overwrite,
        create_only: options.createOnly,
      },
    ));
  }

  // ------------------------------------------------------------------
  // Upload
  // ------------------------------------------------------------------

  /**
   * Upload a file to the NAS.
   *
   * @param destPath - Destination folder path on the NAS.
   * @param file - The file to upload (Blob, File, or ArrayBuffer with a name).
   * @param fileName - Name for the uploaded file.
   * @param options - Upload options.
   */
  async uploadFile(
    destPath: string,
    file: Blob,
    fileName: string,
    options: {
      createParents?: boolean;
      overwrite?: boolean;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Upload';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const createParents = options.createParents ?? true;
    const overwrite = options.overwrite ?? true;

    const formData = new FormData();
    formData.append('path', destPath);
    formData.append('create_parents', String(createParents));
    formData.append('overwrite', String(overwrite));
    formData.append('file', file, fileName);

    return this.uploadRequest(apiName, info.path, formData, {
      version: info.minVersion,
      method: 'upload',
    });
  }

  // ------------------------------------------------------------------
  // Sharing Links
  // ------------------------------------------------------------------

  /** Get information about a shared link. */
  async getSharedLinkInfo(linkId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Sharing';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getinfo',
      id: linkId,
    });
  }

  /** List shared links. */
  async getSharedLinkList(options: {
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: string;
    forceClean?: boolean;
  } = {}): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Sharing';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'list' },
      {
        offset: options.offset,
        limit: options.limit,
        sort_by: options.sortBy,
        sort_direction: options.sortDirection,
        force_clean: options.forceClean,
      },
    ));
  }

  /** Create a sharing link. */
  async createSharingLink(
    path: string,
    options: {
      password?: string;
      dateExpired?: string | number;
      dateAvailable?: string | number;
      expireTimes?: number;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Sharing';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'create', path },
      {
        password: options.password,
        date_expired: options.dateExpired !== undefined
          ? String(options.dateExpired)
          : undefined,
        date_available: options.dateAvailable !== undefined
          ? String(options.dateAvailable)
          : undefined,
        expire_times: options.expireTimes,
      },
    ));
  }

  /** Delete a shared link. */
  async deleteSharedLink(linkId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Sharing';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'delete',
      id: linkId,
    });
  }

  /** Clear invalid shared links. */
  async clearInvalidSharedLinks(): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Sharing';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'clear_invalid',
    });
  }

  /** Edit a shared link. */
  async editSharedLink(
    linkId: string,
    options: {
      password?: string;
      dateExpired?: string | number;
      dateAvailable?: string | number;
      expireTimes?: number;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Sharing';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'edit', id: linkId },
      {
        password: options.password,
        date_expired: options.dateExpired !== undefined
          ? String(options.dateExpired)
          : undefined,
        date_available: options.dateAvailable !== undefined
          ? String(options.dateAvailable)
          : undefined,
        expire_times: options.expireTimes,
      },
    ));
  }

  // ------------------------------------------------------------------
  // Create / Rename Folder
  // ------------------------------------------------------------------

  /** Create a new folder. */
  async createFolder(
    folderPath: string | string[],
    name: string | string[],
    options: {
      forceParent?: boolean;
      additional?: string | string[];
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.CreateFolder';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional = options.additional ?? ['real_path', 'size', 'owner', 'time'];

    const nameParam = Array.isArray(name)
      ? JSON.stringify(name)
      : `"${name}"`;

    return this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'create',
        folder_path: toPathParam(folderPath),
        name: nameParam,
        additional: toCommaSeparated(additional),
      },
      {
        force_parent: options.forceParent,
      },
    ));
  }

  /**
   * Rename a file or folder.
   *
   * Both `path` and `name` must be the same type (both strings or both arrays).
   * When arrays, they must have the same length.
   */
  async renameFolder(
    path: string | string[],
    name: string | string[],
    options: {
      additional?: string | string[];
      searchTaskId?: string;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Rename';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    if (Array.isArray(path) !== Array.isArray(name)) {
      throw new TypeError('path and name must be both arrays or both strings');
    }
    if (Array.isArray(path) && Array.isArray(name) && path.length !== name.length) {
      throw new Error('path and name arrays must have the same length');
    }

    const additional = options.additional ?? ['real_path', 'size', 'owner', 'time'];

    return this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'rename',
        path: JSON.stringify(path),
        name: JSON.stringify(name),
        additional: toCommaSeparated(additional),
      },
      {
        search_taskid: options.searchTaskId,
      },
    ), { method: 'post' });
  }

  // ------------------------------------------------------------------
  // Copy / Move
  // ------------------------------------------------------------------

  /** Start a copy or move task. Returns the API response with taskid. */
  async startCopyMove(
    path: string | string[],
    destFolderPath: string,
    options: {
      overwrite?: boolean;
      removeSrc?: boolean;
      accurateProgress?: boolean;
      searchTaskId?: string;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.CopyMove';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'start',
        path: toPathParam(path),
        dest_folder_path: destFolderPath,
      },
      {
        overwrite: options.overwrite,
        remove_src: options.removeSrc,
        accurate_progress: options.accurateProgress,
        search_taskid: options.searchTaskId,
      },
    ));
  }

  /** Get the status of a copy or move task. */
  async getCopyMoveStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.CopyMove';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
      taskid: taskId,
    });
  }

  /** Stop a copy or move task. */
  async stopCopyMoveTask(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.CopyMove';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stop',
      taskid: taskId,
    });
  }

  // ------------------------------------------------------------------
  // Delete
  // ------------------------------------------------------------------

  /** Start an asynchronous delete task. Returns the API response with taskid. */
  async startDeleteTask(
    path: string | string[],
    options: {
      accurateProgress?: boolean;
      recursive?: boolean;
      searchTaskId?: string;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Delete';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'start',
        path: toPathParam(path),
      },
      {
        accurate_progress: options.accurateProgress,
        recursive: options.recursive,
        search_taskid: options.searchTaskId,
      },
    ));
  }

  /** Get the status of a delete task. */
  async getDeleteStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Delete';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
      taskid: taskId,
    });
  }

  /** Stop a delete task. */
  async stopDeleteTask(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Delete';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stop',
      taskid: taskId,
    });
  }

  /**
   * Delete file(s) or folder(s) synchronously (blocking).
   * The request will not return until the deletion is complete.
   */
  async deleteBlocking(
    path: string | string[],
    options: {
      recursive?: boolean;
      searchTaskId?: string;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Delete';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'delete',
        path: toPathParam(path),
      },
      {
        recursive: options.recursive,
        search_taskid: options.searchTaskId,
      },
    ));
  }

  // ------------------------------------------------------------------
  // Extract (Archive)
  // ------------------------------------------------------------------

  /** Start an archive extraction task. Returns the API response with taskid. */
  async startExtractTask(
    filePath: string,
    destFolderPath: string,
    options: {
      overwrite?: boolean;
      keepDir?: boolean;
      createSubfolder?: boolean;
      codepage?: string;
      password?: string;
      itemId?: string;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Extract';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'start',
        file_path: filePath,
        dest_folder_path: destFolderPath,
      },
      {
        overwrite: options.overwrite,
        keep_dir: options.keepDir,
        create_subfolder: options.createSubfolder,
        codepage: options.codepage,
        password: options.password,
        item_id: options.itemId,
      },
    ));
  }

  /** Get the status of an extraction task. */
  async getExtractStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Extract';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
      taskid: taskId,
    });
  }

  /** Stop an extraction task. */
  async stopExtractTask(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Extract';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stop',
      taskid: taskId,
    });
  }

  /** Get the list of files inside an archive. */
  async getFileListOfArchive(
    filePath: string,
    options: {
      offset?: number;
      limit?: number;
      sortBy?: string;
      sortDirection?: string;
      codepage?: string;
      password?: string;
      itemId?: string;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Extract';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'list',
        file_path: filePath,
      },
      {
        offset: options.offset,
        limit: options.limit,
        sort_by: options.sortBy,
        sort_direction: options.sortDirection,
        codepage: options.codepage,
        password: options.password,
        item_id: options.itemId,
      },
    ));
  }

  // ------------------------------------------------------------------
  // Compress
  // ------------------------------------------------------------------

  /** Start a file compression task. Returns the API response with taskid. */
  async startFileCompression(
    path: string | string[],
    destFilePath: string,
    options: {
      level?: number;
      mode?: string;
      compressFormat?: string;
      password?: string;
    } = {},
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Compress';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'start',
        path: toPathParam(path),
        dest_file_path: destFilePath,
      },
      {
        level: options.level,
        mode: options.mode,
        format: options.compressFormat,
        _password: options.password,
      },
    ));
  }

  /** Get the status of a compression task. */
  async getCompressStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Compress';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
      taskid: taskId,
    });
  }

  /** Stop a compression task. */
  async stopCompressTask(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.Compress';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'stop',
      taskid: taskId,
    });
  }

  // ------------------------------------------------------------------
  // Background Tasks
  // ------------------------------------------------------------------

  /** Get a list of all background tasks. */
  async getListOfAllBackgroundTasks(options: {
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: string;
    apiFilter?: string | string[];
  } = {}): Promise<SynoResponse> {
    const apiName = 'SYNO.FileStation.BackgroundTask';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const filterParam = options.apiFilter !== undefined
      ? (Array.isArray(options.apiFilter)
        ? JSON.stringify(options.apiFilter)
        : options.apiFilter)
      : undefined;

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'list' },
      {
        offset: options.offset,
        limit: options.limit,
        sort_by: options.sortBy,
        sort_direction: options.sortDirection,
        api_filter: filterParam,
      },
    ));
  }

  // ------------------------------------------------------------------
  // Download
  // ------------------------------------------------------------------

  /**
   * Download a file from the NAS. Returns raw bytes as ArrayBuffer.
   *
   * @param path - The file path (starting with a shared folder).
   * @param mode - Download mode: 'open' or 'download'.
   */
  async getFile(
    path: string,
    mode: 'open' | 'download' = 'download',
  ): Promise<ArrayBuffer> {
    const apiName = 'SYNO.FileStation.Download';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const response = await this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'download',
      path,
      mode,
    }, { rawResponse: true });

    return response as unknown as ArrayBuffer;
  }

  // ------------------------------------------------------------------
  // Thumb
  // ------------------------------------------------------------------

  /**
   * Get a thumbnail for a file. Returns raw bytes as ArrayBuffer.
   *
   * @param path - The file path to get thumbnail for.
   * @param size - Thumbnail size: 'small', 'medium', or 'large'.
   * @param rotate - Rotation in degrees.
   */
  async getThumb(
    path: string,
    options: {
      size?: 'small' | 'medium' | 'large';
      rotate?: number;
    } = {},
  ): Promise<ArrayBuffer> {
    const apiName = 'SYNO.FileStation.Thumb';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const response = await this.request(apiName, info.path, buildParams(
      {
        version: info.maxVersion,
        method: 'get',
        path,
      },
      {
        size: options.size,
        rotate: options.rotate,
      },
    ), { rawResponse: true });

    return response as unknown as ArrayBuffer;
  }
}
