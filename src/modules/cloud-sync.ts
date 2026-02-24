/**
 * Synology Cloud Sync API module.
 * Ported from Python synology_api/cloud_sync.py
 *
 * Provides functionality to manage Cloud Sync package settings,
 * connections, tasks, and synchronization processes.
 *
 * Tested clouds: Google Drive, OneDrive, Dropbox, Amazon S3 (task creation).
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';
import { mergeDicts, makeFolderMetaListFromPath } from '../core/utils.ts';

/** Sync direction options for task configuration. */
type SyncDirection = 'ONLY_UPLOAD' | 'BIDIRECTION' | 'ONLY_DOWNLOAD';

/** S3 storage class options. */
type StorageClass = 'STANDARD' | 'REDUCED_REDUNDANCY' | 'STANDARD_IA' | 'ONEZONE_IA' | 'INTELLIGENT_TIERING' | 'GLACIER' | 'DEEP_ARCHIVE' | string;

/** Filter file configuration for S3 task creation. */
interface FilterFileConfig {
  readonly filtered_extensions: string[];
  readonly filtered_max_upload_size: number;
  readonly filtered_names: string[];
}

/** Parameters for creating an S3 sync task session. */
interface S3SessionParams extends Record<string, unknown> {
  readonly path: string;
  readonly path_share: string;
  readonly path_sync: string;
  readonly filter_file: FilterFileConfig;
  readonly sync_direction: SyncDirection;
  readonly server_folder: string;
  readonly server_folder_path: string;
  readonly server_folder_id: string;
  readonly part_size: string;
  readonly storage_class: string;
  readonly server_folder_meta_list: Array<{
    alternatelink: string;
    file_id: string;
    mtime: number;
    parent_id: string;
    title: string;
    path: string;
  }>;
  readonly filter_folder: string[];
  readonly filter_changed: boolean;
  readonly no_delete: boolean;
  readonly isSSE: boolean;
  readonly server_encryption: boolean;
  readonly sync_attr_check_option: boolean;
  readonly mode_add_session: boolean;
}

/** Result of S3 task creation or test. */
type S3TaskResult =
  | { readonly ok: true; readonly data: SynoResponse }
  | { readonly ok: false; readonly reason: string };

export class CloudSync extends BaseModule {
  protected readonly application = 'CloudSync';

  /**
   * Retrieve package settings.
   */
  async getPkgConfig(): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get_config',
    });
  }

  /**
   * Retrieve a list of current cloud connections.
   *
   * @param groupBy - How to group connections: 'group_by_user' or 'group_by_cloud_type'
   */
  async getConnections(
    groupBy: 'group_by_user' | 'group_by_cloud_type' = 'group_by_user',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list_conn',
      is_tray: false,
      group_by: groupBy,
    });
  }

  /**
   * Retrieve settings for a specific connection.
   *
   * @param connId - The connection ID, obtained from getConnections()
   */
  async getConnectionSettings(connId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get_connection_setting',
      connection_id: connId,
    });
  }

  /**
   * Retrieve cloud information for a specific connection.
   *
   * @param connId - The connection ID, obtained from getConnections()
   */
  async getConnectionInformation(connId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get_property',
      connection_id: connId,
    });
  }

  /**
   * Retrieve authentication information for a specific connection.
   *
   * @param connId - The connection ID, obtained from getConnections()
   */
  async getConnectionAuth(connId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get_conn_auth_info',
      connection_id: connId,
    });
  }

  /**
   * Retrieve logs for a specific connection.
   *
   * @param connId - The connection ID
   * @param keyword - Keyword to filter logs
   * @param dateFrom - Starting date in epoch format
   * @param dateTo - Ending date in epoch format
   * @param logLevel - Log level filter: -1=all, 0=info, 1=warning, 2=error
   * @param action - Action filter: -1=all, 0=delete remote, 1=download, 2=upload,
   *                 3=delete local, 4=rename remote, 8=merge, 9=merge deletion
   * @param offset - Log offset for pagination
   * @param limit - Number of logs to retrieve
   */
  async getConnectionLogs(
    connId: number,
    keyword = '',
    dateFrom = 0,
    dateTo = 0,
    logLevel = -1,
    action = -1,
    offset = 0,
    limit = 200,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get_log',
      connection_id: connId,
      offset,
      keyword,
      date_from: dateFrom,
      date_to: dateTo,
      log_level: logLevel,
      action,
      limit,
    });
  }

  /**
   * Retrieve a list of tasks related to a specific connection.
   *
   * @param connId - The connection ID
   */
  async getTasks(connId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list_sess',
      connection_id: connId,
    });
  }

  /**
   * Retrieve filter information for a specific task.
   *
   * @param sessId - The task/session ID, obtained from getTasks()
   */
  async getTaskFilters(sessId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get_selective_sync_config',
      session_id: sessId,
    });
  }

  /**
   * Retrieve a list of children directories in the cloud for a specific task.
   *
   * @param sessId - The task/session ID
   * @param remoteFolderId - The remote folder ID, obtained from getTasks()
   * @param path - The folder path to retrieve children from (defaults to root '/')
   */
  async getTaskCloudFolders(
    sessId: number,
    remoteFolderId: string,
    path = '/',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get_selective_folder_list',
      session_id: sessId,
      path,
      file_id: remoteFolderId,
      exists_type: 'null',
    });
  }

  /**
   * Retrieve the 5 latest modified files and the currently syncing items.
   */
  async getRecentlyModified(): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get_recently_change',
    });
  }

  /**
   * Set package configuration settings.
   *
   * @param pkgVolume - Volume path where package data is stored (e.g., '/volume1')
   * @param logCount - Maximum number of logs per connection (max 100000)
   * @param workers - Number of concurrent uploads (max 20)
   * @param adminMode - Whether all users' tasks are retrieved
   */
  async setPkgConfig(
    pkgVolume: string,
    logCount = 20000,
    workers = 3,
    adminMode = true,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set_global_config',
      repo_vol_path: pkgVolume,
      log_count: logCount,
      worker_count: workers,
      admin_mode: adminMode ? 'enable' : 'disable',
    });
  }

  /**
   * Set the relinking behavior for personal user accounts.
   *
   * WARNING: Misconfiguration may lead to data loss.
   *
   * @param deleteFromCloud - false = locally deleted files are re-fetched from cloud;
   *                          true = locally deleted files are also removed from cloud
   */
  async setRelinkBehavior(deleteFromCloud: boolean): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set_personal_config',
      sync_mode: deleteFromCloud,
    });
  }

  /**
   * Set settings for a specific cloud connection.
   *
   * @param connId - The connection ID
   * @param taskName - The cloud sync task name
   * @param pullEventPeriod - Frequency (seconds) to pull event updates
   * @param maxUploadSpeed - Maximum upload speed in bytes (0 = unlimited)
   * @param maxDownloadSpeed - Maximum download speed in bytes (0 = unlimited)
   * @param storageClass - Cloud-specific storage class
   * @param isSSE - Enable Security Service Edge for compatible clouds
   * @param partSize - Part size for file uploads (in MB)
   */
  async setConnectionSettings(
    connId: string | number,
    taskName: string,
    pullEventPeriod = 60,
    maxUploadSpeed = 0,
    maxDownloadSpeed = 0,
    storageClass = '',
    isSSE = false,
    partSize = 128,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set_connection_setting',
      connection_id: connId,
      task_name: taskName,
      pull_event_period: pullEventPeriod,
      max_upload_speed: maxUploadSpeed,
      max_download_speed: maxDownloadSpeed,
      storage_class: `"${storageClass}"`,
      isSSE,
      part_size: partSize,
    });
  }

  /**
   * Set the schedule for a specific connection.
   *
   * @param connId - The connection ID
   * @param enable - Whether scheduling is enabled
   * @param scheduleInfo - Array of 7 strings (Sunday..Saturday), each 24 chars of '1'/'0'.
   *                       If invalid or omitted, defaults to all-enabled.
   */
  async setConnectionSchedule(
    connId: number,
    enable: boolean,
    scheduleInfo: string[] = [],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    let scheduleStr: string;
    const joined = scheduleInfo.join('');
    if (scheduleInfo.length !== 7 || joined.length !== 168) {
      scheduleStr = '1'.repeat(24 * 7);
    } else {
      scheduleStr = joined;
    }

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set_schedule_setting',
      connection_id: connId,
      is_enabled_schedule: enable,
      schedule_info: `"${scheduleStr}"`,
    });
  }

  /**
   * Set the task settings for a specific session.
   *
   * @param sessId - The task/session ID
   * @param syncDirection - Sync direction: ONLY_UPLOAD, BIDIRECTION, or ONLY_DOWNLOAD
   * @param consistencyCheck - Enable advanced consistency check (more resources)
   * @param noDeleteOnCloud - Prevent deletion of remote files when removed locally
   * @param convertGd - Convert Google Drive documents to Microsoft Office format
   */
  async setTaskSettings(
    sessId: number,
    syncDirection: SyncDirection,
    consistencyCheck = true,
    noDeleteOnCloud = true,
    convertGd = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set_session_setting',
      session_id: sessId,
      sync_direction: syncDirection,
      sync_attr_check_option: consistencyCheck,
      no_delete: noDeleteOnCloud,
      google_drive_convert_online_doc: convertGd,
    });
  }

  /**
   * Set task filters for selective synchronization.
   *
   * @param sessId - The task/session ID
   * @param filteredPaths - Paths to exclude from sync (e.g., ['/images', '/videos/movies'])
   * @param filteredFilenames - Filenames to exclude
   * @param filteredExtensions - File extensions to exclude (e.g., ['mp3', 'iso', 'mkv'])
   * @param maxUploadSize - Maximum file size for uploads in bytes (0 = no limit)
   */
  async setTaskFilters(
    sessId: number,
    filteredPaths: string[] = [],
    filteredFilenames: string[] = [],
    filteredExtensions: string[] = [],
    maxUploadSize = 0,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    // Use JSON.stringify to convert arrays to '["text"]' format as required by the API
    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set_selective_sync_config',
      session_id: sessId,
      filtered_paths: JSON.stringify(filteredPaths),
      filtered_names: JSON.stringify(filteredFilenames),
      filtered_extensions: JSON.stringify(filteredExtensions),
      user_defined_names: JSON.stringify(filteredFilenames),
      user_defined_extensions: JSON.stringify(filteredExtensions),
      filtered_max_upload_size: maxUploadSize,
    });
  }

  /**
   * Pause one or all connections.
   *
   * @param connId - Connection ID to pause. -1 (default) pauses all connections.
   */
  async connectionPause(connId = -1): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.minVersion,
      method: 'pause',
    };

    if (connId > -1) {
      params['connection_id'] = connId;
    }

    return this.request(apiName, info.path, params);
  }

  /**
   * Resume one or all connections.
   *
   * @param connId - Connection ID to resume. -1 (default) resumes all connections.
   */
  async connectionResume(connId = -1): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.minVersion,
      method: 'resume',
    };

    if (connId > -1) {
      params['connection_id'] = connId;
    }

    return this.request(apiName, info.path, params);
  }

  /**
   * Remove a specific connection and all associated tasks.
   * Data will remain in both local and remote directories.
   *
   * @param connId - The connection ID to remove
   */
  async connectionRemove(connId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'unlink_connection',
      connection_id: connId,
    });
  }

  /**
   * Remove a specific task.
   * Data will remain in both local and remote directories.
   *
   * @param connId - The connection ID associated with the task
   * @param sessId - The task/session ID to remove
   */
  async taskRemove(connId: number, sessId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'unlink_session',
      connection_id: connId,
      session_id: sessId,
    });
  }

  /**
   * Generate parameters for creating a sync task with Amazon S3.
   * This is a private helper method used by createSyncTaskS3 and testTaskSetting.
   */
  private async generateSyncTaskS3Params(
    connId: number,
    localPath: string,
    cloudPath: string,
    syncDirection: SyncDirection = 'BIDIRECTION',
    storageClass: StorageClass = 'STANDARD',
    fileFilter: string[] = [],
    filterMaxUploadSize = 0,
    filterNames: string[] = [],
    serverFolderId = '',
  ): Promise<Record<string, unknown>> {
    // Validate local path format
    if (localPath[0] !== '/' || localPath.split('/').length < 3) {
      throw new Error(
        'Invalid local path, must be in format /<share_folder>/<sub_directory>',
      );
    }

    // Validate cloud path format
    if (cloudPath[0] !== '/' || cloudPath[cloudPath.length - 1] === '/') {
      throw new Error(
        'Invalid cloud path, must start with / and not end with /',
      );
    }

    // Get connection authentication details
    const auth = await this.getConnectionAuth(connId);
    if (!auth.data) {
      throw new Error('Failed to retrieve connection auth data');
    }

    // Extract path components
    const pathShare = localPath.split('/')[1] ?? '';
    const secondSlashIdx = localPath.indexOf('/', 1);
    const pathSync = localPath.slice(secondSlashIdx);

    // Build request parameters
    const sessionParams: S3SessionParams = {
      path: localPath,
      path_share: pathShare,
      path_sync: pathSync,
      filter_file: {
        filtered_extensions: fileFilter,
        filtered_max_upload_size: filterMaxUploadSize,
        filtered_names: filterNames,
      },
      sync_direction: syncDirection,
      server_folder: cloudPath,
      server_folder_path: cloudPath,
      server_folder_id: serverFolderId,
      part_size: '',
      storage_class: storageClass,
      server_folder_meta_list: makeFolderMetaListFromPath(cloudPath),
      filter_folder: [],
      filter_changed: false,
      no_delete: false,
      isSSE: false,
      server_encryption: false,
      sync_attr_check_option: true,
      mode_add_session: true,
    };

    // Merge authentication details with request parameters
    const authData = auth.data as Record<string, unknown>;
    return mergeDicts(authData, sessionParams as unknown as Record<string, unknown>);
  }

  /**
   * Create a new Amazon S3 synchronization task.
   *
   * @param connId - The connection ID (must be an S3 connection)
   * @param localPath - Local path to sync (format: /<share>/<sub_dir>)
   * @param cloudPath - Cloud path to sync (must start with / and not end with /)
   * @param syncDirection - Sync direction
   * @param storageClass - S3 storage class
   * @param fileFilter - File extensions to filter
   * @param filterMaxUploadSize - Maximum upload size
   * @param filterNames - File names to filter
   */
  async createSyncTaskS3(
    connId: number,
    localPath: string,
    cloudPath: string,
    syncDirection: SyncDirection = 'BIDIRECTION',
    storageClass: StorageClass = 'STANDARD',
    fileFilter: string[] = [],
    filterMaxUploadSize = 0,
    filterNames: string[] = [],
  ): Promise<S3TaskResult> {
    // Validate the connection is Amazon S3
    const connInfo = await this.getConnectionInformation(connId);
    const connData = connInfo.data as Record<string, unknown> | undefined;
    if (!connData || connData['type'] !== 'az') {
      return { ok: false, reason: 'Connection is not Amazon S3' };
    }

    // Generate creation parameters
    const creationParams = await this.generateSyncTaskS3Params(
      connId,
      localPath,
      cloudPath,
      syncDirection,
      storageClass,
      fileFilter,
      filterMaxUploadSize,
      filterNames,
    );

    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    // Run test task setting first
    const testResult = await this.testTaskSetting(
      connId,
      localPath,
      cloudPath,
      syncDirection,
      storageClass,
      fileFilter,
      filterMaxUploadSize,
      filterNames,
    );

    if (!testResult.ok) {
      return { ok: false, reason: testResult.reason };
    }

    // Build compound request
    const result = await this.batchRequest(
      [
        {
          api: apiName,
          method: 'create_session',
          version: info.minVersion,
          conn_info: creationParams,
        },
        {
          api: apiName,
          method: 'list_sess',
          version: info.minVersion,
          connection_id: connId,
        },
      ],
      { method: 'post' },
    );

    return { ok: true, data: result };
  }

  /**
   * Test task settings to verify they are valid.
   *
   * @param connId - The connection ID
   * @param localPath - Local path to sync
   * @param cloudPath - Cloud path to sync
   * @param syncDirection - Sync direction
   * @param storageClass - Storage class
   * @param fileFilter - File extensions to filter
   * @param filterMaxUploadSize - Maximum upload size
   * @param filterNames - File names to filter
   */
  async testTaskSetting(
    connId: number,
    localPath: string,
    cloudPath: string,
    syncDirection: SyncDirection = 'BIDIRECTION',
    storageClass: StorageClass = 'STANDARD',
    fileFilter: string[] = [],
    filterMaxUploadSize = 0,
    filterNames: string[] = [],
  ): Promise<S3TaskResult> {
    // Generate sync task parameters
    const creationParams = await this.generateSyncTaskS3Params(
      connId,
      localPath,
      cloudPath,
      syncDirection,
      storageClass,
      fileFilter,
      filterMaxUploadSize,
      filterNames,
    );

    const apiName = 'SYNO.CloudSync';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    // Send batch request to test settings
    const result = await this.batchRequest(
      [
        {
          api: apiName,
          method: 'test_task_setting',
          version: info.minVersion,
          conn_info: creationParams,
        },
      ],
      { method: 'post' },
    );

    // Check if the request was successful
    const resultData = result.data as Record<string, unknown> | undefined;
    if (result !== null && resultData && resultData['has_fail'] === false) {
      return { ok: true, data: result };
    }

    return { ok: false, reason: 'Invalid task setting' };
  }
}
